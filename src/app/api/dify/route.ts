import { NextRequest, NextResponse } from "next/server";
import { DifyApiClient } from "@/lib/dify/client";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { Logger } from "@/lib/utils/logger";
import { ApiResponse } from "@/lib/types";
import { createDifyConfig } from "@/lib/config/env-config";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { API_CONFIG } from "@/lib/constants/app-constants";

async function handleStreamingRequest(
  body: any,
  difyClient: DifyApiClient,
  logger: Logger
) {
  try {
    const { task } = body;
    let difyRequest: any;

    // タスクに応じたリクエスト作成
    switch (task) {
      case "persona":
        if (
          !body.keyword ||
          typeof body.keyword !== "string" ||
          body.keyword.trim() === ""
        ) {
          throw new Error("キーワードが必要です");
        }
        difyRequest = {
          inputs: {
            keyword: body.keyword.trim(),
          },
          query: `キーワード「${body.keyword.trim()}」に基づいて10個のペルソナを生成してください。`,
          task: "persona",
        };
        break;

      case "businessidea":
        if (!body.persona) {
          throw new Error("ペルソナが必要です");
        }
        difyRequest = {
          inputs: {
            persona: JSON.stringify(body.persona),
            creativity_level: body.creativity_level || "medium",
          },
          query:
            "選択されたペルソナに基づいて10個のビジネスアイデアを生成してください。",
          task: "businessidea",
        };
        break;

      case "productname":
        if (!body.persona || !body.business_idea || !body.product_details) {
          throw new Error("プロダクト名生成に必要な情報が不足しています");
        }
        difyRequest = {
          inputs: {
            persona: JSON.stringify(body.persona),
            business_idea: JSON.stringify(body.business_idea),
            product_details: JSON.stringify(body.product_details),
          },
          query:
            "提供された情報に基づいて10個のプロダクト名を生成してください。",
          task: "productname",
        };
        break;

      case "canvas":
        if (!body.persona || !body.business_idea || !body.product_name) {
          throw new Error("リーンキャンバス生成に必要な情報が不足しています");
        }
        difyRequest = {
          inputs: {
            persona: JSON.stringify(body.persona),
            business_idea: JSON.stringify(body.business_idea),
            product_name: JSON.stringify(body.product_name),
          },
          query: "提供された情報に基づいてリーンキャンバスを生成してください。",
          task: "canvas",
        };
        break;

      default:
        throw new Error(`未対応のストリーミングタスク: ${task}`);
    }

    logger.info(`Initiating ${task} streaming`, {
      task,
      inputKeys: Object.keys(difyRequest.inputs),
    });

    // Difyクライアントからストリーミングレスポンスを取得
    const difyResponse = await difyClient.callStreamingApi(difyRequest);

    // ストリーミングかブロッキングかを判定
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
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Difyからのストリームをそのままクライアントにプロキシ
    return new Response(difyResponse.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    logger.error(error, { task: body.task });

    // エラーの場合もSSE形式でレスポンス
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "error",
              error:
                error instanceof Error
                  ? error.message
                  : `${body.task}生成中にエラーが発生しました`,
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
      },
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const logger = new Logger("API_HANDLER");
  let body: any = null;

  try {
    body = await request.json();
    const { task, streaming } = body;

    logger.info(`Processing request for task: ${task}`, {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent")?.substring(0, 100),
      streaming: !!streaming,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);

    // ストリーミングが要求された場合
    if (streaming) {
      return handleStreamingRequest(body, difyClient, logger);
    }

    // 従来の非ストリーミング処理
    const processor = TaskProcessorFactory.create(task, difyClient);
    const result = await processor.process(body);

    return NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
  } catch (error) {
    let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;
    let statusCode: number = API_CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR;

    if (error instanceof Error) {
      if (error.message.includes("タイムアウト")) {
        errorMessage = error.message;
        statusCode = 408;
      } else if (error.message.includes("Dify API error: 400")) {
        errorMessage =
          "Difyワークフローの設定に問題があります。管理者に連絡してください。";
        statusCode = 400;
      } else if (error.message.includes("Dify API error: 401")) {
        errorMessage =
          "Dify APIの認証に失敗しました。API設定を確認してください。";
        statusCode = 401;
      } else if (error.message.includes("Dify API error: 404")) {
        errorMessage =
          "Difyワークフローが見つかりません。設定を確認してください。";
        statusCode = 404;
      } else if (error.message.includes("未知のタスク")) {
        errorMessage = error.message;
        statusCode = 400;
      } else if (
        error.message.includes("が必要です") ||
        error.message.includes("が不足しています")
      ) {
        errorMessage = error.message;
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }

    const errorId = logger.error(error, {
      task: body?.task,
      errorMessage,
      statusCode,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorMessage,
        },
      } as ApiResponse<never>,
      { status: statusCode }
    );
  }
}
