import { NextRequest, NextResponse } from "next/server";
import {
  DifyPersonaRequest,
  DifyBusinessIdeaRequest,
  DifyProductNameRequest,
  DifyCanvasRequest,
  DifyPersonaResponse,
  DifyBusinessIdeaResponse,
  DifyProductNameResponse,
  LeanCanvasData,
  ApiResponse,
} from "@/lib/types";

const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL;

if (!DIFY_API_KEY) {
  console.error("DIFY_API_KEY is not set in environment variables");
}

if (!DIFY_API_URL) {
  console.error("NEXT_PUBLIC_DIFY_API_URL is not set in environment variables");
}

// デモ用のモックデータを生成
function generateMockData(task: string, inputs: Record<string, any>): any {
  console.log(`Generating mock data for task: ${task}`, inputs);

  switch (task) {
    case "persona":
      return {
        personas: [
          {
            id: 1,
            description:
              "40代の働く女性で、健康意識が高く、家族の健康管理も担当している。忙しい日常の中で効率的な健康管理方法を求めている。",
            needs: {
              explicit: "簡単で継続しやすい健康管理ツール",
              implicit: "家族全体の健康状態を把握し、安心感を得たい",
            },
          },
          {
            id: 2,
            description:
              "30代の会社員男性で、最近の健康診断で脂質異常症と診断された。仕事が忙しく、食生活が不規則になりがち。",
            needs: {
              explicit: "脂質異常症の改善方法と食事管理",
              implicit: "将来の病気リスクを回避し、長く健康でいたい",
            },
          },
          {
            id: 3,
            description:
              "50代の自営業者で、長年の生活習慣により複数の健康問題を抱えている。本格的な健康改善に取り組みたいと考えている。",
            needs: {
              explicit: "包括的な健康改善プログラム",
              implicit: "専門的なサポートと継続的なモチベーション維持",
            },
          },
        ],
      };

    case "businessidea":
      return {
        business_ideas: [
          {
            id: 1,
            idea_text:
              "AI搭載の個人健康管理アプリ - 食事写真から自動栄養分析し、脂質異常症改善のための個別最適化された食事プランを提案",
            osborn_hint:
              "既存の健康アプリと栄養分析技術を組み合わせて、より精密で個人化されたサービスを提供",
          },
          {
            id: 2,
            idea_text:
              "健康料理宅配サービス - 脂質異常症や生活習慣病予防に特化した、管理栄養士監修の冷凍食品を定期配送",
            osborn_hint:
              "忙しい現代人のニーズと健康志向を組み合わせた、手軽で継続しやすいソリューション",
          },
          {
            id: 3,
            idea_text:
              "オンライン健康コーチングプラットフォーム - 管理栄養士や健康運動指導士による1対1の継続的なサポート",
            osborn_hint:
              "デジタル技術を活用して専門家のサービスをより身近で手頃な価格で提供",
          },
        ],
      };

    case "productname":
      return {
        product_names: [
          {
            id: 1,
            name: "HealthWise",
            reason:
              "健康(Health)と賢い判断(Wise)を組み合わせ、賢明な健康管理をサポートするという意味を込めました",
            pros: "覚えやすく、国際的に通用する名前。健康管理の「賢さ」を表現",
            cons: "既存のヘルスケア系サービスと類似する可能性がある",
          },
          {
            id: 2,
            name: "NutriGuide",
            reason:
              "栄養(Nutrition)のガイド(Guide)として、食事管理をサポートするサービスであることを表現",
            pros: "サービス内容が直感的に分かりやすい、専門性を感じさせる",
            cons: "栄養管理に特化している印象で、総合的な健康管理のイメージが弱い",
          },
          {
            id: 3,
            name: "VitalCare",
            reason:
              "生命力(Vital)とケア(Care)を組み合わせ、生き生きとした健康生活をサポートする意味",
            pros: "ポジティブで力強い印象、幅広い健康サービスに対応可能",
            cons: "医療機関や介護サービスと混同される可能性",
          },
        ],
      };

    case "canvas":
      return {
        problem: [
          "脂質異常症などの生活習慣病が増加している",
          "忙しい現代人は健康管理に時間を割けない",
          "健康情報が多すぎて何から始めればいいか分からない",
        ],
        solution: [
          "AI搭載の個人最適化された健康管理アプリ",
          "食事写真から自動栄養分析機能",
          "専門家による継続的なサポート体制",
        ],
        keyMetrics: [
          "月間アクティブユーザー数",
          "健康改善達成率",
          "継続利用率（6ヶ月以上）",
        ],
        uniqueValueProposition: [
          "写真一枚で栄養分析ができる手軽さ",
          "個人の健康状態に最適化されたアドバイス",
          "医療従事者監修による信頼性の高い情報",
        ],
        unfairAdvantage: [
          "独自の画像認識AI技術",
          "医療機関との連携ネットワーク",
          "長年蓄積された健康データベース",
        ],
        channels: [
          "スマートフォンアプリストア",
          "医療機関での紹介",
          "SNSマーケティング",
        ],
        customerSegments: [
          "30-50代の健康意識の高い働く人々",
          "生活習慣病の予防・改善が必要な人",
          "家族の健康管理を担う主婦・主夫",
        ],
        costStructure: [
          "AI開発・維持費用",
          "専門家への報酬",
          "アプリ開発・運営費用",
        ],
        revenueStreams: [
          "月額サブスクリプション料金",
          "プレミアム機能の課金",
          "企業向け健康管理サービス",
        ],
      };

    default:
      return { error: "Unknown task" };
  }
}

async function callDifyAPI(
  inputs: Record<string, any>,
  query?: string,
  task?: string
): Promise<any> {
  // デモモードの場合はモックデータを返す
  const isDemoMode =
    !DIFY_API_KEY || DIFY_API_KEY === "" || DIFY_API_KEY === "demo";

  if (isDemoMode) {
    console.log("🎭 Demo mode: Using mock data");
    // リアルなAPI呼び出しをシミュレート
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );
    return generateMockData(task || "unknown", inputs);
  }

  if (!DIFY_API_KEY || !DIFY_API_URL) {
    throw new Error("Dify API configuration is missing");
  }

  console.log(`🚀 Calling Dify API for task: ${task}`, { inputs, query });

  // Difyチャットアプリケーション用のAPIエンドポイント
  const apiEndpoint = `${DIFY_API_URL}/chat-messages`;

  const requestBody = {
    inputs: {
      ...inputs,
      task: task // Difyワークフローで必要とされるtaskパラメータを追加
    },
    query: query || `Please perform task: ${task}`,
    response_mode: "blocking",
    user: "ai-lean-canvas-user", // 必須のuserパラメータ
    conversation_id: "", // 会話を継続しない場合は空文字
  };

  try {
    console.log(`📤 Request to ${apiEndpoint}:`, {
      url: apiEndpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY?.substring(0, 10)}...` // セキュリティのため一部のみ表示
      },
      body: requestBody
    });

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(120000), // 120秒のタイムアウト
    });

    const responseText = await response.text();
    console.log(`📥 Response from ${apiEndpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });

    if (!response.ok) {
      console.error("Dify API error response:", {
        status: response.status,
        statusText: response.statusText,
        errorText: responseText,
        requestBody,
      });
      throw new Error(`Dify API error: ${response.status} ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Failed to parse JSON response: ${responseText}`);
    }

    if (result.status === "failed") {
      throw new Error(`Dify workflow failed: ${result.error || "Unknown error"}`);
    }

    console.log(`✅ Successful response from ${apiEndpoint}:`, result);

    // Difyチャットアプリからのレスポンス処理
    if (result.answer) {
      try {
        // answerがJSON文字列の場合、パースして返す
        const parsedAnswer = JSON.parse(result.answer);
        return parsedAnswer;
      } catch (e) {
        // JSONでない場合はテキストとして処理
        console.warn("Failed to parse Dify answer as JSON:", result.answer);
        return { text: result.answer };
      }
    }

    // 直接JSONオブジェクトが返される場合
    return result;

  } catch (error) {
    console.error("Error calling Dify API:", error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Dify API request timed out. Please try again later.');
    }
    
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task } = body;

    let result: any;

    switch (task) {
      case "persona": {
        const { keyword } = body as DifyPersonaRequest;
        if (!keyword?.trim()) {
          return NextResponse.json(
            {
              success: false,
              error: { message: "キーワードが必要です" },
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        result = await callDifyAPI(
          {
            keyword: keyword.trim(),
            // Difyワークフローの開始ノードで定義された変数名に合わせる
          },
          `キーワード「${keyword.trim()}」に基づいて10個のペルソナを生成してください。JSON形式で {personas: [...]} として返してください。`,
          "persona"
        );

        console.log("Persona generation result:", result);

        // Difyから返されるデータの様々な形式に対応
        let personas = [];
        
        if (result.personas) {
          personas = result.personas;
        } else if (result.text && typeof result.text === 'string') {
          // テキストレスポンスの場合はエラーとして扱う
          throw new Error(`Difyからテキストレスポンスが返されました。JSON形式での応答が必要です: ${result.text}`);
        } else if (Array.isArray(result)) {
          // 配列が直接返された場合
          personas = result;
        } else {
          // その他の形式を試行
          personas = result.data || result.output || [];
        }

        // ペルソナデータの正規化
        if (Array.isArray(personas)) {
          personas = personas.map((persona: any, index: number) => ({
            id: persona.id || index + 1,
            description: persona.description || persona.text || String(persona),
            needs: {
              explicit: persona.needs?.explicit || persona.explicit_needs || persona.explicit || '',
              implicit: persona.needs?.implicit || persona.implicit_needs || persona.implicit || ''
            }
          }));
        }

        if (!Array.isArray(personas) || personas.length === 0) {
          console.error("Failed to extract personas from result:", result);
          throw new Error(
            `Difyからペルソナデータが返されませんでした。Difyワークフローが正しいJSON形式（{personas: [...]}）で応答するよう設定してください。実際の応答: ${JSON.stringify(result)}`
          );
        }

        const personaResponse: DifyPersonaResponse = {
          personas,
        };

        return NextResponse.json({
          success: true,
          data: personaResponse,
        } as ApiResponse<DifyPersonaResponse>);
      }

      case "businessidea": {
        const { persona } = body as DifyBusinessIdeaRequest;
        if (!persona) {
          return NextResponse.json(
            {
              success: false,
              error: { message: "ペルソナが必要です" },
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        result = await callDifyAPI(
          {
            persona_data: JSON.stringify(persona),
          },
          `次のペルソナに基づいて10個のビジネスアイデアを生成してください: ${JSON.stringify(persona)}。JSON形式で {business_ideas: [...]} として返してください。`,
          "businessidea"
        );

        // ビジネスアイデアデータの正規化
        let businessIdeas = [];
        
        if (result.business_ideas) {
          businessIdeas = result.business_ideas;
        } else if (result.ideas) {
          businessIdeas = result.ideas;
        } else if (Array.isArray(result)) {
          businessIdeas = result;
        } else {
          businessIdeas = result.data || result.output || [];
        }

        // データの正規化
        if (Array.isArray(businessIdeas)) {
          businessIdeas = businessIdeas.map((idea: any, index: number) => ({
            id: idea.id || index + 1,
            idea_text: idea.idea_text || idea.idea || idea.text || String(idea),
            osborn_hint: idea.osborn_hint || idea.hint || idea.reasoning || ''
          }));
        }

        if (!Array.isArray(businessIdeas) || businessIdeas.length === 0) {
          console.error("Failed to extract business ideas from result:", result);
          throw new Error(
            `Difyからビジネスアイデアデータが返されませんでした。Difyワークフローが正しいJSON形式（{business_ideas: [...]}）で応答するよう設定してください。実際の応答: ${JSON.stringify(result)}`
          );
        }

        const businessIdeaResponse: DifyBusinessIdeaResponse = {
          business_ideas: businessIdeas,
        };

        return NextResponse.json({
          success: true,
          data: businessIdeaResponse,
        } as ApiResponse<DifyBusinessIdeaResponse>);
      }

      case "productname": {
        const { persona, business_idea, product_details } =
          body as DifyProductNameRequest;
        if (!persona || !business_idea || !product_details) {
          return NextResponse.json(
            {
              success: false,
              error: { message: "必要な情報が不足しています" },
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        result = await callDifyAPI(
          {
            persona_data: JSON.stringify(persona),
            business_idea_data: JSON.stringify(business_idea),
            product_details_data: JSON.stringify(product_details),
          },
          `以下の情報に基づいて10個のプロダクト名を生成してください。ペルソナ: ${JSON.stringify(persona)}、ビジネスアイデア: ${JSON.stringify(business_idea)}、商品詳細: ${JSON.stringify(product_details)}。JSON形式で {product_names: [...]} として返してください。`,
          "productname"
        );

        // プロダクト名データの正規化
        let productNames = [];
        
        if (result.product_names) {
          productNames = result.product_names;
        } else if (result.names) {
          productNames = result.names;
        } else if (Array.isArray(result)) {
          productNames = result;
        } else {
          productNames = result.data || result.output || [];
        }

        // データの正規化
        if (Array.isArray(productNames)) {
          productNames = productNames.map((name: any, index: number) => ({
            id: name.id || index + 1,
            name: name.name || name.product_name || String(name),
            reason: name.reason || name.reasoning || name.explanation || '',
            pros: name.pros || name.advantages || name.benefits || '',
            cons: name.cons || name.disadvantages || name.drawbacks || ''
          }));
        }

        if (!Array.isArray(productNames) || productNames.length === 0) {
          console.error("Failed to extract product names from result:", result);
          throw new Error(
            `Difyからプロダクト名データが返されませんでした。Difyワークフローが正しいJSON形式（{product_names: [...]}）で応答するよう設定してください。実際の応答: ${JSON.stringify(result)}`
          );
        }

        const productNameResponse: DifyProductNameResponse = {
          product_names: productNames,
        };

        return NextResponse.json({
          success: true,
          data: productNameResponse,
        } as ApiResponse<DifyProductNameResponse>);
      }

      case "canvas": {
        const { persona, business_idea, product_name } =
          body as DifyCanvasRequest;
        if (!persona || !business_idea || !product_name) {
          return NextResponse.json(
            {
              success: false,
              error: { message: "必要な情報が不足しています" },
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        result = await callDifyAPI(
          {
            persona_data: JSON.stringify(persona),
            business_idea_data: JSON.stringify(business_idea),
            product_name_data: JSON.stringify(product_name),
          },
          `以下の情報に基づいてリーンキャンバスを生成してください。ペルソナ: ${JSON.stringify(persona)}、ビジネスアイデア: ${JSON.stringify(business_idea)}、プロダクト名: ${JSON.stringify(product_name)}。JSON形式で各要素を配列として返してください。例: {problem: [...], solution: [...], channels: [...], ...}`,
          "canvas"
        );

        // リーンキャンバスデータの正規化
        const canvasData: LeanCanvasData = {
          problem: Array.isArray(result.problem) ? result.problem : 
                  Array.isArray(result.problems) ? result.problems : [],
          solution: Array.isArray(result.solution) ? result.solution : 
                   Array.isArray(result.solutions) ? result.solutions : [],
          keyMetrics: Array.isArray(result.key_metrics) ? result.key_metrics : 
                     Array.isArray(result.keyMetrics) ? result.keyMetrics : 
                     Array.isArray(result.metrics) ? result.metrics : [],
          uniqueValueProposition: Array.isArray(result.unique_value_proposition) ? result.unique_value_proposition :
                                 Array.isArray(result.uniqueValueProposition) ? result.uniqueValueProposition :
                                 Array.isArray(result.value_proposition) ? result.value_proposition : [],
          unfairAdvantage: Array.isArray(result.unfair_advantage) ? result.unfair_advantage :
                          Array.isArray(result.unfairAdvantage) ? result.unfairAdvantage :
                          Array.isArray(result.advantage) ? result.advantage : [],
          channels: Array.isArray(result.channels) ? result.channels : [],
          customerSegments: Array.isArray(result.customer_segments) ? result.customer_segments :
                           Array.isArray(result.customerSegments) ? result.customerSegments :
                           Array.isArray(result.segments) ? result.segments : [],
          costStructure: Array.isArray(result.cost_structure) ? result.cost_structure :
                        Array.isArray(result.costStructure) ? result.costStructure :
                        Array.isArray(result.costs) ? result.costs : [],
          revenueStreams: Array.isArray(result.revenue_streams) ? result.revenue_streams :
                         Array.isArray(result.revenueStreams) ? result.revenueStreams :
                         Array.isArray(result.revenue) ? result.revenue : [],
        };

        // 少なくとも一つのフィールドにデータがあることを確認
        const hasData = Object.values(canvasData).some(arr => Array.isArray(arr) && arr.length > 0);
        if (!hasData) {
          console.error("Failed to extract canvas data from result:", result);
          throw new Error(
            `Difyからリーンキャンバスデータが返されませんでした。Difyワークフローが正しいJSON形式で応答するよう設定してください。実際の応答: ${JSON.stringify(result)}`
          );
        }

        return NextResponse.json({
          success: true,
          data: canvasData,
        } as ApiResponse<LeanCanvasData>);
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: { message: `未知のタスク: ${task}` },
          } as ApiResponse<never>,
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Dify API Error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    let errorMessage = "サーバーエラーが発生しました";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("タイムアウト")) {
        errorMessage = error.message;
        statusCode = 408;
      } else if (error.message.includes("Dify API error: 400")) {
        errorMessage =
          "Difyワークフローの設定に問題があります。管理者に連絡してください。";
        statusCode = 400;
      } else if (error.message.includes("Dify API error: 401")) {
        errorMessage =
          "Dify APIの認証に失敗しました。API設定を確認してください。";
        statusCode = 401;
      } else if (error.message.includes("Dify API error: 404")) {
        errorMessage =
          "Difyワークフローが見つかりません。設定を確認してください。";
        statusCode = 404;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: errorMessage,
        },
      } as ApiResponse<never>,
      { status: statusCode }
    );
  }
}
