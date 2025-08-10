import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  TutorialState,
  TutorialStep,
} from "@/lib/types";
import {
  ERROR_MESSAGES,
  WORKFLOW_STEPS,
  TUTORIAL_MESSAGES,
} from "@/lib/constants/messages";
// Helper function to call the Dify API
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
      set({ error: ERROR_MESSAGES.KEYWORD_REQUIRED });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await callDifyApi<DifyPersonaResponse>({
        task: "persona",
        keyword: keyword.trim(),
      });

      const personas = result.data?.personas || [];
      if (personas.length === 0) {
        throw new Error(ERROR_MESSAGES.NO_PERSONAS_GENERATED);
      }

      set({
        personas,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.PERSONA_GENERATION_FAILED,
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
      set({ error: ERROR_MESSAGES.PERSONA_REQUIRED });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await callDifyApi<DifyBusinessIdeaResponse>({
        task: "businessidea",
        persona: selectedPersona,
      });

      set({
        businessIdeas: result.data?.business_ideas || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.BUSINESS_IDEA_GENERATION_FAILED,
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
      set({ error: ERROR_MESSAGES.REQUIRED_INFO_MISSING });
      return;
    }

    if (
      !productDetails.category ||
      !productDetails.feature ||
      !productDetails.brandImage
    ) {
      set({ error: ERROR_MESSAGES.PRODUCT_DETAILS_REQUIRED });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await callDifyApi<DifyProductNameResponse>({
        task: "productname",
        persona: selectedPersona,
        business_idea: selectedBusinessIdea,
        product_details: productDetails,
      });

      set({
        productNames: result.data?.product_names || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.PRODUCT_NAME_GENERATION_FAILED,
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
      set({ error: ERROR_MESSAGES.REQUIRED_INFO_MISSING });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await callDifyApi<LeanCanvasData>({
        task: "canvas",
        persona: selectedPersona,
        business_idea: selectedBusinessIdea,
        product_name: selectedProductName,
      });

      set({
        leanCanvasData: result.data || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.LEAN_CANVAS_GENERATION_FAILED,
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

// チュートリアル専用のストア
interface TutorialStore extends TutorialState {
  steps: TutorialStep[];
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "AI Lean Canvasへようこそ！",
    description: "このアプリの使い方をご案内します",
    content:
      "AIを活用してステップバイステップでリーンキャンバスを作成しましょう。キーワードから始めて、最終的に完全なビジネスプランが完成します。",
    position: "center",
    showSkip: true,
  },
  {
    id: "keyword-input",
    title: "1. キーワード入力",
    description: "ビジネスアイデアのキーワードを入力",
    target: "[data-tutorial='keyword-input']",
    content:
      "まず、あなたのビジネスアイデアに関連するキーワードを入力してください。例：「フィットネス」「料理」「教育」など。このキーワードを基にAIがペルソナを生成します。",
    position: "bottom",
  },
  {
    id: "generate-personas",
    title: "2. ペルソナ生成",
    description: "AIが10個のペルソナを生成します",
    target: "[data-tutorial='generate-personas']",
    content:
      "「ペルソナを生成」ボタンをクリックすると、AIがあなたのキーワードに基づいて10個の異なるペルソナ（顧客像）を生成します。",
    position: "top",
  },
  {
    id: "select-persona",
    title: "3. ペルソナ選択",
    description: "最も共感するペルソナを選択",
    target: "[data-tutorial='persona-cards']",
    content:
      "生成されたペルソナの中から、あなたのビジネスアイデアに最も適していると思うものを1つ選択してください。選択したペルソナが次のステップの基盤となります。",
    position: "top",
  },
  {
    id: "business-ideas",
    title: "4. ビジネスアイデア生成",
    description: "選択したペルソナ向けのアイデアを生成",
    content:
      "選択したペルソナの課題やニーズに基づいて、AIが10個のビジネスアイデアを生成します。これらのアイデアは、ペルソナの問題を解決することを目的としています。",
    position: "center",
  },
  {
    id: "product-details",
    title: "5. 商品詳細入力",
    description: "商品の詳細情報を入力",
    target: "[data-tutorial='product-details']",
    content:
      "選択したビジネスアイデアを基に、商品やサービスのカテゴリー、特徴、ブランドイメージを詳しく入力してください。これらの情報は魅力的なプロダクト名の生成に使用されます。",
    position: "top",
  },
  {
    id: "lean-canvas",
    title: "6. リーンキャンバス完成",
    description: "最終的なリーンキャンバスを確認",
    content:
      "これまでの選択内容を基に、AIが完全なリーンキャンバスを生成します。9つの要素すべてが含まれた、あなたのビジネスプランの完成形です！",
    position: "center",
    isLast: true,
  },
  {
    id: "navigation",
    title: "ナビゲーション",
    description: "便利な機能をご活用ください",
    target: "[data-tutorial='header-actions']",
    content:
      "リセットボタンで最初からやり直したり、テーマ切り替えボタンでダークモードを楽しんだりできます。いつでもこのチュートリアルを再表示することも可能です。",
    position: "bottom",
    isLast: true,
  },
];

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStepIndex: 0,
      hasCompleted: false,
      isSkipped: false,
      steps: tutorialSteps,

      startTutorial: () => {
        set({
          isActive: true,
          currentStepIndex: 0,
          hasCompleted: false,
          isSkipped: false,
        });
      },

      nextStep: () => {
        const { currentStepIndex, steps } = get();
        if (currentStepIndex < steps.length - 1) {
          set({ currentStepIndex: currentStepIndex + 1 });
        } else {
          get().completeTutorial();
        }
      },

      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      skipTutorial: () => {
        set({
          isActive: false,
          isSkipped: true,
          hasCompleted: false,
        });
      },

      completeTutorial: () => {
        set({
          isActive: false,
          hasCompleted: true,
          isSkipped: false,
        });
      },

      resetTutorial: () => {
        set({
          isActive: false,
          currentStepIndex: 0,
          hasCompleted: false,
          isSkipped: false,
        });
      },
    }),
    {
      name: "tutorial-state",
      partialize: (state) => ({
        hasCompleted: state.hasCompleted,
        isSkipped: state.isSkipped,
      }),
    }
  )
);
