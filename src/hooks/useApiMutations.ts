"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const response = await fetch('/api/dify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'API call failed');
  }

  return result;
}

// ストリーミングペルソナ生成のカスタムフック
export function useGeneratePersonasStream() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePersonas = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    setError(null);
    setPersonas([]);

    try {
      const response = await fetch('/api/dify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: "persona",
          keyword: keyword.trim(),
          streaming: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('レスポンスボディが取得できませんでした');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'persona') {
                setPersonas(prev => [...prev, parsed.data]);
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message || 'ストリーミング中にエラーが発生しました');
              } else if (parsed.type === 'end') {
                break;
              }
            } catch (parseError) {
              console.warn('JSON parse error:', parseError);
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ペルソナ生成に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPersonas([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    personas,
    isLoading,
    error,
    generatePersonas,
    reset,
  };
}

// 従来の非ストリーミング版（後方互換性のため保持）
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
      queryClient.setQueryData(['personas', keyword], data);
    },
  });
}

// ビジネスアイデア生成のミューテーション
export function useGenerateBusinessIdeas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ persona, creativityLevel }: {
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
        ['businessIdeas', variables.persona.id, variables.creativityLevel],
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
      businessIdea
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
        'productDetails',
        variables.persona.id,
        variables.businessIdea.id
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
      productDetails
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
        'productNames',
        variables.persona.id,
        variables.businessIdea.id,
        JSON.stringify(variables.productDetails)
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
        'leanCanvas',
        variables.persona.id,
        variables.businessIdea.id,
        variables.productName.id
      ];
      queryClient.setQueryData(cacheKey, data);
    },
  });
}
