// 改良されたDify API クライアント（エラーハンドリング強化版）

import { Logger } from "./logger";
import {
  parseHttpError,
  parseNetworkError,
  parseJsonError,
  parseApiResponseError,
  getUserFriendlyMessage,
  getErrorDetails,
  type DifyError,
} from "./api-error-handler";
import { API_CONFIG } from "../constants/app-constants";

export interface DifyApiRequest {
  task: string;
  [key: string]: any;
}

export interface DifyApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type?: string;
    details?: Record<string, any>;
  };
}

export class DifyApiError extends Error {
  public readonly difyError: DifyError;

  constructor(difyError: DifyError) {
    super(getUserFriendlyMessage(difyError));
    this.name = "DifyApiError";
    this.difyError = difyError;
  }
}

export class DifyApiClient {
  private logger = new Logger("DifyApiClient");
  private readonly apiEndpoint: string;

  constructor(apiEndpoint = "/api/dify") {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Dify API を呼び出し、適切なエラーハンドリングを行う
   */
  async callApi<T = any>(request: DifyApiRequest): Promise<DifyApiResponse<T>> {
    const requestId = this.generateRequestId();

    this.logger.info("Starting Dify API request", {
      requestId,
      task: request.task,
      endpoint: this.apiEndpoint,
    });

    try {
      // HTTP リクエスト実行
      const response = await this.executeHttpRequest(request, requestId);

      // レスポンス解析
      const result = await this.parseResponse<T>(
        response,
        request.task,
        requestId
      );

      this.logger.info("Dify API request completed successfully", {
        requestId,
        task: request.task,
        hasData: !!result.data,
      });

      return result;
    } catch (error) {
      return this.handleError(error, request.task, requestId);
    }
  }

  /**
   * HTTP リクエストを実行
   */
  private async executeHttpRequest(
    request: DifyApiRequest,
    requestId: string
  ): Promise<Response> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(API_CONFIG.DEFAULT_TIMEOUT),
      });

      this.logger.info("HTTP request completed", {
        requestId,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      return response;
    } catch (error) {
      this.logger.error("HTTP request failed", {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof Error) {
        throw new DifyApiError(parseNetworkError(error));
      }

      throw error;
    }
  }

  /**
   * レスポンスを解析してDifyApiResponseに変換
   */
  private async parseResponse<T>(
    response: Response,
    task: string,
    requestId: string
  ): Promise<DifyApiResponse<T>> {
    let responseText: string;

    try {
      responseText = await response.text();
    } catch (error) {
      this.logger.error("Failed to read response text", {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new DifyApiError(
        parseNetworkError(
          error instanceof Error ? error : new Error("Response read failed")
        )
      );
    }

    // HTTPエラーステータスのチェック
    if (!response.ok) {
      this.logger.error("HTTP error response", {
        requestId,
        status: response.status,
        statusText: response.statusText,
        responseLength: responseText.length,
      });

      throw new DifyApiError(parseHttpError(response, responseText));
    }

    // JSON パース
    let result: DifyApiResponse<T>;
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      this.logger.error("JSON parse failed", {
        requestId,
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200),
      });

      throw new DifyApiError(
        parseJsonError(
          error instanceof Error ? error : new Error("JSON parse failed"),
          responseText
        )
      );
    }

    // APIレスポンスの成功/失敗チェック
    if (!result.success && result.error) {
      this.logger.error("API response indicates failure", {
        requestId,
        task,
        errorMessage: result.error.message,
        errorType: result.error.type,
      });

      throw new DifyApiError(
        parseApiResponseError(result.error.message, task, response.status)
      );
    }

    return result;
  }

  /**
   * エラーハンドリング
   */
  private handleError(
    error: unknown,
    task: string,
    requestId: string
  ): Promise<DifyApiResponse> {
    if (error instanceof DifyApiError) {
      // 既にDifyApiErrorの場合はそのまま再スロー
      const errorDetails = getErrorDetails(error.difyError);

      this.logger.error("Dify API error", {
        requestId,
        task,
        ...errorDetails,
      });

      throw error;
    }

    // 予期しないエラー
    const unexpectedError =
      error instanceof Error
        ? error
        : new Error(`Unexpected error: ${String(error)}`);

    this.logger.error("Unexpected error in Dify API client", {
      requestId,
      task,
      error: unexpectedError.message,
      stack: unexpectedError.stack,
    });

    throw new DifyApiError(parseNetworkError(unexpectedError));
  }

  /**
   * リクエストIDを生成
   */
  private generateRequestId(): string {
    return `dify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// シングルトンインスタンス
export const difyApiClient = new DifyApiClient();
