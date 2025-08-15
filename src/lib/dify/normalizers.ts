import { Persona, BusinessIdea, ProductName, LeanCanvasData } from "../types";

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

  normalize(data: any): Persona[] {
    let personas: any[] = [];

    if (data.personas) {
      personas = data.personas;
    } else if (data.text && typeof data.text === "string") {
      // Text response is treated as error
      throw new Error(
        `Difyからテキストレスポンスが返されました。JSON形式での応答が必要です: ${data.text}`
      );
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
          id: persona.id || index + 1,
          description,
          needs: {
            explicit: this.extractPersonaNeeds(persona, "explicit"),
            implicit: this.extractPersonaNeeds(persona, "implicit"),
          },
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
        id: idea.id || index + 1,
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
        id: name.id || index + 1,
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
      case "canvas":
        return new CanvasNormalizer();
      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }
}
