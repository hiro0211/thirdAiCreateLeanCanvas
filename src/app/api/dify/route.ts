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

async function handlePersonaStreaming(
  body: any,
  difyClient: DifyApiClient,
  logger: Logger
) {
  try {
    // リクエストバリデーション
    if (
      !body.keyword ||
      typeof body.keyword !== "string" ||
      body.keyword.trim() === ""
    ) {
      throw new Error("キーワードが必要です");
    }

    const difyRequest = {
      inputs: {
        keyword: body.keyword.trim(),
      },
      query: `キーワード「${body.keyword.trim()}」に基づいて10個のペルソナを生成してください。JSON形式で個別のペルソナオブジェクトを返してください。`,
      task: "persona",
    };

    logger.info("Initiating persona streaming", {
      keyword: body.keyword,
    });

    // Difyクライアントからストリーミングレスポンスを取得
    const difyResponse = await difyClient.callStreamingApi(difyRequest);

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
    logger.error(error, { task: "persona_streaming" });

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
                  : "ペルソナ生成中にエラーが発生しました",
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

    // ペルソナ生成でストリーミングが要求された場合
    if (task === "persona" && streaming) {
      return handlePersonaStreaming(body, difyClient, logger);
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
