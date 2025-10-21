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
} from "@/lib/types";

// Server Action共通の型定義
export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Dify設定を作成
function createDifyConfig(): DifyConfig {
  return {
    apiKey: ENV_CONFIG.DIFY_API_KEY,
    apiUrl: ENV_CONFIG.DIFY_API_URL,
    isDemoMode: ENV_CONFIG.IS_DEMO_MODE,
  };
}

/**
 * ペルソナ生成 Server Action
 */
export async function generatePersonasAction(input: {
  keyword: string;
  challenges?: string;
  notes?: string;
}): Promise<ActionResult<Persona[]>> {
  const logger = new Logger("generatePersonasAction");

  try {
    const { keyword, challenges, notes } = input;

    if (!keyword || !keyword.trim()) {
      return {
        success: false,
        error: "キーワードが必要です",
      };
    }

    logger.info("Generating personas", { keyword });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("persona", difyClient);

    const result = await processor.process({
      task: "persona",
      keyword: keyword.trim(),
      challenges: challenges?.trim(),
      notes: notes?.trim(),
    });

    return {
      success: true,
      data: result.personas,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    logger.error(error, { keyword: input.keyword });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * ビジネスアイデア生成 Server Action
 */
export async function generateBusinessIdeasAction(input: {
  persona: Persona;
  creativityLevel: CreativityLevel;
}): Promise<ActionResult<BusinessIdea[]>> {
  const logger = new Logger("generateBusinessIdeasAction");

  try {
    const { persona, creativityLevel } = input;

    if (!persona) {
      return {
        success: false,
        error: "ペルソナが選択されていません",
      };
    }

    logger.info("Generating business ideas", {
      personaId: persona.id,
      creativityLevel,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("businessidea", difyClient);

    const result = await processor.process({
      task: "businessidea",
      persona,
      creativity_level: creativityLevel,
    });

    return {
      success: true,
      data: result.business_ideas,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    logger.error(error, { personaId: input.persona?.id });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 商品詳細生成 Server Action
 */
export async function generateProductDetailsAction(input: {
  persona: Persona;
  businessIdea: BusinessIdea;
}): Promise<ActionResult<ProductDetails>> {
  const logger = new Logger("generateProductDetailsAction");

  try {
    const { persona, businessIdea } = input;

    if (!persona || !businessIdea) {
      return {
        success: false,
        error: "ペルソナまたはビジネスアイデアが選択されていません",
      };
    }

    logger.info("Generating product details", {
      personaId: persona.id,
      businessIdeaId: businessIdea.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create(
      "generate_product_details",
      difyClient
    );

    const result = await processor.process({
      task: "generate_product_details",
      persona,
      business_idea: businessIdea,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    logger.error(error, {
      personaId: input.persona?.id,
      businessIdeaId: input.businessIdea?.id,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * プロダクト名生成 Server Action
 */
export async function generateProductNamesAction(input: {
  persona: Persona;
  businessIdea: BusinessIdea;
  productDetails: ProductDetails;
}): Promise<ActionResult<ProductName[]>> {
  const logger = new Logger("generateProductNamesAction");

  try {
    const { persona, businessIdea, productDetails } = input;

    if (!persona || !businessIdea || !productDetails) {
      return {
        success: false,
        error: "必要な情報が不足しています",
      };
    }

    logger.info("Generating product names", {
      personaId: persona.id,
      businessIdeaId: businessIdea.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("productname", difyClient);

    const result = await processor.process({
      task: "productname",
      persona,
      business_idea: businessIdea,
      product_details: productDetails,
    });

    return {
      success: true,
      data: result.product_names,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    logger.error(error, {
      personaId: input.persona?.id,
      businessIdeaId: input.businessIdea?.id,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * リーンキャンバス生成 Server Action
 */
export async function generateLeanCanvasAction(input: {
  persona: Persona;
  businessIdea: BusinessIdea;
  productName: ProductName;
}): Promise<ActionResult<LeanCanvasData>> {
  const logger = new Logger("generateLeanCanvasAction");

  try {
    const { persona, businessIdea, productName } = input;

    if (!persona || !businessIdea || !productName) {
      return {
        success: false,
        error: "必要な情報が不足しています",
      };
    }

    logger.info("Generating lean canvas", {
      personaId: persona.id,
      businessIdeaId: businessIdea.id,
      productNameId: productName.id,
    });

    const config = createDifyConfig();
    const difyClient = new DifyApiClient(config);
    const processor = TaskProcessorFactory.create("canvas", difyClient);

    const result = await processor.process({
      task: "canvas",
      persona,
      business_idea: businessIdea,
      product_name: productName,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
    logger.error(error, {
      personaId: input.persona?.id,
      businessIdeaId: input.businessIdea?.id,
      productNameId: input.productName?.id,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}



