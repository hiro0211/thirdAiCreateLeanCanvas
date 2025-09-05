export class MockDataGenerator {
  static generate(task: string, inputs: Record<string, any>): any {
    const generators = {
      persona: () => MockDataTemplates.PERSONA_DATA,
      businessidea: () => MockDataTemplates.BUSINESS_IDEA_DATA,
      productname: () => MockDataTemplates.PRODUCT_NAME_DATA,
      canvas: () => MockDataTemplates.CANVAS_DATA,
    };

    const generator = generators[task as keyof typeof generators];
    return generator ? generator() : { error: "Unknown task" };
  }
}

class MockDataTemplates {
  static readonly PERSONA_DATA = {
    personas: [
      {
        id: 1,
        description:
          "40代の働く女性で、健康意識が高く、家族の健康管理も担当している。忙しい日常の中で効率的な健康管理方法を求めている。",
        explicit_needs: "簡単で継続しやすい健康管理ツール",
        implicit_needs: "家族全体の健康状態を把握し、安心感を得たい",
      },
      {
        id: 2,
        description:
          "30代の会社員男性で、最近の健康診断で脂質異常症と診断された。仕事が忙しく、食生活が不規則になりがち。",
        explicit_needs: "脂質異常症の改善方法と食事管理",
        implicit_needs: "将来の病気リスクを回避し、長く健康でいたい",
      },
      {
        id: 3,
        description:
          "50代の自営業者で、長年の生活習慣により複数の健康問題を抱えている。本格的な健康改善に取り組みたいと考えている。",
        explicit_needs: "包括的な健康改善プログラム",
        implicit_needs: "専門的なサポートと継続的なモチベーション維持",
      },
      {
        id: 4,
        description:
          "20代の大学生で、将来の健康リスクを予防したいと考えている。情報収集が得意で、最新の健康トレンドに敏感。",
        explicit_needs: "予防的な健康管理の知識と方法",
        implicit_needs: "同世代との差別化と将来への投資意識",
      },
      {
        id: 5,
        description:
          "60代の退職者で、時間に余裕があるため健康管理に本格的に取り組みたい。医療費を抑えながら健康寿命を延ばしたい。",
        explicit_needs: "年齢に適した健康管理プログラム",
        implicit_needs: "医療費削減と自立した生活の維持",
      },
      {
        id: 6,
        description:
          "35歳の子育て中の母親で、自分の健康管理が後回しになりがち。子供の健康も含めて家族全体の健康を効率的に管理したい。",
        explicit_needs: "家族全体の健康管理ソリューション",
        implicit_needs: "自分自身の健康も大切にしたいという罪悪感の解消",
      },
      {
        id: 7,
        description:
          "45歳の営業職で、外食が多く運動不足。ストレスも多い環境で、手軽に健康改善できる方法を探している。",
        explicit_needs: "忙しい仕事の合間にできる健康管理",
        implicit_needs: "仕事のパフォーマンス向上と長期的なキャリア維持",
      },
      {
        id: 8,
        description:
          "28歳のフリーランスデザイナー。座り仕事が多く、不規則な生活リズム。健康に投資することで仕事の質を向上させたい。",
        explicit_needs: "デスクワーカー向けの健康ソリューション",
        implicit_needs: "創作活動のパフォーマンス向上と持続可能な働き方",
      },
      {
        id: 9,
        description:
          "52歳の管理職で、部下のマネジメントストレスと長時間労働で健康状態が悪化。リーダーシップを発揮するためにも健康改善が必要。",
        explicit_needs: "ストレス管理と効率的な健康改善",
        implicit_needs: "チームのお手本となる健康的なライフスタイル",
      },
      {
        id: 10,
        description:
          "38歳のシングルマザーで、時間とお金に制約がある中で自分と子供の健康を守りたい。コストパフォーマンスの高いソリューションを求めている。",
        explicit_needs: "低コストで効果的な健康管理方法",
        implicit_needs: "子供の将来のためにも自分が健康でいたい",
      },
    ],
  };

  static readonly BUSINESS_IDEA_DATA = {
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
      {
        id: 4,
        idea_text:
          "ウェアラブルデバイス連携健康管理システム - 心拍数、歩数、睡眠データを統合分析し、個人最適化されたアドバイスを提供",
        osborn_hint:
          "IoT技術とビッグデータ分析を活用した次世代ヘルスケアソリューション",
      },
      {
        id: 5,
        idea_text:
          "職場向け健康プログラム - 企業の福利厚生として提供する、従業員の健康改善とストレス軽減を目的としたサービス",
        osborn_hint:
          "B2B市場への展開で安定した収益基盤を構築し、社会全体の健康向上に貢献",
      },
      {
        id: 6,
        idea_text:
          "健康食材の定期配送サービス - 脂質異常症改善に効果的な食材を厳選し、レシピと一緒に配送",
        osborn_hint:
          "料理の手間を省きつつ、健康改善に必要な栄養素を確実に摂取できるサービス",
      },
      {
        id: 7,
        idea_text:
          "バーチャル健康診断プラットフォーム - 自宅でできる健康チェックとAIによる結果分析、医師との遠隔相談を組み合わせ",
        osborn_hint:
          "コロナ禍で需要が高まった遠隔医療のトレンドを活用した予防医療サービス",
      },
      {
        id: 8,
        idea_text:
          "健康改善ゲーミフィケーションアプリ - 健康的な行動をゲーム要素で楽しくし、継続的な健康管理をサポート",
        osborn_hint:
          "エンターテイメント要素を取り入れることで、健康管理の継続率を大幅に向上",
      },
      {
        id: 9,
        idea_text:
          "地域連携健康コミュニティ - 近隣住民との健康活動を通じて、継続的な健康改善と地域コミュニティの活性化を実現",
        osborn_hint:
          "社会的なつながりと健康改善を組み合わせた持続可能なソーシャルヘルスモデル",
      },
      {
        id: 10,
        idea_text:
          "パーソナル健康データ分析サービス - 個人の健康データを長期間追跡し、AI分析による将来の健康リスク予測と予防策を提供",
        osborn_hint:
          "予防医療の観点から、個人の健康データの価値を最大化する先進的サービス",
      },
    ],
  };

  static readonly PRODUCT_NAME_DATA = {
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
      {
        id: 4,
        name: "WellnessIQ",
        reason:
          "ウェルネス(Wellness)と知能指数(IQ)を組み合わせ、賢い健康管理を表現",
        pros: "現代的で洗練された印象、AI技術の活用を暗示",
        cons: "IQという表現が一部のユーザーにとって敷居の高さを感じさせる可能性",
      },
      {
        id: 5,
        name: "LifeBalance",
        reason:
          "人生(Life)のバランス(Balance)を意味し、健康的な生活の調和を表現",
        pros: "分かりやすく親しみやすい、ワークライフバランスとも関連づけやすい",
        cons: "健康管理以外の意味でも使われる一般的な言葉",
      },
      {
        id: 6,
        name: "SmartHealth",
        reason: "スマート(Smart)な健康管理を表現し、AI技術の活用を強調",
        pros: "技術的先進性をアピール、覚えやすいシンプルな名前",
        cons: "スマートフォンアプリとの関連性が強すぎる印象",
      },
      {
        id: 7,
        name: "HealthNavigator",
        reason:
          "健康(Health)のナビゲーター(Navigator)として、健康管理の道案内をする意味",
        pros: "信頼性とガイダンス機能を表現、専門性を感じさせる",
        cons: "やや長い名前で覚えにくい可能性",
      },
      {
        id: 8,
        name: "FitLife",
        reason:
          "フィット(Fit)な生活(Life)を表現し、健康的で活動的なライフスタイルを促進",
        pros: "シンプルで覚えやすい、アクティブな印象",
        cons: "フィットネス特化の印象が強く、食事管理の要素が伝わりにくい",
      },
      {
        id: 9,
        name: "HealthyChoice",
        reason:
          "健康的な選択(Healthy Choice)を意味し、日々の健康に関する意思決定をサポート",
        pros: "行動変容を促す積極的な印象、選択の自由度を表現",
        cons: "既存の食品ブランドと類似する可能性",
      },
      {
        id: 10,
        name: "WellTrack",
        reason:
          "ウェル(Well)な状態を追跡(Track)するという意味で、継続的な健康管理を表現",
        pros: "トラッキング機能を明確に表現、現代的な響き",
        cons: "やや技術寄りの印象で、親しみやすさに欠ける可能性",
      },
    ],
  };

  static readonly CANVAS_DATA = {
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
}
