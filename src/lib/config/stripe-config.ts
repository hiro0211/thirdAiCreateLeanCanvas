// Stripe 関連の定数と設定。頻繁に変わる値は全てここに集約する。
// Why: 設定の外部化により、文言・金額・URL をロジックに触れずに変更可能にするため。

export const STRIPE_CURRENCY = "jpy" as const; // 日本円（ゼロ小数通貨）

// 寄付プロダクトの表示情報（Stripe Checkout の price_data.product_data に渡す）
export const DONATION_PRODUCT = {
  name: "AI Lean Canvas - Donation",
  description:
    "開発を応援いただきありがとうございます。寄付はアプリの改善と継続運用に活用します。",
} as const;

// 金額設定（UI やバリデーションの基準）
export const DONATION_AMOUNT = {
  default: 1000,
  min: 100,
  max: 100000,
  presets: [500, 1000, 3000, 5000, 10000],
} as const;

// アプリのベース URL。未設定の場合は実行時にリクエスト Origin を使用する。
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || "";

// リダイレクト URL を生成（App Router の Route Handler から使用）
export const buildRedirectUrls = (origin: string) => {
  const base = (APP_BASE_URL || origin).replace(/\/$/, "");
  return {
    success: `${base}/?payment_success=true`,
    cancel: `${base}/`,
  } as const;
};

// API のパス（フロントエンドから呼び出す抽象化）
export const STRIPE_API_ENDPOINT = "/api/stripe";

