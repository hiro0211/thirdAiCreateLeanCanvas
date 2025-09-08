"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
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
): { event: string; data?: any; answer?: any } | null {
  if (line.startsWith("data: ")) {
    try {
      const jsonStr = line.slice(6); // "data: " を削除
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error) {
      // JSONパースに失敗した場合は、イベントと生データを返す
      return {
        event: "message",
        answer: line.slice(6),
      };
    }
  }
  return null;
}

// ストリーミング用カスタムフック
export function useDifyStream() {
  const [data, setData] = useState<any>(null);
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
          streaming: true, // ストリーミングフラグを追加
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let jsonStringAccumulator = ""; // JSON文字列を蓄積

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
              event.data?.error || "ストリーミング中にエラーが発生しました"
            );
          }

          if (event.event === "message" && typeof event.answer === "string") {
            jsonStringAccumulator += event.answer;
            try {
              const parsedData = JSON.parse(jsonStringAccumulator);
              setData(parsedData);
            } catch (e) {
              console.log("Parsing partial JSON... waiting for more chunks.");
            }
          }

          if (event.event === "message_end") {
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // リクエストがキャンセルされた場合は何もしない
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "ストリーミング中に予期しないエラーが発生しました"
      );
      setIsLoading(false);
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

  return {
    data,
    isLoading,
    error,
    executeStream,
    cancel,
  };
}
