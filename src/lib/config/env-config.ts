// 環境変数とアプリケーション設定の管理

// 環境変数のデフォルト値
const ENV_DEFAULTS = {
  API_TIMEOUT: "60000",
  DEMO_MODE_MIN_DELAY: "1000",
  DEMO_MODE_MAX_DELAY: "2000",
  NODE_ENV: "development",
  DIFY_API_URL: "https://api.dify.ai/v1",
  LOG_LEVEL: "info",
} as const;

// 環境変数を安全に取得するヘルパー関数
const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue || "";
  }
  return defaultValue || "";
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === "true";
};

// 環境設定オブジェクト
export const ENV_CONFIG = {
  // 基本設定
  NODE_ENV: getEnvVar("NODE_ENV", ENV_DEFAULTS.NODE_ENV),
  IS_DEVELOPMENT:
    getEnvVar("NODE_ENV", ENV_DEFAULTS.NODE_ENV) === "development",
  IS_PRODUCTION: getEnvVar("NODE_ENV", ENV_DEFAULTS.NODE_ENV) === "production",

  // API設定
  DIFY_API_KEY: getEnvVar("DIFY_API_KEY"),
  DIFY_API_URL: getEnvVar(
    "NEXT_PUBLIC_DIFY_API_URL",
    ENV_DEFAULTS.DIFY_API_URL
  ),
  API_TIMEOUT: getEnvNumber("API_TIMEOUT", parseInt(ENV_DEFAULTS.API_TIMEOUT)),

  // デモモード設定
  IS_DEMO_MODE:
    !getEnvVar("DIFY_API_KEY") ||
    getEnvVar("DIFY_API_KEY") === "" ||
    getEnvVar("DIFY_API_KEY") === "demo",
  DEMO_MODE_MIN_DELAY: getEnvNumber(
    "DEMO_MODE_MIN_DELAY",
    parseInt(ENV_DEFAULTS.DEMO_MODE_MIN_DELAY)
  ),
  DEMO_MODE_MAX_DELAY: getEnvNumber(
    "DEMO_MODE_MAX_DELAY",
    parseInt(ENV_DEFAULTS.DEMO_MODE_MAX_DELAY)
  ),

  // ロギング設定
  LOG_LEVEL: getEnvVar("LOG_LEVEL", ENV_DEFAULTS.LOG_LEVEL),
  ENABLE_CONSOLE_LOGS: getEnvBoolean("ENABLE_CONSOLE_LOGS", true),

  // フィーチャーフラグ
  ENABLE_TUTORIAL: getEnvBoolean("ENABLE_TUTORIAL", true),
  ENABLE_ANALYTICS: getEnvBoolean("ENABLE_ANALYTICS", false),
  ENABLE_ERROR_REPORTING: getEnvBoolean("ENABLE_ERROR_REPORTING", false),
  ENABLE_EVENTSOURCE: getEnvBoolean("ENABLE_EVENTSOURCE", true),

  // UI設定
  DEFAULT_THEME: getEnvVar("DEFAULT_THEME", "light"),
  ENABLE_DARK_MODE: getEnvBoolean("ENABLE_DARK_MODE", true),

  // キャッシュ設定
  CACHE_TTL_MINUTES: getEnvNumber("CACHE_TTL_MINUTES", 60),
  ENABLE_OFFLINE_MODE: getEnvBoolean("ENABLE_OFFLINE_MODE", false),
} as const;

// 設定検証関数
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 必須設定のチェック
  if (!ENV_CONFIG.IS_DEMO_MODE && !ENV_CONFIG.DIFY_API_KEY) {
    errors.push("DIFY_API_KEY is required when not in demo mode");
  }

  if (!ENV_CONFIG.DIFY_API_URL) {
    errors.push("NEXT_PUBLIC_DIFY_API_URL is required");
  }

  // URL形式の検証
  try {
    if (ENV_CONFIG.DIFY_API_URL) {
      new URL(ENV_CONFIG.DIFY_API_URL);
    }
  } catch {
    errors.push("NEXT_PUBLIC_DIFY_API_URL must be a valid URL");
  }

  // 数値範囲の検証
  if (ENV_CONFIG.API_TIMEOUT < 1000 || ENV_CONFIG.API_TIMEOUT > 300000) {
    errors.push("API_TIMEOUT must be between 1000 and 300000 milliseconds");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 設定情報のログ出力（デバッグ用）
export const logConfig = (): void => {
  if (ENV_CONFIG.IS_DEVELOPMENT && ENV_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.group("🔧 Application Configuration");
    console.log("Environment:", ENV_CONFIG.NODE_ENV);
    console.log("Demo Mode:", ENV_CONFIG.IS_DEMO_MODE);
    console.log("API URL:", ENV_CONFIG.DIFY_API_URL);
    console.log("API Timeout:", `${ENV_CONFIG.API_TIMEOUT}ms`);
    console.log("Tutorial Enabled:", ENV_CONFIG.ENABLE_TUTORIAL);
    console.log("Dark Mode Enabled:", ENV_CONFIG.ENABLE_DARK_MODE);

    const validation = validateConfig();
    if (!validation.isValid) {
      console.warn("⚠️ Configuration Issues:");
      validation.errors.forEach((error) => console.warn("-", error));
    } else {
      console.log("✅ Configuration is valid");
    }
    console.groupEnd();
  }
};

// DifyConfig用のインターフェース
export interface DifyConfig {
  apiKey: string;
  apiUrl: string;
  isDemoMode: boolean;
}

// Dify設定を作成する関数
export const createDifyConfig = (): DifyConfig => {
  return {
    apiKey: ENV_CONFIG.DIFY_API_KEY,
    apiUrl: ENV_CONFIG.DIFY_API_URL,
    isDemoMode: ENV_CONFIG.IS_DEMO_MODE,
  };
};

// 設定のタイプエクスポート
export type EnvConfig = typeof ENV_CONFIG;
