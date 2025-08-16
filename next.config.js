/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ビルド時のファイルアクセス権限問題を回避
    forceSwcTransforms: true,
  },
  // ビルド最適化設定
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 出力設定
  output: 'standalone',
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
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.dify.ai;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
