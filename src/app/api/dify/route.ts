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

  // 実際のDify APIを呼び出す（現在は設定が不完全なのでエラーになる）
  throw new Error(
    "Dify APIの設定が完了していません。デモモードで動作を確認してください。.env.localのDIFY_API_KEYを空にするか'demo'に設定してください。"
  );
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
          },
          `Generate 10 personas for the keyword: ${keyword.trim()}`,
          "persona"
        );

        console.log("Persona generation result:", result);

        const personas = result.personas || result.text?.personas || [];
        if (!Array.isArray(personas) || personas.length === 0) {
          throw new Error(
            "Difyからペルソナデータが返されませんでした。ワークフローの設定を確認してください。"
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
            persona: JSON.stringify(persona),
          },
          `Generate 10 business ideas for this persona: ${JSON.stringify(persona)}`,
          "businessidea"
        );

        const businessIdeaResponse: DifyBusinessIdeaResponse = {
          business_ideas: result.business_ideas || [],
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
            persona: JSON.stringify(persona),
            business_idea: JSON.stringify(business_idea),
            product_details: JSON.stringify(product_details),
          },
          `Generate 10 product names based on persona: ${JSON.stringify(persona)}, business idea: ${JSON.stringify(business_idea)}, and product details: ${JSON.stringify(product_details)}`,
          "productname"
        );

        const productNameResponse: DifyProductNameResponse = {
          product_names: result.product_names || [],
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
            persona: JSON.stringify(persona),
            business_idea: JSON.stringify(business_idea),
            product_name: JSON.stringify(product_name),
          },
          `Generate a lean canvas based on persona: ${JSON.stringify(persona)}, business idea: ${JSON.stringify(business_idea)}, and product name: ${JSON.stringify(product_name)}`,
          "canvas"
        );

        const canvasData: LeanCanvasData = {
          problem: result.problem || [],
          solution: result.solution || [],
          keyMetrics: result.key_metrics || result.keyMetrics || [],
          uniqueValueProposition:
            result.unique_value_proposition ||
            result.uniqueValueProposition ||
            [],
          unfairAdvantage:
            result.unfair_advantage || result.unfairAdvantage || [],
          channels: result.channels || [],
          customerSegments:
            result.customer_segments || result.customerSegments || [],
          costStructure: result.cost_structure || result.costStructure || [],
          revenueStreams: result.revenue_streams || result.revenueStreams || [],
        };

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
