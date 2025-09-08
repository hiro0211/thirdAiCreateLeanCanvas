import { NextRequest, NextResponse } from "next/server";
import { DifyApiClient, DifyConfig } from "@/lib/dify/client";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { Logger } from "@/lib/utils/logger";
import { ApiResponse } from "@/lib/types";
import { ENV_CONFIG } from "@/lib/config/env-config";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import { API_CONFIG } from "@/lib/constants/app-constants";

function createDifyConfig(): DifyConfig {
  return {
    apiKey: ENV_CONFIG.DIFY_API_KEY,
    apiUrl: ENV_CONFIG.DIFY_API_URL,
    isDemoMode: ENV_CONFIG.IS_DEMO_MODE,
  };
}

async function handleStreamingRequest(
  body: any,
  difyClient: DifyApiClient,
  logger: Logger
) {
  try {
    console.log("🎯 [DEBUG] API Route - Streaming Request:");
    console.log("📦 Request Body:", JSON.stringify(body, null, 2));

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
          query: `キーワード「${body.keyword.trim()}」に基づいて10個のペルソナを生成してください。JSON形式で個別のペルソナオブジェクトを返してください。`,
          task: "persona",
        };
        break;

      case "canvas":
        if (!body.persona || !body.business_idea || !body.product_name) {
          throw new Error("リーンキャンバス生成に必要な情報が不足しています");
        }
        difyRequest = {
          inputs: {
            persona: body.persona,
            business_idea: body.business_idea,
            product_name: body.product_name,
          },
          query: "提供された情報に基づいてリーンキャンバスを生成してください。",
          task: "canvas",
        };
        break;

      default:
        throw new Error(`未対応のストリーミングタスク: ${task}`);
    }

    console.log("🎯 [DEBUG] API Route - Dify Request Details:");
    console.log("📦 Dify Request:", JSON.stringify(difyRequest, null, 2));

    logger.info(`Initiating ${task} streaming`, {
      task,
      difyRequest: difyRequest,
    });

    // Difyクライアントからストリーミングレスポンスを取得
    const difyResponse = await difyClient.callStreamingApi(difyRequest);

    console.log("📥 [DEBUG] API Route - Dify Response Details:");
    console.log("📊 Status:", difyResponse.status, difyResponse.statusText);
    console.log("📋 Response Headers:");
    difyResponse.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log("🌊 Response Body Type:", difyResponse.body?.constructor.name);
    console.log("🔄 Content-Type:", difyResponse.headers.get("content-type"));
    console.log(
      "🔄 Is Streaming Response:",
      difyResponse.headers.get("content-type")?.includes("text/event-stream")
    );

    // ストリーミングかブロッキングかを判定
    const isStreamingResponse = difyResponse.headers
      .get("content-type")
      ?.includes("text/event-stream");

    if (!isStreamingResponse) {
      console.warn(
        "⚠️ [DEBUG] API Route - Dify returned non-streaming response!"
      );
      console.warn("📋 Expected: text/event-stream");
      console.warn("📋 Actual:", difyResponse.headers.get("content-type"));

      // ブロッキングレスポンスの場合、内容を読み取ってログ出力
      const responseText = await difyResponse.text();
      console.log("📝 [DEBUG] Non-streaming Response Body:", responseText);

      // 新しいレスポンスを作成してストリーミング形式に変換
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
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

    console.log(
      "✅ [DEBUG] API Route - Streaming response detected, proxying..."
    );

    // デバッグ用: ストリーミングデータの内容をログ出力
    if (process.env.NODE_ENV === "development") {
      const reader = difyResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const debugStream = new ReadableStream({
        start(controller) {
          const pump = async () => {
            while (true) {
              const { done, value } = await reader!.read();

              if (done) {
                console.log("🏁 [DEBUG] Stream ended");
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;

              console.log("📦 [DEBUG] Received chunk:", chunk);

              // 行ごとに分析
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.trim()) {
                  console.log("📝 [DEBUG] SSE Line:", line);
                }
              }

              controller.enqueue(value);
            }
          };
          pump().catch((err) => {
            console.error("❌ [DEBUG] Stream error:", err);
            controller.error(err);
          });
        },
      });

      return new Response(debugStream, {
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

    // 本番環境では通常のプロキシ
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
