import {
  Persona,
  BusinessIdea,
  ProductName,
  LeanCanvasData,
  DifyProductDetailsResponse,
} from "../types";

export abstract class DataNormalizer<TInput, TOutput> {
  abstract normalize(data: any): TOutput;
  abstract validate(data: TOutput): boolean;

  protected extractArray(data: any, possibleKeys: string[]): any[] {
    for (const key of possibleKeys) {
      if (data[key] && Array.isArray(data[key])) {
        return data[key];
      }
    }
    return Array.isArray(data) ? data : data.data || data.output || [];
  }
}

export class PersonaNormalizer extends DataNormalizer<any, Persona[]> {
  private extractPersonaNeeds(
    persona: any,
    needType: "explicit" | "implicit"
  ): string {
    const possibleKeys = [
      `${needType}`,
      `${needType}_needs`,
      `needs.${needType}`,
    ];

    // Check persona.needs first
    if (persona.needs?.[needType]) {
      return persona.needs[needType];
    }

    // Check direct properties
    for (const key of possibleKeys) {
      if (persona[key]) {
        return persona[key];
      }
    }

    return "";
  }

  /**
   * 連続するJSONオブジェクトを含むテキストをパースする
   */
  private parseMultipleJsonObjects(text: string): any[] {
    const objects: any[] = [];
    let currentJson = "";
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (escapeNext) {
        escapeNext = false;
        currentJson += char;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        currentJson += char;
        continue;
      }

      if (char === '"' && !escapeNext) {
        inString = !inString;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
        }
      }

      currentJson += char;

      // JSONオブジェクトが完成した場合
      if (braceCount === 0 && currentJson.trim() && !inString) {
        try {
          const parsed = JSON.parse(currentJson.trim());
          objects.push(parsed);
          currentJson = "";
        } catch (e) {
          // パースに失敗した場合は次の文字から再開
          if (i < text.length - 1) {
            currentJson = "";
            continue;
          }
        }
      }
    }

    // 残りのJSONがある場合
    if (currentJson.trim()) {
      try {
        const parsed = JSON.parse(currentJson.trim());
        objects.push(parsed);
      } catch (e) {
        // 最後のJSONパースに失敗した場合は無視
      }
    }

    return objects;
  }

  normalize(data: any): Persona[] {
    let personas: any[] = [];

    if (data.personas) {
      personas = data.personas;
    } else if (data.text && typeof data.text === "string") {
      // 連続するJSONオブジェクトをパースしてみる
      try {
        const parsedObjects = this.parseMultipleJsonObjects(data.text);
        if (parsedObjects.length > 0) {
          personas = parsedObjects;
        } else {
          // パースできない場合はエラー
          throw new Error(
            `Difyからテキストレスポンスが返されました。JSON形式での応答が必要です: ${data.text.substring(0, 500)}...`
          );
        }
      } catch (parseError) {
        throw new Error(
          `Difyからテキストレスポンスが返されました。JSON形式での応答が必要です: ${data.text.substring(0, 500)}...`
        );
      }
    } else if (Array.isArray(data)) {
      // Direct array response
      personas = data;
    } else {
      // Try other formats
      personas = data.data || data.output || [];
    }

    // Normalize persona data
    if (Array.isArray(personas)) {
      return personas.map((persona: any, index: number) => {
        // より柔軟なdescription抽出
        let description = "";
        if (typeof persona === "string") {
          description = persona;
        } else if (typeof persona === "object" && persona !== null) {
          description =
            persona.description ||
            persona.text ||
            persona.content ||
            persona.persona ||
            JSON.stringify(persona);
        } else {
          description = String(persona);
        }

        return {
          id: persona.id || `persona-${Date.now()}-${index}`,
          description,
          explicit_needs: this.extractPersonaNeeds(persona, "explicit"),
          implicit_needs: this.extractPersonaNeeds(persona, "implicit"),
        };
      });
    }

    return [];
  }

  validate(data: Persona[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class BusinessIdeaNormalizer extends DataNormalizer<
  any,
  BusinessIdea[]
> {
  private extractIdeaText(idea: any): string {
    const possibleKeys = ["idea_text", "idea", "text"];
    for (const key of possibleKeys) {
      if (idea[key]) {
        return idea[key];
      }
    }
    return String(idea);
  }

  private extractOsbornHint(idea: any): string {
    const possibleKeys = ["osborn_hint", "hint", "reasoning"];
    for (const key of possibleKeys) {
      if (idea[key]) {
        return idea[key];
      }
    }
    return "";
  }

  normalize(data: any): BusinessIdea[] {
    const businessIdeas = this.extractArray(data, ["business_ideas", "ideas"]);

    if (Array.isArray(businessIdeas)) {
      return businessIdeas.map((idea: any, index: number) => ({
        id: idea.id || `idea-${Date.now()}-${index}`,
        idea_text: this.extractIdeaText(idea),
        osborn_hint: this.extractOsbornHint(idea),
      }));
    }

    return [];
  }

  validate(data: BusinessIdea[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class ProductNameNormalizer extends DataNormalizer<any, ProductName[]> {
  private extractProductName(nameData: any): string {
    const possibleKeys = ["name", "product_name"];
    for (const key of possibleKeys) {
      if (nameData[key]) {
        return nameData[key];
      }
    }
    return String(nameData);
  }

  private extractProductField(
    nameData: any,
    fieldType: "reason" | "pros" | "cons"
  ): string {
    const fieldMappings = {
      reason: ["reason", "reasoning", "explanation"],
      pros: ["pros", "advantages", "benefits"],
      cons: ["cons", "disadvantages", "drawbacks"],
    };

    const possibleKeys = fieldMappings[fieldType];
    for (const key of possibleKeys) {
      if (nameData[key]) {
        return nameData[key];
      }
    }
    return "";
  }

  normalize(data: any): ProductName[] {
    const productNames = this.extractArray(data, ["product_names", "names"]);

    if (Array.isArray(productNames)) {
      return productNames.map((name: any, index: number) => ({
        id: name.id || `name-${Date.now()}-${index}`,
        name: this.extractProductName(name),
        reason: this.extractProductField(name, "reason"),
        pros: this.extractProductField(name, "pros"),
        cons: this.extractProductField(name, "cons"),
      }));
    }

    return [];
  }

  validate(data: ProductName[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class ProductDetailsNormalizer extends DataNormalizer<
  any,
  DifyProductDetailsResponse
> {
  private extractField(
    data: any,
    fieldName: keyof DifyProductDetailsResponse
  ): string {
    const possibleKeys = [
      fieldName,
      `product_${fieldName}`,
      `service_${fieldName}`,
    ];

    for (const key of possibleKeys) {
      if (data[key] && typeof data[key] === "string") {
        return data[key];
      }
    }

    return "";
  }

  normalize(data: any): DifyProductDetailsResponse {
    return {
      category: this.extractField(data, "category"),
      feature: this.extractField(data, "feature"),
      brandImage: this.extractField(data, "brandImage"),
    };
  }

  validate(data: DifyProductDetailsResponse): boolean {
    return !!(data.category && data.feature && data.brandImage);
  }
}

export class CanvasNormalizer extends DataNormalizer<any, LeanCanvasData> {
  private extractCanvasField(data: any, possibleKeys: string[]): string[] {
    for (const key of possibleKeys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
    return [];
  }

  normalize(data: any): LeanCanvasData {
    return {
      problem: this.extractCanvasField(data, ["problem", "problems"]),
      solution: this.extractCanvasField(data, ["solution", "solutions"]),
      keyMetrics: this.extractCanvasField(data, [
        "key_metrics",
        "keyMetrics",
        "metrics",
      ]),
      uniqueValueProposition: this.extractCanvasField(data, [
        "unique_value_proposition",
        "uniqueValueProposition",
        "value_proposition",
      ]),
      unfairAdvantage: this.extractCanvasField(data, [
        "unfair_advantage",
        "unfairAdvantage",
        "advantage",
      ]),
      channels: this.extractCanvasField(data, ["channels"]),
      customerSegments: this.extractCanvasField(data, [
        "customer_segments",
        "customerSegments",
        "segments",
      ]),
      costStructure: this.extractCanvasField(data, [
        "cost_structure",
        "costStructure",
        "costs",
      ]),
      revenueStreams: this.extractCanvasField(data, [
        "revenue_streams",
        "revenueStreams",
        "revenue",
      ]),
    };
  }

  validate(data: LeanCanvasData): boolean {
    // Ensure at least one field has data
    return Object.values(data).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
  }
}

export class NormalizerFactory {
  static create(task: string): DataNormalizer<any, any> {
    switch (task) {
      case "persona":
        return new PersonaNormalizer();
      case "businessidea":
        return new BusinessIdeaNormalizer();
      case "productname":
        return new ProductNameNormalizer();
      case "generate_product_details":
        return new ProductDetailsNormalizer();
      case "canvas":
        return new CanvasNormalizer();
      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }
}
