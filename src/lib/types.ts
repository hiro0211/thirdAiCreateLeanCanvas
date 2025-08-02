// Difyの各タスクからのレスポンスJSONの型
export interface Persona {
  id: number;
  description: string;
  needs: {
    explicit: string;
    implicit: string;
  };
}

export interface BusinessIdea {
  id: number;
  idea_text: string;
  osborn_hint: string;
}

export interface ProductName {
  id: number;
  name: string;
  reason: string;
  pros: string;
  cons: string;
}

export interface LeanCanvasData {
  problem: string[];
  solution: string[];
  keyMetrics: string[];
  uniqueValueProposition: string[];
  unfairAdvantage: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

// Dify APIからのレスポンスの型（トップレベルのキーを含む）
export interface DifyPersonaResponse {
  personas: Persona[];
}

export interface DifyBusinessIdeaResponse {
  business_ideas: BusinessIdea[];
}

export interface DifyProductNameResponse {
  product_names: ProductName[];
}

// Dify APIリクエストペイロードの型
export interface DifyPersonaRequest {
  task: 'persona';
  keyword: string;
}

export interface DifyBusinessIdeaRequest {
  task: 'businessidea';
  persona: Persona;
}

export interface DifyProductNameRequest {
  task: 'productname';
  persona: Persona;
  business_idea: BusinessIdea;
  product_details: ProductDetails;
}

export interface DifyCanvasRequest {
  task: 'canvas';
  persona: Persona;
  business_idea: BusinessIdea;
  product_name: ProductName;
}

// 製品詳細の型
export interface ProductDetails {
  category: string;
  feature: string;
  brandImage: string;
}

// ワークフローのステップ定義
export type WorkflowStep = 
  | 'keyword'
  | 'persona-selection'
  | 'business-idea-selection'
  | 'details-input'
  | 'product-name-selection'
  | 'canvas-display';

// API エラーレスポンスの型
export interface ApiError {
  message: string;
  code?: string;
}

// API レスポンスの共通型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}