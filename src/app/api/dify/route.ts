import { NextRequest, NextResponse } from "next/server";
import { DifyApiClient, DifyConfig } from "@/lib/dify/client";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { Logger } from "@/lib/utils/logger";
import { ApiResponse } from "@/lib/types";

function createDifyConfig(): DifyConfig {
  const apiKey = process.env.DIFY_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_DIFY_API_URL;
  return {
    apiKey: apiKey || "",
    apiUrl: apiUrl || "",
    isDemoMode: !apiKey || apiKey === "" || apiKey === "demo",
  };
}

export async function POST(request: NextRequest) {
  const logger = new Logger("API_HANDLER");
  let body: any = null;
  
  try {
    body = await request.json();
    const { task } = body;

    logger.info(`Processing request for task: ${task}`, {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent")?.substring(0, 100),
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create(task, difyClient);
    const result = await processor.process(body);

    return NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse<typeof result>);
    
  } catch (error) {
    let errorMessage = "サーバーエラーが発生しました";
    let statusCode = 500;

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
      } else if (error.message.includes("が必要です") || error.message.includes("が不足しています")) {
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