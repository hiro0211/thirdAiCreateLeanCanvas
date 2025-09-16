/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ビルド時のファイルアクセス権限問題を回避
    forceSwcTransforms: true,
  },
  // ビルド最適化設定
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 出力設定
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Stripe.js を許可
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
              // Stripe API / Stripe.js との通信を許可
              "connect-src 'self' https://api.dify.ai https://api.stripe.com https://js.stripe.com",
              // Checkout 画面遷移や Webhooks/3DS 用のフレームを許可
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
              // 既存の許可
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
