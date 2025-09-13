import { NextRequest, NextResponse } from "next/server";
import { DifyApiClient } from "@/lib/dify/client";
import { createDifyConfig } from "@/lib/config/env-config";
import { Logger } from "@/lib/utils/logger";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { ERROR_MESSAGES } from "@/lib/constants/messages";

async function handleEventSourceRequest(
  body: any,
  difyClient: DifyApiClient,
  logger: Logger
) {
  try {
    logger.info("Starting EventSource streaming request", {
      task: body.task,
      hasInputs: !!body.inputs,
      inputKeys: body.inputs ? Object.keys(body.inputs) : [],
    });

    // DifyクライアントからストリーミングAPIを呼び出し
    const difyResponse = await difyClient.callStreamingApi({
      task: body.task,
      inputs: body.inputs || {},
      user: body.user || "anonymous",
    });

    logger.info("Dify streaming API response received", {
      status: difyResponse.status,
      headers: Object.fromEntries(difyResponse.headers.entries()),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      logger.error("Dify streaming API error", {
        status: difyResponse.status,
        statusText: difyResponse.statusText,
        errorText: errorText,
      });

      // エラー用のSSEレスポンス
      const errorStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                event: "error",
                error: `HTTP ${difyResponse.status}: ${errorText}`,
              })}\n\n`
            )
          );
          controller.close();
        },
      });

      return new Response(errorStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const isStreamingResponse = difyResponse.headers
      .get("content-type")
      ?.includes("text/event-stream");

    if (!isStreamingResponse) {
      // ブロッキングレスポンスの場合、ストリーミング形式に変換
      const responseText = await difyResponse.text();

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          // retry設定で自動再接続を実質無効化
          controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                event: "message",
                answer: responseText,
              })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                event: "message_end",
              })}\n\n`
            )
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // DifyからのストリームをEventSource用に変換
    const transformedStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // retry設定で自動再接続を実質無効化
        controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
      },
      async pull(controller) {
        if (!difyResponse.body) {
          controller.close();
          return;
        }

        const reader = difyResponse.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        } catch (error) {
          logger.error("Error reading from Dify stream", { error });
          controller.error(error);
        }
      },
    });

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    logger.error(error, { task: body.task });

    // エラー用のSSEレスポンス
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "予期しないエラーが発生しました",
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      status: 200, // SSEでは常に200を返す
    });
  }
}

export async function GET(request: NextRequest) {
  const logger = new Logger("SSE_API_HANDLER");

  try {
    // クエリパラメータからリクエストデータを取得
    const { searchParams } = new URL(request.url);
    const requestParam = searchParams.get("request");

    if (!requestParam) {
      throw new Error("リクエストパラメータが見つかりません");
    }

    const body = JSON.parse(requestParam);
    const { task } = body;

    logger.info(`Processing EventSource request for task: ${task}`, {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent")?.substring(0, 100),
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);

    return handleEventSourceRequest(body, difyClient, logger);
  } catch (error) {
    let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      logger.error(error, {
        message: error.message,
        stack: error.stack,
      });

      if (error.message.includes("timeout")) {
        errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
        statusCode = 408;
      }
    }

    // エラー用のSSEレスポンス
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "error",
              error: errorMessage,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      status: 200, // SSEでは常に200を返す
    });
  }
}

