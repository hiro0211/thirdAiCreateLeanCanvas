import { DifyApiClient, DifyRequest } from "./client";
import { NormalizerFactory } from "./normalizers";
import { Logger } from "../utils/logger";
import {
  DifyPersonaRequest,
  DifyBusinessIdeaRequest,
  DifyProductNameRequest,
  DifyCanvasRequest,
  DifyPersonaResponse,
  DifyBusinessIdeaResponse,
  DifyProductNameResponse,
  LeanCanvasData,
  Persona,
  BusinessIdea,
  ProductName,
} from "../types";

export abstract class TaskProcessor<TRequest, TResponse> {
  protected logger = new Logger(`${this.constructor.name}`);

  constructor(protected difyClient: DifyApiClient) {}

  abstract validateRequest(body: any): body is TRequest;
  abstract buildDifyRequest(request: TRequest): DifyRequest;
  abstract getTaskName(): string;
  abstract getValidationErrorMessage(): string;

  async process(body: any): Promise<TResponse> {
    if (!this.validateRequest(body)) {
      throw new Error(this.getValidationErrorMessage());
    }

    const difyRequest = this.buildDifyRequest(body);
    const rawResult = await this.difyClient.callApi(difyRequest);

    const normalizer = NormalizerFactory.create(this.getTaskName());
    const normalizedData = normalizer.normalize(rawResult);

    if (!normalizer.validate(normalizedData)) {
      throw new Error(
        `Difyから${this.getTaskName()}データが返されませんでした`
      );
    }

    return normalizedData as TResponse;
  }
}

export class PersonaTaskProcessor extends TaskProcessor<
  DifyPersonaRequest,
  DifyPersonaResponse
> {
  validateRequest(body: any): body is DifyPersonaRequest {
    return (
      body && typeof body.keyword === "string" && body.keyword.trim() !== ""
    );
  }

  buildDifyRequest(request: DifyPersonaRequest): DifyRequest {
    return {
      inputs: {
        keyword: request.keyword.trim(),
      },
      query: `キーワード「${request.keyword.trim()}」に基づいて10個のペルソナを生成してください。JSON形式で {personas: [...]} として返してください。`,
      task: "persona",
    };
  }

  getTaskName(): string {
    return "persona";
  }

  getValidationErrorMessage(): string {
    return "キーワードが必要です";
  }

  async process(body: any): Promise<DifyPersonaResponse> {
    if (!this.validateRequest(body)) {
      throw new Error(this.getValidationErrorMessage());
    }

    const difyRequest = this.buildDifyRequest(body);
    const rawResult = await this.difyClient.callApi(difyRequest);

    const normalizer = NormalizerFactory.create(this.getTaskName());
    const normalizedData = normalizer.normalize(rawResult);

    if (!normalizer.validate(normalizedData)) {
      throw new Error(
        `Difyから${this.getTaskName()}データが返されませんでした`
      );
    }

    return {
      personas: normalizedData as Persona[],
    };
  }
}

export class BusinessIdeaTaskProcessor extends TaskProcessor<
  DifyBusinessIdeaRequest,
  DifyBusinessIdeaResponse
> {
  validateRequest(body: any): body is DifyBusinessIdeaRequest {
    return body && body.persona && typeof body.persona === "object";
  }

  buildDifyRequest(request: DifyBusinessIdeaRequest): DifyRequest {
    return {
      inputs: {
        persona: JSON.stringify(request.persona),
      },
      query: `次のペルソナに基づいて10個のビジネスアイデアを生成してください。JSON形式で {business_ideas: [...]} として返してください。`,
      task: "businessidea",
    };
  }

  getTaskName(): string {
    return "businessidea";
  }

  getValidationErrorMessage(): string {
    return "ペルソナが必要です";
  }

  async process(body: any): Promise<DifyBusinessIdeaResponse> {
    if (!this.validateRequest(body)) {
      throw new Error(this.getValidationErrorMessage());
    }

    const difyRequest = this.buildDifyRequest(body);
    const rawResult = await this.difyClient.callApi(difyRequest);

    const normalizer = NormalizerFactory.create(this.getTaskName());
    const normalizedData = normalizer.normalize(rawResult);

    if (!normalizer.validate(normalizedData)) {
      throw new Error(
        `Difyから${this.getTaskName()}データが返されませんでした`
      );
    }

    return {
      business_ideas: normalizedData as BusinessIdea[],
    };
  }
}

export class ProductNameTaskProcessor extends TaskProcessor<
  DifyProductNameRequest,
  DifyProductNameResponse
> {
  validateRequest(body: any): body is DifyProductNameRequest {
    return (
      body &&
      body.persona &&
      typeof body.persona === "object" &&
      body.business_idea &&
      typeof body.business_idea === "object" &&
      body.product_details &&
      typeof body.product_details === "object"
    );
  }

  buildDifyRequest(request: DifyProductNameRequest): DifyRequest {
    return {
      inputs: {
        persona: JSON.stringify(request.persona),
        business_idea: JSON.stringify(request.business_idea),
        product_details: JSON.stringify(request.product_details),
      },
      query: `以下の情報に基づいて10個のプロダクト名を生成してください。JSON形式で {product_names: [...]} として返してください。`,
      task: "productname",
    };
  }

  getTaskName(): string {
    return "productname";
  }

  getValidationErrorMessage(): string {
    return "必要な情報が不足しています";
  }

  async process(body: any): Promise<DifyProductNameResponse> {
    if (!this.validateRequest(body)) {
      throw new Error(this.getValidationErrorMessage());
    }

    const difyRequest = this.buildDifyRequest(body);
    const rawResult = await this.difyClient.callApi(difyRequest);

    const normalizer = NormalizerFactory.create(this.getTaskName());
    const normalizedData = normalizer.normalize(rawResult);

    if (!normalizer.validate(normalizedData)) {
      throw new Error(
        `Difyから${this.getTaskName()}データが返されませんでした`
      );
    }

    return {
      product_names: normalizedData as ProductName[],
    };
  }
}

export class CanvasTaskProcessor extends TaskProcessor<
  DifyCanvasRequest,
  LeanCanvasData
> {
  validateRequest(body: any): body is DifyCanvasRequest {
    return (
      body &&
      body.persona &&
      typeof body.persona === "object" &&
      body.business_idea &&
      typeof body.business_idea === "object" &&
      body.product_name &&
      typeof body.product_name === "object"
    );
  }

  buildDifyRequest(request: DifyCanvasRequest): DifyRequest {
    return {
      inputs: {
        persona: JSON.stringify(request.persona),
        business_idea: JSON.stringify(request.business_idea),
        product_name: JSON.stringify(request.product_name),
      },
      query: `以下の情報に基づいてリーンキャンバスを生成してください。JSON形式で各要素を配列として返してください。例: {problem: [...], solution: [...], channels: [...], ...}`,
      task: "canvas",
    };
  }

  getTaskName(): string {
    return "canvas";
  }

  getValidationErrorMessage(): string {
    return "必要な情報が不足しています";
  }

  async process(body: any): Promise<LeanCanvasData> {
    if (!this.validateRequest(body)) {
      throw new Error(this.getValidationErrorMessage());
    }

    const difyRequest = this.buildDifyRequest(body);
    const rawResult = await this.difyClient.callApi(difyRequest);

    const normalizer = NormalizerFactory.create(this.getTaskName());
    const normalizedData = normalizer.normalize(rawResult);

    if (!normalizer.validate(normalizedData)) {
      throw new Error(
        `Difyから${this.getTaskName()}データが返されませんでした`
      );
    }

    return normalizedData as LeanCanvasData;
  }
}

export class TaskProcessorFactory {
  static create(
    task: string,
    difyClient: DifyApiClient
  ): TaskProcessor<any, any> {
    switch (task) {
      case "persona":
        return new PersonaTaskProcessor(difyClient);
      case "businessidea":
        return new BusinessIdeaTaskProcessor(difyClient);
      case "productname":
        return new ProductNameTaskProcessor(difyClient);
      case "canvas":
        return new CanvasTaskProcessor(difyClient);
      default:
        throw new Error(`未知のタスク: ${task}`);
    }
  }
}
