import type { Viewport } from "next";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  };
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* 404 アイコン */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
          </div>

          {/* エラーメッセージ */}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            ページが見つかりません
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            お探しのページは存在しないか、移動された可能性があります。
          </p>

          {/* ナビゲーションボタン */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>ホームに戻る</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link
                href="javascript:history.back()"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>前のページに戻る</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
