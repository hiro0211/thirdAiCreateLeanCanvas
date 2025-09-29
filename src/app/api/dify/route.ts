import { NextRequest, NextResponse } from "next/server";
import { DifyApiClient, DifyConfig } from "@/lib/dify/client";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { PersonaNormalizer } from "@/lib/dify/normalizers";
import { Logger } from "@/lib/utils/logger";
import { ApiResponse, Persona } from "@/lib/types";
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

    // ストリーミングリクエストの場合
    if (streaming && task === 'persona') {
      return handleStreamingRequest(difyClient, body, logger);
    }

    // 従来の非ストリーミングリクエスト
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

async function handleStreamingRequest(
  difyClient: DifyApiClient,
  body: any,
  logger: Logger
): Promise<Response> {
  try {
    const { keyword } = body;

    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      throw new Error("キーワードが必要です");
    }

    const difyRequest = {
      inputs: {
        keyword: keyword.trim(),
      },
      query: `キーワード「${keyword.trim()}」に基づいて10個のペルソナを生成してください。JSON形式で {personas: [...]} として返してください。`,
      task: "persona",
    };

    const stream = await difyClient.callApiStream(difyRequest);
    const normalizer = new PersonaNormalizer();

    // ストリーミングレスポンスを作成
    const responseStream = new ReadableStream({
      start(controller) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let processedPersonas: Persona[] = [];

        function processChunk(): Promise<void> {
          return reader.read().then(({ done, value }): Promise<void> | void => {
            if (done) {
              // 最終的な処理
              if (accumulatedText) {
                try {
                  const finalPersonas = normalizer.normalize({ text: accumulatedText });
                  const newPersonas = finalPersonas.slice(processedPersonas.length);

                  newPersonas.forEach(persona => {
                    const chunk = `data: ${JSON.stringify({
                      type: 'persona',
                      data: persona
                    })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(chunk));
                  });
                } catch (error) {
                  logger.error(error, { context: 'Final persona processing' });
                }
              }

              // ストリーム終了
              const endChunk = `data: ${JSON.stringify({ type: 'end' })}\n\n`;
              controller.enqueue(new TextEncoder().encode(endChunk));
              controller.close();
              return;
            }

            // DifyのServer-Sent Eventsをパース
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);

                if (data.trim() === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);

                  // messageイベントからanswerを抽出してaccumulatedTextに追加
                  if (parsed.event === 'message' && parsed.answer) {
                    accumulatedText += parsed.answer;

                    // 連続するJSONオブジェクトをパースして新しいペルソナを抽出
                    try {
                      const allPersonas = normalizer.normalize({ text: accumulatedText });
                      const newPersonas = allPersonas.slice(processedPersonas.length);

                      // 新しいペルソナを1つずつ送信
                      newPersonas.forEach(persona => {
                        const personaChunk = `data: ${JSON.stringify({
                          type: 'persona',
                          data: persona
                        })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(personaChunk));
                        processedPersonas.push(persona);
                      });
                    } catch (error) {
                      // パースエラーは無視（まだ完全なJSONが揃っていない可能性）
                    }
                  }

                  // workflow_finishedイベントで終了
                  if (parsed.event === 'message_end' || parsed.event === 'workflow_finished') {
                    // 最終処理は上記のdone処理で実行
                    return processChunk();
                  }
                } catch (e) {
                  // JSONパースエラーは無視
                }
              }
            }

            return processChunk();
          });
        }

        processChunk().catch((error: any) => {
          logger.error(error, { context: 'Stream processing' });
          const errorChunk = `data: ${JSON.stringify({
            type: 'error',
            message: 'ストリーミング処理中にエラーが発生しました'
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorChunk));
          controller.close();
        });
      }
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    const errorId = logger.error(error, {
      context: 'Streaming request handler',
      task: body?.task,
    });

    const errorStream = new ReadableStream({
      start(controller) {
        const errorChunk = `data: ${JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'ストリーミング処理中にエラーが発生しました',
          errorId
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(errorChunk));
        controller.close();
      }
    });

    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      status: 500,
    });
  }
}
