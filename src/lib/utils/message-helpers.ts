// メッセージ取得用ヘルパー関数

import { LEAN_CANVAS } from "../constants/messages";

// ネストされたオブジェクトから値を取得するヘルパー
const getNestedValue = (obj: any, path: string): string => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj);
};

// ブロックタイトルを取得
export const getBlockTitle = (titleKey: string): string => {
  if (titleKey.startsWith("BLOCK_TITLES.")) {
    return getNestedValue(LEAN_CANVAS, titleKey);
  }
  return titleKey;
};

// メッセージを安全に取得（フォールバック付き）
export const getMessage = (messageKey: string, fallback?: string): string => {
  try {
    const value = getNestedValue(LEAN_CANVAS, messageKey);
    return value !== messageKey ? value : fallback || messageKey;
  } catch (error) {
    console.warn(`Message key not found: ${messageKey}`);
    return fallback || messageKey;
  }
};

// 将来の国際化対応用（現在は日本語のみ）
export const getLocalizedMessage = (
  messageKey: string,
  locale: string = "ja",
  fallback?: string
): string => {
  // 現在は日本語のみサポート
  if (locale === "ja") {
    return getMessage(messageKey, fallback);
  }

  // 他の言語は将来実装
  console.warn(
    `Locale '${locale}' is not supported yet. Falling back to Japanese.`
  );
  return getMessage(messageKey, fallback);
};
