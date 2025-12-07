"use server";

import { DifyApiClient, DifyConfig } from "@/lib/dify/client";
import { TaskProcessorFactory } from "@/lib/dify/task-processor";
import { Logger } from "@/lib/utils/logger";
import { ENV_CONFIG } from "@/lib/config/env-config";
import { ERROR_MESSAGES } from "@/lib/constants/messages";
import {
  Persona,
  BusinessIdea,
  ProductName,
  ProductDetails,
  LeanCanvasData,
  CreativityLevel,
  DifyPersonaResponse,
  DifyBusinessIdeaResponse,
  DifyProductNameResponse,
  DifyProductDetailsResponse,
} from "@/lib/types";

// Action用の戻り値型定義
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Dify設定を作成するヘルパー関数
function createDifyConfig(): DifyConfig {
  return {
    apiKey: ENV_CONFIG.DIFY_API_KEY,
    apiUrl: ENV_CONFIG.DIFY_API_URL,
    isDemoMode: ENV_CONFIG.IS_DEMO_MODE,
  };
}

// エラーメッセージを生成するヘルパー関数
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("タイムアウト")) {
      return error.message;
    } else if (error.message.includes("Dify API error: 400")) {
      return "Difyワークフローの設定に問題があります。管理者に連絡してください。";
    } else if (error.message.includes("Dify API error: 401")) {
      return "Dify APIの認証に失敗しました。API設定を確認してください。";
    } else if (error.message.includes("Dify API error: 404")) {
      return "Difyワークフローが見つかりません。設定を確認してください。";
    } else if (error.message.includes("未知のタスク")) {
      return error.message;
    } else if (
      error.message.includes("が必要です") ||
      error.message.includes("が不足しています")
    ) {
      return error.message;
    }
    return error.message;
  }
  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * ペルソナ生成 Server Action
 */
export async function generatePersonasAction(params: {
  keyword: string;
  challenges?: string;
  notes?: string;
}): Promise<ActionResult<Persona[]>> {
  const logger = new Logger("generatePersonasAction");

  try {
    logger.info("Generating personas", {
      keyword: params.keyword,
      hasChallenges: !!params.challenges,
      hasNotes: !!params.notes,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("persona", difyClient);

    const result = await processor.process({
      task: "persona",
      keyword: params.keyword.trim(),
      challenges: params.challenges?.trim(),
      notes: params.notes?.trim(),
    });

    const typedResult = result as DifyPersonaResponse;
    
    if (!typedResult.personas || typedResult.personas.length === 0) {
      throw new Error("ペルソナが生成されませんでした");
    }

    logger.info("Personas generated successfully", {
      count: typedResult.personas.length,
    });

    return {
      success: true,
      data: typedResult.personas,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(error, { errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * ビジネスアイデア生成 Server Action
 */
export async function generateBusinessIdeasAction(params: {
  persona: Persona;
  creativityLevel: CreativityLevel;
}): Promise<ActionResult<BusinessIdea[]>> {
  const logger = new Logger("generateBusinessIdeasAction");

  try {
    logger.info("Generating business ideas", {
      personaId: params.persona.id,
      creativityLevel: params.creativityLevel,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("businessidea", difyClient);

    const result = await processor.process({
      task: "businessidea",
      persona: params.persona,
      creativity_level: params.creativityLevel,
    });

    const typedResult = result as DifyBusinessIdeaResponse;

    if (!typedResult.business_ideas || typedResult.business_ideas.length === 0) {
      throw new Error("ビジネスアイデアが生成されませんでした");
    }

    logger.info("Business ideas generated successfully", {
      count: typedResult.business_ideas.length,
    });

    return {
      success: true,
      data: typedResult.business_ideas,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(error, { errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 商品詳細生成 Server Action
 */
export async function generateProductDetailsAction(params: {
  persona: Persona;
  businessIdea: BusinessIdea;
}): Promise<ActionResult<ProductDetails>> {
  const logger = new Logger("generateProductDetailsAction");

  try {
    logger.info("Generating product details", {
      personaId: params.persona.id,
      businessIdeaId: params.businessIdea.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create(
      "generate_product_details",
      difyClient
    );

    const result = await processor.process({
      task: "generate_product_details",
      persona: params.persona,
      business_idea: params.businessIdea,
    });

    const typedResult = result as DifyProductDetailsResponse;

    if (!typedResult.category || !typedResult.feature || !typedResult.brandImage) {
      throw new Error("商品詳細が正しく生成されませんでした");
    }

    logger.info("Product details generated successfully");

    return {
      success: true,
      data: typedResult,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(error, { errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * プロダクト名生成 Server Action
 */
export async function generateProductNamesAction(params: {
  persona: Persona;
  businessIdea: BusinessIdea;
  productDetails: ProductDetails;
}): Promise<ActionResult<ProductName[]>> {
  const logger = new Logger("generateProductNamesAction");

  try {
    logger.info("Generating product names", {
      personaId: params.persona.id,
      businessIdeaId: params.businessIdea.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("productname", difyClient);

    const result = await processor.process({
      task: "productname",
      persona: params.persona,
      business_idea: params.businessIdea,
      product_details: params.productDetails,
    });

    const typedResult = result as DifyProductNameResponse;

    if (!typedResult.product_names || typedResult.product_names.length === 0) {
      throw new Error("プロダクト名が生成されませんでした");
    }

    logger.info("Product names generated successfully", {
      count: typedResult.product_names.length,
    });

    return {
      success: true,
      data: typedResult.product_names,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(error, { errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * リーンキャンバス生成 Server Action
 */
export async function generateLeanCanvasAction(params: {
  persona: Persona;
  businessIdea: BusinessIdea;
  productName: ProductName;
}): Promise<ActionResult<LeanCanvasData>> {
  const logger = new Logger("generateLeanCanvasAction");

  try {
    logger.info("Generating lean canvas", {
      personaId: params.persona.id,
      businessIdeaId: params.businessIdea.id,
      productNameId: params.productName.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("canvas", difyClient);

    const result = await processor.process({
      task: "canvas",
      persona: params.persona,
      business_idea: params.businessIdea,
      product_name: params.productName,
    });

    const typedResult = result as LeanCanvasData;

    // リーンキャンバスの必須項目を検証
    if (
      !typedResult.problem ||
      !typedResult.solution ||
      !typedResult.uniqueValueProposition
    ) {
      throw new Error("リーンキャンバスが正しく生成されませんでした");
    }

    logger.info("Lean canvas generated successfully");

    return {
      success: true,
      data: typedResult,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    logger.error(error, { errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
}


