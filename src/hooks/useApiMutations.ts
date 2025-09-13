"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  DifyPersonaResponse,
  DifyBusinessIdeaResponse,
  DifyProductNameResponse,
  DifyProductDetailsResponse,
  LeanCanvasData,
  ApiResponse,
  CreativityLevel,
  Persona,
  BusinessIdea,
  ProductDetails,
  ProductName,
} from "@/lib/types";
import { ENV_CONFIG } from "@/lib/config/env-config";

// API呼び出し関数
async function callDifyApi<T>(request: any): Promise<ApiResponse<T>> {
  const response = await fetch("/api/dify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "API call failed");
  }

  return result;
}

// ペルソナ生成のミューテーション
export function useGeneratePersonas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyword: string) => {
      const result = await callDifyApi<DifyPersonaResponse>({
        task: "persona",
        keyword: keyword.trim(),
      });
      return result.data?.personas || [];
    },
    onSuccess: (data, keyword) => {
      // 成功時にキャッシュに保存
      queryClient.setQueryData(["personas", keyword], data);
    },
  });
}

// ビジネスアイデア生成のミューテーション
export function useGenerateBusinessIdeas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      persona,
      creativityLevel,
    }: {
      persona: Persona;
      creativityLevel: CreativityLevel;
    }) => {
      const result = await callDifyApi<DifyBusinessIdeaResponse>({
        task: "businessidea",
        persona,
        creativity_level: creativityLevel,
      });
      return result.data?.business_ideas || [];
    },
    onSuccess: (data, variables) => {
      // 成功時にキャッシュに保存
      queryClient.setQueryData(
        ["businessIdeas", variables.persona.id, variables.creativityLevel],
        data
      );
    },
  });
}

// 商品詳細生成のミューテーション
export function useGenerateProductDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      persona,
      businessIdea,
    }: {
      persona: Persona;
      businessIdea: BusinessIdea;
    }) => {
      const result = await callDifyApi<DifyProductDetailsResponse>({
        task: "generate_product_details",
        persona,
        business_idea: businessIdea,
      });
      return result.data || null;
    },
    onSuccess: (data, variables) => {
      // 成功時にキャッシュに保存
      const cacheKey = [
        "productDetails",
        variables.persona.id,
        variables.businessIdea.id,
      ];
      queryClient.setQueryData(cacheKey, data);
    },
  });
}

// プロダクト名生成のミューテーション
export function useGenerateProductNames() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      persona,
      businessIdea,
      productDetails,
    }: {
      persona: Persona;
      businessIdea: BusinessIdea;
      productDetails: ProductDetails;
    }) => {
      const result = await callDifyApi<DifyProductNameResponse>({
        task: "productname",
        persona,
        business_idea: businessIdea,
        product_details: productDetails,
      });
      return result.data?.product_names || [];
    },
    onSuccess: (data, variables) => {
      // 成功時にキャッシュに保存
      const cacheKey = [
        "productNames",
        variables.persona.id,
        variables.businessIdea.id,
        JSON.stringify(variables.productDetails),
      ];
      queryClient.setQueryData(cacheKey, data);
    },
  });
}

// リーンキャンバス生成のミューテーション
export function useGenerateLeanCanvas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      persona,
      businessIdea,
      productName,
    }: {
      persona: Persona;
      businessIdea: BusinessIdea;
      productName: ProductName;
    }) => {
      const result = await callDifyApi<LeanCanvasData>({
        task: "canvas",
        persona,
        business_idea: businessIdea,
        product_name: productName,
      });
      return result.data || null;
    },
    onSuccess: (data, variables) => {
      // 成功時にキャッシュに保存
      const cacheKey = [
        "leanCanvas",
        variables.persona.id,
        variables.businessIdea.id,
        variables.productName.id,
      ];
      queryClient.setQueryData(cacheKey, data);
    },
  });
}

// Server-Sent Eventsのパース関数
function parseSSEEvent(
  line: string
): { event: string; data?: any; answer?: any; error?: string } | null {
  if (line.startsWith("data: ")) {
    try {
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) return null;
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error) {
      // JSONパースに失敗した場合は、生データを返す
      return {
        event: "message",
        answer: line.slice(6),
      };
    }
  }
  return null;
}

// EventSourceを使用したストリーミングフック（推奨）
export function useDifyStream<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const executeStream = useCallback(async (request: any) => {
    // 前回のEventSourceを閉じる
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // リクエストパラメータをクエリストリングに変換
      const params = new URLSearchParams({
        request: JSON.stringify({
          ...request,
          streaming: true,
        }),
      });

      // EventSourceでSSE接続を開始
      const eventSource = new EventSource(`/api/dify/stream?${params}`);
      eventSourceRef.current = eventSource;

      let accumulatedText = "";

      // メッセージイベントのハンドラ
      eventSource.onmessage = (event) => {
        try {
          const parsedEvent = JSON.parse(event.data);

          if (parsedEvent.event === "error") {
            throw new Error(
              parsedEvent.error || "ストリーミング中にエラーが発生しました"
            );
          }

          if (parsedEvent.event === "message" && parsedEvent.answer) {
            accumulatedText += parsedEvent.answer;

            // JSON パースを試行
            try {
              const parsedData = JSON.parse(accumulatedText);
              setData(parsedData);
            } catch (e) {
              // まだ完全なJSONではない場合は続行
            }
          }

          if (parsedEvent.event === "message_end") {
            // 最終的なデータ処理
            if (accumulatedText.trim()) {
              try {
                const finalData = JSON.parse(accumulatedText);
                setData(finalData);
              } catch (e) {
                console.warn("最終JSONパースに失敗:", accumulatedText);
              }
            }

            setIsLoading(false);
            eventSource.close();
            eventSourceRef.current = null;
          }
        } catch (parseError) {
          console.error("SSEイベントのパースに失敗:", parseError);
        }
      };

      // エラーハンドラ
      eventSource.onerror = (event) => {
        const errorMessage = "ストリーミング接続でエラーが発生しました";
        setError(errorMessage);
        setIsLoading(false);
        eventSource.close();
        eventSourceRef.current = null;
      };

      // 接続が開かれた時のハンドラ
      eventSource.onopen = () => {
        console.log("SSE接続が開始されました");
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "ストリーミング接続の初期化に失敗しました";

      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // コンポーネントのアンマウント時にEventSourceを閉じる
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    executeStream,
    cancel,
    reset,
  };
}

// Fetch APIベースのストリーミングフック（後方互換性用）
export function useDifyStreamLegacy<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeStream = useCallback(async (request: any) => {
    // 前回のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          streaming: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error("レスポンスボディが存在しません");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          const event = parseSSEEvent(line);
          if (!event) continue;

          if (event.event === "error") {
            throw new Error(
              event.error || "ストリーミング中にエラーが発生しました"
            );
          }

          if (event.event === "message" && event.answer) {
            accumulatedText += event.answer;

            // JSON パースを試行
            try {
              const parsedData = JSON.parse(accumulatedText);
              setData(parsedData);
            } catch (e) {
              // まだ完全なJSONではない場合は続行
            }
          }

          if (event.event === "message_end") {
            // 最終的なデータ処理
            if (accumulatedText.trim()) {
              try {
                const finalData = JSON.parse(accumulatedText);
                setData(finalData);
              } catch (e) {
                console.warn("最終JSONパースに失敗:", accumulatedText);
              }
            }

            setIsLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "ストリーミング中に予期しないエラーが発生しました";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    executeStream,
    cancel,
    reset,
  };
}

// 環境設定に基づいてEventSourceまたはFetch APIを自動選択するフック
export function useDifyStreamAuto<T = any>() {
  if (ENV_CONFIG.ENABLE_EVENTSOURCE) {
    return useDifyStream<T>();
  } else {
    return useDifyStreamLegacy<T>();
  }
}

// ビジネスアイデア用ストリーミングフック
export function useBusinessIdeaStream() {
  return useDifyStreamAuto<BusinessIdea[]>();
}

// プロダクト名用ストリーミングフック
export function useProductNameStream() {
  return useDifyStreamAuto<ProductName[]>();
}

// リーンキャンバス用ストリーミングフック
export function useLeanCanvasStream() {
  return useDifyStreamAuto<LeanCanvasData>();
}
