import { Persona, BusinessIdea, ProductName, LeanCanvasData } from '../types';

export abstract class DataNormalizer<TInput, TOutput> {
  abstract normalize(data: any): TOutput;
  abstract validate(data: TOutput): boolean;
  
  protected extractArray(data: any, possibleKeys: string[]): any[] {
    for (const key of possibleKeys) {
      if (data[key] && Array.isArray(data[key])) {
        return data[key];
      }
    }
    return Array.isArray(data) ? data : (data.data || data.output || []);
  }
}

export class PersonaNormalizer extends DataNormalizer<any, Persona[]> {
  normalize(data: any): Persona[] {
    let personas: any[] = [];

    if (data.personas) {
      personas = data.personas;
    } else if (data.text && typeof data.text === 'string') {
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
      return personas.map((persona: any, index: number) => ({
        id: persona.id || index + 1,
        description: persona.description || persona.text || String(persona),
        needs: {
          explicit:
            persona.needs?.explicit ||
            persona.explicit_needs ||
            persona.explicit ||
            "",
          implicit:
            persona.needs?.implicit ||
            persona.implicit_needs ||
            persona.implicit ||
            "",
        },
      }));
    }

    return [];
  }

  validate(data: Persona[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class BusinessIdeaNormalizer extends DataNormalizer<any, BusinessIdea[]> {
  normalize(data: any): BusinessIdea[] {
    let businessIdeas: any[] = [];

    if (data.business_ideas) {
      businessIdeas = data.business_ideas;
    } else if (data.ideas) {
      businessIdeas = data.ideas;
    } else if (Array.isArray(data)) {
      businessIdeas = data;
    } else {
      businessIdeas = data.data || data.output || [];
    }

    // Normalize business idea data
    if (Array.isArray(businessIdeas)) {
      return businessIdeas.map((idea: any, index: number) => ({
        id: idea.id || index + 1,
        idea_text: idea.idea_text || idea.idea || idea.text || String(idea),
        osborn_hint: idea.osborn_hint || idea.hint || idea.reasoning || "",
      }));
    }

    return [];
  }

  validate(data: BusinessIdea[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class ProductNameNormalizer extends DataNormalizer<any, ProductName[]> {
  normalize(data: any): ProductName[] {
    let productNames: any[] = [];

    if (data.product_names) {
      productNames = data.product_names;
    } else if (data.names) {
      productNames = data.names;
    } else if (Array.isArray(data)) {
      productNames = data;
    } else {
      productNames = data.data || data.output || [];
    }

    // Normalize product name data
    if (Array.isArray(productNames)) {
      return productNames.map((name: any, index: number) => ({
        id: name.id || index + 1,
        name: name.name || name.product_name || String(name),
        reason: name.reason || name.reasoning || name.explanation || "",
        pros: name.pros || name.advantages || name.benefits || "",
        cons: name.cons || name.disadvantages || name.drawbacks || "",
      }));
    }

    return [];
  }

  validate(data: ProductName[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }
}

export class CanvasNormalizer extends DataNormalizer<any, LeanCanvasData> {
  normalize(data: any): LeanCanvasData {
    // Normalize lean canvas data
    return {
      problem: Array.isArray(data.problem)
        ? data.problem
        : Array.isArray(data.problems)
          ? data.problems
          : [],
      solution: Array.isArray(data.solution)
        ? data.solution
        : Array.isArray(data.solutions)
          ? data.solutions
          : [],
      keyMetrics: Array.isArray(data.key_metrics)
        ? data.key_metrics
        : Array.isArray(data.keyMetrics)
          ? data.keyMetrics
          : Array.isArray(data.metrics)
            ? data.metrics
            : [],
      uniqueValueProposition: Array.isArray(data.unique_value_proposition)
        ? data.unique_value_proposition
        : Array.isArray(data.uniqueValueProposition)
          ? data.uniqueValueProposition
          : Array.isArray(data.value_proposition)
            ? data.value_proposition
            : [],
      unfairAdvantage: Array.isArray(data.unfair_advantage)
        ? data.unfair_advantage
        : Array.isArray(data.unfairAdvantage)
          ? data.unfairAdvantage
          : Array.isArray(data.advantage)
            ? data.advantage
            : [],
      channels: Array.isArray(data.channels) ? data.channels : [],
      customerSegments: Array.isArray(data.customer_segments)
        ? data.customer_segments
        : Array.isArray(data.customerSegments)
          ? data.customerSegments
          : Array.isArray(data.segments)
            ? data.segments
            : [],
      costStructure: Array.isArray(data.cost_structure)
        ? data.cost_structure
        : Array.isArray(data.costStructure)
          ? data.costStructure
          : Array.isArray(data.costs)
            ? data.costs
            : [],
      revenueStreams: Array.isArray(data.revenue_streams)
        ? data.revenue_streams
        : Array.isArray(data.revenueStreams)
          ? data.revenueStreams
          : Array.isArray(data.revenue)
            ? data.revenue
            : [],
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
      case 'persona': 
        return new PersonaNormalizer();
      case 'businessidea': 
        return new BusinessIdeaNormalizer();
      case 'productname': 
        return new ProductNameNormalizer();
      case 'canvas': 
        return new CanvasNormalizer();
      default: 
        throw new Error(`Unknown task: ${task}`);
    }
  }
}