import { Logger } from '../utils/logger';
import { ENV_CONFIG } from '../config/env-config';
import { API_CONFIG } from '../constants/app-constants';

export interface DifyConfig {
  apiKey: string;
  apiUrl: string;
  isDemoMode: boolean;
}

export interface DifyRequest {
  inputs: Record<string, any>;
  query?: string;
  task?: string;
}

export class DifyApiClient {
  private logger = new Logger('DifyApiClient');

  constructor(private config: DifyConfig) {}

  async callApi(request: DifyRequest): Promise<any> {
    if (this.config.isDemoMode) {
      return this.handleDemoMode(request);
    }
    return this.callRealApi(request);
  }

  async callApiStream(request: DifyRequest): Promise<ReadableStream<Uint8Array>> {
    if (this.config.isDemoMode) {
      return this.handleDemoModeStream(request);
    }
    return this.callRealApiStream(request);
  }

  private async handleDemoMode(request: DifyRequest): Promise<any> {
    this.logger.info('Using demo mode - mock data will be returned', {
      task: request.task,
      inputKeys: Object.keys(request.inputs),
    });

    // Real API call simulation with delay
    await new Promise((resolve) =>
      setTimeout(resolve, ENV_CONFIG.DEMO_MODE_MIN_DELAY + Math.random() * (ENV_CONFIG.DEMO_MODE_MAX_DELAY - ENV_CONFIG.DEMO_MODE_MIN_DELAY))
    );

    const { MockDataGenerator } = await import('./mock-generator');
    return MockDataGenerator.generate(request.task || 'unknown', request.inputs);
  }

  private async handleDemoModeStream(request: DifyRequest): Promise<ReadableStream<Uint8Array>> {
    this.logger.info('Using demo mode stream - mock data will be streamed', {
      task: request.task,
      inputKeys: Object.keys(request.inputs),
    });

    const { MockDataGenerator } = await import('./mock-generator');
    const mockData = MockDataGenerator.generate(request.task || 'unknown', request.inputs);

    return new ReadableStream({
      start(controller) {
        // ペルソナデータを1つずつストリーミング（Server-Sent Events形式でモック）
        if (request.task === 'persona' && mockData.personas) {
          mockData.personas.forEach((persona: any, index: number) => {
            setTimeout(() => {
              // Dify APIのSSE形式をモック
              const sseData = `data: ${JSON.stringify({
                event: 'message',
                answer: JSON.stringify(persona)
              })}\n\n`;
              controller.enqueue(new TextEncoder().encode(sseData));

              // 最後のペルソナの場合はストリームを終了
              if (index === mockData.personas.length - 1) {
                const endData = `data: ${JSON.stringify({
                  event: 'message_end'
                })}\n\n`;
                controller.enqueue(new TextEncoder().encode(endData));
                controller.close();
              }
            }, (index + 1) * 1000); // 1秒間隔でストリーミング
          });
        } else {
          // その他のタスクは従来通り
          const sseData = `data: ${JSON.stringify({
            event: 'message',
            answer: JSON.stringify(mockData)
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(sseData));
          const endData = `data: ${JSON.stringify({ event: 'message_end' })}\n\n`;
          controller.enqueue(new TextEncoder().encode(endData));
          controller.close();
        }
      }
    });
  }

  private async callRealApi(request: DifyRequest): Promise<any> {
    if (!this.config.apiKey || !this.config.apiUrl) {
      throw new Error('Dify API configuration is missing');
    }

    // Dify chat application API endpoint
    const apiEndpoint = `${this.config.apiUrl}${API_CONFIG.DIFY_ENDPOINT}`;

    const requestBody = {
      inputs: {
        task: request.task,
        ...request.inputs,
      },
      query: request.query || `Please perform task: ${request.task}`,
      response_mode: 'blocking',
      user: API_CONFIG.DEFAULT_USER_ID,
      conversation_id: '',
    };

    // Development environment logging
    if (process.env.NODE_ENV === 'development') {
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            ...(process.env.NODE_ENV === 'development' && {
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
        this.logger.info('API request successful', {
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

      if (result.status === 'failed') {
        const errorId = this.logger.error(
          new Error('Dify workflow execution failed'),
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
      if (error instanceof Error && error.name === 'AbortError') {
        const errorId = this.logger.error(error, {
          task: request.task,
          timeout: 60000
        });
        throw new Error(`Dify API request timed out. Error ID: ${errorId}`);
      }

      // Check if error is already logged
      if (error instanceof Error && error.message.includes('Error ID:')) {
        throw error;
      }

      // Log unexpected errors
      const errorId = this.logger.error(error, { task: request.task });
      throw new Error(`Unexpected error occurred. Error ID: ${errorId}`);
    }
  }

  private async callRealApiStream(request: DifyRequest): Promise<ReadableStream<Uint8Array>> {
    if (!this.config.apiKey || !this.config.apiUrl) {
      throw new Error('Dify API configuration is missing');
    }

    // Dify chat application API endpoint
    const apiEndpoint = `${this.config.apiUrl}${API_CONFIG.DIFY_ENDPOINT}`;

    const requestBody = {
      inputs: {
        task: request.task,
        ...request.inputs,
      },
      query: request.query || `Please perform task: ${request.task}`,
      response_mode: 'streaming', // ストリーミングモードに変更
      user: API_CONFIG.DEFAULT_USER_ID,
      conversation_id: '',
    };

    this.logger.info(`Making streaming API request to ${apiEndpoint}`, {
      task: request.task,
      inputKeys: Object.keys(request.inputs),
      hasApiKey: !!this.config.apiKey,
    });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(ENV_CONFIG.API_TIMEOUT),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorId = this.logger.error(
          new Error(`Streaming API request failed: ${response.status}`),
          {
            status: response.status,
            statusText: response.statusText,
            endpoint: apiEndpoint,
            task: request.task,
            responseBody: errorText,
          }
        );
        throw new Error(
          `Dify streaming API error: ${response.status}. Error ID: ${errorId}`
        );
      }

      if (!response.body) {
        throw new Error('No response body received from streaming API');
      }

      // Difyのレスポンスをそのまま返す（パース処理は上位層で実行）
      return response.body;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const errorId = this.logger.error(error, {
          task: request.task,
          timeout: ENV_CONFIG.API_TIMEOUT
        });
        throw new Error(`Dify streaming API request timed out. Error ID: ${errorId}`);
      }

      // Check if error is already logged
      if (error instanceof Error && error.message.includes('Error ID:')) {
        throw error;
      }

      // Log unexpected errors
      const errorId = this.logger.error(error, { task: request.task });
      throw new Error(`Unexpected streaming error occurred. Error ID: ${errorId}`);
    }
  }
}
