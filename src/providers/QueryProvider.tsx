"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5分間キャッシュを保持
            staleTime: 5 * 60 * 1000,
            // 10分間データを保持
            cacheTime: 10 * 60 * 1000,
            // エラー時の再試行
            retry: (failureCount, error) => {
              // 3回まで再試行
              if (failureCount < 3) {
                return true;
              }
              return false;
            },
            // 指数バックオフで再試行間隔を調整
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // ミューテーション時も再試行
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
