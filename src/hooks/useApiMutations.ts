"use client";

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