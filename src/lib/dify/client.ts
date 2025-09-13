import { Logger } from "../utils/logger";
import { ENV_CONFIG } from "../config/env-config";
import { API_CONFIG } from "../constants/app-constants";
import type { DifyConfig } from "../config/env-config";

export interface DifyRequest {
  inputs: Record<string, any>;
  query?: string;
  task?: string;
}

export class DifyApiClient {
  private logger = new Logger("DifyApiClient");

  constructor(private config: DifyConfig) {}

  async callApi(request: DifyRequest): Promise<any> {
    if (this.config.isDemoMode) {
      return this.handleDemoMode(request);
    }
    return this.callRealApi(request);
  }

  async callStreamingApi(request: DifyRequest): Promise<Response> {
    if (this.config.isDemoMode) {
      return this.handleStreamingDemoMode(request);
    }
    return this.callRealStreamingApi(request);
  }

  private async handleDemoMode(request: DifyRequest): Promise<any> {
    this.logger.info("Using demo mode - mock data will be returned", {
      task: request.task,
      inputKeys: Object.keys(request.inputs),
    });

    // Real API call simulation with delay
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        ENV_CONFIG.DEMO_MODE_MIN_DELAY +
          Math.random() *
            (ENV_CONFIG.DEMO_MODE_MAX_DELAY - ENV_CONFIG.DEMO_MODE_MIN_DELAY)
      )
    );

    const { MockDataGenerator } = await import("./mock-generator");
    return MockDataGenerator.generate(
      request.task || "unknown",
      request.inputs
    );
  }

  private async callRealApi(request: DifyRequest): Promise<any> {
    if (!this.config.apiKey || !this.config.apiUrl) {
      throw new Error("Dify API configuration is missing");
    }

    // Dify chat application API endpoint
    const apiEndpoint = `${this.config.apiUrl}${API_CONFIG.DIFY_ENDPOINT}`;

    const requestBody = {
      inputs: {
        task: request.task,
        ...request.inputs,
      },
      query: request.query || `Please perform task: ${request.task}`,
      response_mode: "blocking",
      user: API_CONFIG.DEFAULT_USER_ID,
      conversation_id: "",
    };

    // Development environment logging
    if (process.env.NODE_ENV === "development") {
      this.logger.info(`Request for task: ${request.task}`, {
        endpoint: apiEndpoint,
        inputKeys: Object.keys(request.inputs),
      });
    }

    try {
      this.logger.info(`Making API request to ${apiEndpoint}`, {
        task: request.task,
        inputKeys: Object.keys(request.inputs),
        hasApiKey: !!this.config.apiKey,
      });

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(ENV_CONFIG.API_TIMEOUT), // Configurable timeout
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorId = this.logger.error(
          new Error(`API request failed: ${response.status}`),
          {
            status: response.status,
            statusText: response.statusText,
            endpoint: apiEndpoint,
            task: request.task,
            responseLength: responseText.length,
            // Only log response body in development
            ...(process.env.NODE_ENV === "development" && {
              responseBody: responseText,
            }),
          }
        );
        throw new Error(
          `Dify API error: ${response.status}. Error ID: ${errorId}`
        );
      }

      let result;
      try {
        result = JSON.parse(responseText);
        this.logger.info("API request successful", {
          task: request.task,
          responseType: typeof result,
          hasAnswer: !!result.answer,
        });
      } catch (e) {
        const errorId = this.logger.error(e, {
          task: request.task,
          responseLength: responseText.length,
          responsePreview: responseText.substring(0, 200),
        });
        throw new Error(`Failed to parse JSON response. Error ID: ${errorId}`);
      }

      if (result.status === "failed") {
        const errorId = this.logger.error(
          new Error("Dify workflow execution failed"),
          {
            task: request.task,
            difyError: result.error,
          }
        );
        throw new Error(`Dify workflow failed. Error ID: ${errorId}`);
      }

      // Process response from Dify chat app
      if (result.answer) {
        try {
          // Parse answer if it's a JSON string
          const parsedAnswer = JSON.parse(result.answer);
          return parsedAnswer;
        } catch (e) {
          // Return as text if not JSON
          return { text: result.answer };
        }
      }

      // Return direct JSON object response
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorId = this.logger.error(error, {
          task: request.task,
          timeout: 60000,
        });
        throw new Error(`Dify API request timed out. Error ID: ${errorId}`);
      }

      // Check if error is already logged
      if (error instanceof Error && error.message.includes("Error ID:")) {
        throw error;
      }

      // Log unexpected errors
      const errorId = this.logger.error(error, { task: request.task });
      throw new Error(`Unexpected error occurred. Error ID: ${errorId}`);
    }
  }

  private async handleStreamingDemoMode(
    request: DifyRequest
  ): Promise<Response> {
    this.logger.info(
      "Using streaming demo mode - mock SSE data will be returned",
      {
        task: request.task,
        inputKeys: Object.keys(request.inputs),
      }
    );

    // ペルソナ生成のモックストリーミングレスポンスを作成
    if (request.task === "persona") {
      return this.createMockPersonaStream(request);
    }

    // その他のタスクは通常のレスポンスを返す
    const mockData = await this.handleDemoMode(request);
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // retry設定で自動再接続を実質無効化
        controller.enqueue(encoder.encode(`retry: 100000000\n\n`));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              event: "message",
              answer: JSON.stringify(mockData),
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
      },
    });
  }

  private async createMockPersonaStream(
    request: DifyRequest
  ): Promise<Response> {
    const { MockDataGenerator } = await import("./mock-generator");
    const mockData = MockDataGenerator.generate("persona", request.inputs);

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        // retry設定で自動再接続を実質無効化
        controller.enqueue(encoder.encode(`retry: 100000000\n\n`));

        // 各ペルソナを個別に送信
        if (mockData.personas && Array.isArray(mockData.personas)) {
          let personaIndex = 0;

          const sendNextPersona = () => {
            if (personaIndex < mockData.personas.length) {
              const persona = mockData.personas[personaIndex];
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    event: "message",
                    answer: JSON.stringify(persona),
                  })}\n\n`
                )
              );

              personaIndex++;

              // 次のペルソナを500ms後に送信
              if (personaIndex < mockData.personas.length) {
                setTimeout(sendNextPersona, 500);
              } else {
                // 全てのペルソナを送信完了、終了イベントを送信
                setTimeout(() => {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        event: "message_end",
                      })}\n\n`
                    )
                  );
                  controller.close();
                }, 300);
              }
            }
          };

          // 最初のペルソナを送信開始
          setTimeout(sendNextPersona, 100);
        } else {
          // フォールバック: 全データを一度に送信
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                event: "message",
                answer: JSON.stringify(mockData),
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
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  private async callRealStreamingApi(request: DifyRequest): Promise<Response> {
    if (!this.config.apiKey || !this.config.apiUrl) {
      throw new Error("Dify API configuration is missing");
    }

    const apiEndpoint = `${this.config.apiUrl}${API_CONFIG.DIFY_ENDPOINT}`;

    const requestBody = {
      inputs: {
        task: request.task,
        ...request.inputs,
      },
      query: request.query || `Please perform task: ${request.task}`,
      response_mode: "streaming", // ストリーミングモードに変更
      user: API_CONFIG.DEFAULT_USER_ID,
      conversation_id: "",
    };

    // 🔍 デバッグ: リクエストボディの詳細をログ出力
    console.log("🚀 [DEBUG] Dify Streaming API Request Details:");
    console.log("📍 Endpoint:", apiEndpoint);
    console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("🔑 API Key Present:", !!this.config.apiKey);
    console.log(
      "🔑 API Key Preview:",
      this.config.apiKey ? `${this.config.apiKey.substring(0, 10)}...` : "None"
    );

    this.logger.info(`Making streaming API request to ${apiEndpoint}`, {
      task: request.task,
      inputKeys: Object.keys(request.inputs),
      hasApiKey: !!this.config.apiKey,
      requestBody: requestBody,
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(ENV_CONFIG.API_TIMEOUT),
      });

      // 🔍 デバッグ: レスポンスヘッダーの詳細をログ出力
      console.log("📥 [DEBUG] Dify API Response Details:");
      console.log("📊 Status:", response.status, response.statusText);
      console.log("📋 Headers:");
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
      console.log("🌊 Response Body Type:", response.body?.constructor.name);
      console.log(
        "🔄 Is Streaming:",
        response.headers.get("content-type")?.includes("text/event-stream")
      );

      if (!response.ok) {
        const responseText = await response.text();

        // 🔍 デバッグ: エラーレスポンスの詳細をログ出力
        console.error("❌ [DEBUG] Dify API Error Response:");
        console.error("📊 Status:", response.status, response.statusText);
        console.error("📝 Response Text:", responseText);

        const errorId = this.logger.error(
          new Error(`Streaming API request failed: ${response.status}`),
          {
            status: response.status,
            statusText: response.statusText,
            endpoint: apiEndpoint,
            task: request.task,
            responseLength: responseText.length,
            responseBody: responseText,
          }
        );
        throw new Error(
          `Dify streaming API error: ${response.status}. Error ID: ${errorId}`
        );
      }

      // 🔍 デバッグ: 成功レスポンスの詳細をログ出力
      console.log("✅ [DEBUG] Dify API Success Response:");
      console.log("📊 Status:", response.status);
      console.log("📋 Content-Type:", response.headers.get("content-type"));
      console.log("🌊 Stream Available:", !!response.body);
      console.log(
        "🔄 Response Mode Detected:",
        response.headers.get("content-type")?.includes("text/event-stream")
          ? "STREAMING"
          : "BLOCKING"
      );

      this.logger.info("Streaming API request initiated successfully", {
        task: request.task,
        hasBody: !!response.body,
        contentType: response.headers.get("content-type"),
        isStreaming: response.headers
          .get("content-type")
          ?.includes("text/event-stream"),
      });

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorId = this.logger.error(error, {
          task: request.task,
          timeout: ENV_CONFIG.API_TIMEOUT,
        });
        throw new Error(
          `Dify streaming API request timed out. Error ID: ${errorId}`
        );
      }

      if (error instanceof Error && error.message.includes("Error ID:")) {
        throw error;
      }

      const errorId = this.logger.error(error, { task: request.task });
      throw new Error(
        `Unexpected streaming error occurred. Error ID: ${errorId}`
      );
    }
  }
}
