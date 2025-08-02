import { create } from "zustand";
import {
  Persona,
  BusinessIdea,
  ProductName,
  ProductDetails,
  LeanCanvasData,
  WorkflowStep,
  DifyPersonaResponse,
  DifyBusinessIdeaResponse,
  DifyProductNameResponse,
  ApiResponse,
} from "@/lib/types";

interface WorkflowState {
  // Current state
  currentStep: WorkflowStep;
  isLoading: boolean;
  error: string | null;

  // Step data
  keyword: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  businessIdeas: BusinessIdea[];
  selectedBusinessIdea: BusinessIdea | null;
  productDetails: ProductDetails;
  productNames: ProductName[];
  selectedProductName: ProductName | null;
  leanCanvasData: LeanCanvasData | null;

  // Actions
  setKeyword: (keyword: string) => void;
  generatePersonas: () => Promise<void>;
  selectPersona: (persona: Persona) => void;
  generateBusinessIdeas: () => Promise<void>;
  selectBusinessIdea: (idea: BusinessIdea) => void;
  setProductDetails: (details: ProductDetails) => void;
  generateProductNames: () => Promise<void>;
  selectProductName: (name: ProductName) => void;
  generateLeanCanvas: () => Promise<void>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetWorkflow: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const INITIAL_PRODUCT_DETAILS: ProductDetails = {
  category: "",
  feature: "",
  brandImage: "",
};

const stepOrder: WorkflowStep[] = [
  "keyword",
  "persona-selection",
  "business-idea-selection",
  "details-input",
  "product-name-selection",
  "canvas-display",
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  currentStep: "keyword",
  isLoading: false,
  error: null,

  keyword: "",
  personas: [],
  selectedPersona: null,
  businessIdeas: [],
  selectedBusinessIdea: null,
  productDetails: INITIAL_PRODUCT_DETAILS,
  productNames: [],
  selectedProductName: null,
  leanCanvasData: null,

  // Actions
  setKeyword: (keyword) => {
    set({ keyword, error: null });
  },

  generatePersonas: async () => {
    const { keyword } = get();
    if (!keyword.trim()) {
      set({ error: "キーワードを入力してください" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "persona",
          keyword: keyword.trim(),
        }),
      });

      const result: ApiResponse<DifyPersonaResponse> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "ペルソナ生成に失敗しました");
      }

      const personas = result.data?.personas || [];
      if (personas.length === 0) {
        throw new Error(
          "ペルソナが生成されませんでした。異なるキーワードで再試行してください。"
        );
      }

      set({
        personas,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "ペルソナ生成に失敗しました",
        isLoading: false,
      });
    }
  },

  selectPersona: (persona) => {
    set({ selectedPersona: persona, error: null });
  },

  generateBusinessIdeas: async () => {
    const { selectedPersona } = get();
    if (!selectedPersona) {
      set({ error: "ペルソナを選択してください" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "businessidea",
          persona: selectedPersona,
        }),
      });

      const result: ApiResponse<DifyBusinessIdeaResponse> =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "ビジネスアイデア生成に失敗しました"
        );
      }

      set({
        businessIdeas: result.data?.business_ideas || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "ビジネスアイデア生成に失敗しました",
        isLoading: false,
      });
    }
  },

  selectBusinessIdea: (idea) => {
    set({ selectedBusinessIdea: idea, error: null });
  },

  setProductDetails: (details) => {
    set({ productDetails: details, error: null });
  },

  generateProductNames: async () => {
    const { selectedPersona, selectedBusinessIdea, productDetails } = get();

    if (!selectedPersona || !selectedBusinessIdea) {
      set({ error: "必要な情報が不足しています" });
      return;
    }

    if (
      !productDetails.category ||
      !productDetails.feature ||
      !productDetails.brandImage
    ) {
      set({ error: "商品詳細をすべて入力してください" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "productname",
          persona: selectedPersona,
          business_idea: selectedBusinessIdea,
          product_details: productDetails,
        }),
      });

      const result: ApiResponse<DifyProductNameResponse> =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "プロダクト名生成に失敗しました"
        );
      }

      set({
        productNames: result.data?.product_names || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "プロダクト名生成に失敗しました",
        isLoading: false,
      });
    }
  },

  selectProductName: (name) => {
    set({ selectedProductName: name, error: null });
  },

  generateLeanCanvas: async () => {
    const { selectedPersona, selectedBusinessIdea, selectedProductName } =
      get();

    if (!selectedPersona || !selectedBusinessIdea || !selectedProductName) {
      set({ error: "必要な情報が不足しています" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/dify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "canvas",
          persona: selectedPersona,
          business_idea: selectedBusinessIdea,
          product_name: selectedProductName,
        }),
      });

      const result: ApiResponse<LeanCanvasData> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "リーンキャンバス生成に失敗しました"
        );
      }

      set({
        leanCanvasData: result.data || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "リーンキャンバス生成に失敗しました",
        isLoading: false,
      });
    }
  },

  goToNextStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1], error: null });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1], error: null });
    }
  },

  resetWorkflow: () => {
    set({
      currentStep: "keyword",
      isLoading: false,
      error: null,
      keyword: "",
      personas: [],
      selectedPersona: null,
      businessIdeas: [],
      selectedBusinessIdea: null,
      productDetails: INITIAL_PRODUCT_DETAILS,
      productNames: [],
      selectedProductName: null,
      leanCanvasData: null,
    });
  },

  setError: (error) => {
    set({ error });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
