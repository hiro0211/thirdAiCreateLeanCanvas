// Dify API エラーハンドリング専用モジュール

import { ERROR_MESSAGES } from "../constants/messages";
import { API_CONFIG } from "../constants/app-constants";

// エラータイプ定義
export type DifyErrorType =
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "RESOURCE_NOT_FOUND"
  | "TIMEOUT_ERROR"
  | "VALIDATION_ERROR"
  | "WORKFLOW_CONFIG_ERROR"
  | "NETWORK_ERROR"
  | "PARSE_ERROR"
  | "UNKNOWN_ERROR";

export interface DifyError {
  type: DifyErrorType;
  message: string;
  statusCode?: number;
  originalError?: Error;
  details?: Record<string, any>;
}

// HTTPステータスコードとエラータイプのマッピング
const STATUS_CODE_ERROR_MAP: Record<number, DifyErrorType> = {
  [API_CONFIG.STATUS_CODES.UNAUTHORIZED]: "AUTHENTICATION_ERROR",
  [API_CONFIG.STATUS_CODES.NOT_FOUND]: "RESOURCE_NOT_FOUND",
  [API_CONFIG.STATUS_CODES.TIMEOUT]: "TIMEOUT_ERROR",
  [API_CONFIG.STATUS_CODES.BAD_REQUEST]: "VALIDATION_ERROR",
  [API_CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR]: "UNKNOWN_ERROR",
};

// エラータイプとメッセージのマッピング
const ERROR_TYPE_MESSAGE_MAP: Record<DifyErrorType, string> = {
  AUTHENTICATION_ERROR: ERROR_MESSAGES.API_AUTH_FAILED,
  AUTHORIZATION_ERROR: ERROR_MESSAGES.API_AUTH_FAILED,
  RESOURCE_NOT_FOUND: ERROR_MESSAGES.API_WORKFLOW_NOT_FOUND,
  TIMEOUT_ERROR: ERROR_MESSAGES.API_TIMEOUT,
  VALIDATION_ERROR: ERROR_MESSAGES.REQUIRED_INFO_MISSING,
  WORKFLOW_CONFIG_ERROR: ERROR_MESSAGES.API_WORKFLOW_CONFIG_ERROR,
  NETWORK_ERROR: ERROR_MESSAGES.SERVER_ERROR,
  PARSE_ERROR: ERROR_MESSAGES.SERVER_ERROR,
  UNKNOWN_ERROR: ERROR_MESSAGES.SERVER_ERROR,
};

// タスク固有のエラーメッセージマッピング
const TASK_ERROR_MESSAGE_MAP: Record<string, string> = {
  persona: ERROR_MESSAGES.PERSONA_GENERATION_FAILED,
  businessidea: ERROR_MESSAGES.BUSINESS_IDEA_GENERATION_FAILED,
  productname: ERROR_MESSAGES.PRODUCT_NAME_GENERATION_FAILED,
  canvas: ERROR_MESSAGES.LEAN_CANVAS_GENERATION_FAILED,
};

/**
 * HTTP レスポンスからDifyエラーを解析
 */
export function parseHttpError(
  response: Response,
  responseText?: string
): DifyError {
  const statusCode = response.status;
  const errorType = STATUS_CODE_ERROR_MAP[statusCode] || "UNKNOWN_ERROR";

  return {
    type: errorType,
    message: ERROR_TYPE_MESSAGE_MAP[errorType],
    statusCode,
    details: {
      statusText: response.statusText,
      url: response.url,
      responseText: responseText?.substring(0, 200), // 最初の200文字のみ
    },
  };
}

/**
 * ネットワークエラーからDifyエラーを解析
 */
export function parseNetworkError(error: Error): DifyError {
  if (error.name === "AbortError") {
    return {
      type: "TIMEOUT_ERROR",
      message: ERROR_TYPE_MESSAGE_MAP.TIMEOUT_ERROR,
      originalError: error,
    };
  }

  if (error.message.includes("fetch")) {
    return {
      type: "NETWORK_ERROR",
      message: ERROR_TYPE_MESSAGE_MAP.NETWORK_ERROR,
      originalError: error,
    };
  }

  return {
    type: "UNKNOWN_ERROR",
    message: ERROR_TYPE_MESSAGE_MAP.UNKNOWN_ERROR,
    originalError: error,
  };
}

/**
 * JSON パースエラーからDifyエラーを解析
 */
export function parseJsonError(error: Error, responseText?: string): DifyError {
  return {
    type: "PARSE_ERROR",
    message: ERROR_TYPE_MESSAGE_MAP.PARSE_ERROR,
    originalError: error,
    details: {
      responsePreview: responseText?.substring(0, 100),
    },
  };
}

/**
 * APIレスポンスのエラーメッセージからDifyエラーを解析
 */
export function parseApiResponseError(
  errorMessage: string,
  task?: string,
  statusCode?: number
): DifyError {
  // Dify API特有のエラーパターンを解析
  let errorType: DifyErrorType = "UNKNOWN_ERROR";

  if (errorMessage.includes("認証") || errorMessage.includes("API key")) {
    errorType = "AUTHENTICATION_ERROR";
  } else if (
    errorMessage.includes("ワークフロー") &&
    errorMessage.includes("見つからない")
  ) {
    errorType = "RESOURCE_NOT_FOUND";
  } else if (errorMessage.includes("タイムアウト")) {
    errorType = "TIMEOUT_ERROR";
  } else if (errorMessage.includes("設定") && errorMessage.includes("問題")) {
    errorType = "WORKFLOW_CONFIG_ERROR";
  } else if (statusCode && STATUS_CODE_ERROR_MAP[statusCode]) {
    errorType = STATUS_CODE_ERROR_MAP[statusCode];
  }

  // タスク固有のメッセージまたは汎用メッセージを使用
  const fallbackMessage =
    task && TASK_ERROR_MESSAGE_MAP[task]
      ? TASK_ERROR_MESSAGE_MAP[task]
      : ERROR_TYPE_MESSAGE_MAP[errorType];

  return {
    type: errorType,
    message: errorMessage || fallbackMessage,
    statusCode,
    details: {
      task,
      originalMessage: errorMessage,
    },
  };
}

/**
 * Difyエラーからユーザーフレンドリーなメッセージを取得
 */
export function getUserFriendlyMessage(
  error: DifyError,
  task?: string
): string {
  // タスク固有のメッセージがある場合は優先
  if (task && TASK_ERROR_MESSAGE_MAP[task]) {
    return TASK_ERROR_MESSAGE_MAP[task];
  }

  return error.message;
}

/**
 * エラーが再試行可能かどうかを判定
 */
export function isRetryableError(error: DifyError): boolean {
  const retryableTypes: DifyErrorType[] = [
    "TIMEOUT_ERROR",
    "NETWORK_ERROR",
    "UNKNOWN_ERROR",
  ];

  return retryableTypes.includes(error.type);
}

/**
 * エラーログ用の詳細情報を取得
 */
export function getErrorDetails(error: DifyError): Record<string, any> {
  return {
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    retryable: isRetryableError(error),
    originalError: error.originalError?.message,
    details: error.details,
  };
}
