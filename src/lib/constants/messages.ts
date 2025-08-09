// アプリケーション内で使用されるテキスト・メッセージ定数
// 国際化(i18n)対応のための準備

// エラーメッセージ
export const ERROR_MESSAGES = {
  // バリデーションエラー
  KEYWORD_REQUIRED: "キーワードを入力してください",
  PERSONA_REQUIRED: "ペルソナを選択してください",
  BUSINESS_IDEA_REQUIRED: "ビジネスアイデアを選択してください",
  PRODUCT_NAME_REQUIRED: "プロダクト名を選択してください",
  REQUIRED_INFO_MISSING: "必要な情報が不足しています",
  PRODUCT_DETAILS_REQUIRED: "商品詳細をすべて入力してください",

  // API エラー
  PERSONA_GENERATION_FAILED: "ペルソナ生成に失敗しました",
  BUSINESS_IDEA_GENERATION_FAILED: "ビジネスアイデア生成に失敗しました",
  PRODUCT_NAME_GENERATION_FAILED: "プロダクト名生成に失敗しました",
  LEAN_CANVAS_GENERATION_FAILED: "リーンキャンバス生成に失敗しました",

  NO_PERSONAS_GENERATED:
    "ペルソナが生成されませんでした。異なるキーワードで再試行してください。",

  // サーバーエラー
  SERVER_ERROR: "サーバーエラーが発生しました",
  API_TIMEOUT: "Dify APIリクエストがタイムアウトしました",
  API_AUTH_FAILED: "Dify APIの認証に失敗しました。API設定を確認してください。",
  API_WORKFLOW_NOT_FOUND:
    "Difyワークフローが見つかりません。設定を確認してください。",
  API_WORKFLOW_CONFIG_ERROR:
    "Difyワークフローの設定に問題があります。管理者に連絡してください。",
  UNKNOWN_TASK: "未知のタスクです",
} as const;

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  LEAN_CANVAS_COMPLETED: "🎉 リーンキャンバス完成！",
  CONGRATULATIONS: "おめでとうございます！",
  CANVAS_COMPLETION_MESSAGE:
    "AIとの協力により、あなたのビジネスアイデアが具体的なリーンキャンバスとして形になりました。",
  NEXT_STEPS_MESSAGE:
    "このキャンバスを基に、さらなるビジネス展開を検討してみてください。",
} as const;

// UI ラベル・テキスト
export const UI_LABELS = {
  // ナビゲーション
  NEXT: "次へ",
  PREVIOUS: "戻る",
  BACK: "戻る",
  CONTINUE: "続ける",
  COMPLETE: "完了",
  SKIP: "スキップ",
  RESET: "リセット",
  RETRY: "再試行",

  // アクション
  GENERATE: "生成",
  SELECT: "選択",
  INPUT: "入力",
  SUBMIT: "送信",
  SAVE: "保存",
  DOWNLOAD: "PDFで保存",
  SHARE: "共有",
  PRINT: "印刷",

  // ステップ
  START_OVER: "最初からやり直す",
  CREATE_NEW_CANVAS: "新しいキャンバスを作成",

  // 状態
  LOADING: "読み込み中...",
  GENERATING: "生成中...",
  PLEASE_WAIT: "しばらくお待ちください",
} as const;

// ワークフローステップ
export const WORKFLOW_STEPS = {
  STEP_LABELS: {
    KEYWORD: "キーワード入力",
    PERSONA_SELECTION: "ペルソナ選択",
    BUSINESS_IDEA_SELECTION: "ビジネスアイデア選択",
    DETAILS_INPUT: "詳細入力",
    PRODUCT_NAME_SELECTION: "プロダクト名選択",
    CANVAS_DISPLAY: "リーンキャンバス",
  },

  STEP_DESCRIPTIONS: {
    KEYWORD: "ビジネスアイデアに関するキーワードを入力してください",
    PERSONA_SELECTION: "最も共感できるターゲットユーザーを1つ選んでください",
    BUSINESS_IDEA_SELECTION: "最も魅力的なビジネスアイデアを選択してください",
    DETAILS_INPUT: "商品・サービスの詳細情報を入力してください",
    PRODUCT_NAME_SELECTION: "最適なプロダクト名を選択してください",
    CANVAS_DISPLAY: "完成したリーンキャンバスを確認してください",
  },

  LOADING_MESSAGES: {
    GENERATING_PERSONAS: "ペルソナを生成中...",
    GENERATING_BUSINESS_IDEAS: "ビジネスアイデアを生成中...",
    GENERATING_PRODUCT_NAMES: "プロダクト名を生成中...",
    GENERATING_LEAN_CANVAS: "リーンキャンバスを生成中...",
  },
} as const;

// リーンキャンバス関連のテキスト
export const LEAN_CANVAS = {
  // ページタイトルと基本要素
  TITLE: "リーンキャンバス",
  TITLE_WITH_EMOJI: "🎯 リーンキャンバス",
  PRODUCT_NAME_LABEL: "プロダクト名:",

  // ブロックタイトル
  BLOCK_TITLES: {
    PROBLEM: "課題",
    SOLUTION: "ソリューション",
    UNIQUE_VALUE_PROPOSITION: "独自の価値提案",
    UNFAIR_ADVANTAGE: "圧倒的優位性",
    CUSTOMER_SEGMENTS: "顧客セグメント",
    KEY_METRICS: "主要指標",
    CHANNELS: "チャネル",
    COST_STRUCTURE: "コスト構造",
    REVENUE_STREAMS: "収益の流れ",
  },

  // ブロック説明文
  BLOCK_DESCRIPTIONS: {
    PROBLEM: "解決すべき顧客の課題や問題",
    SOLUTION: "課題に対する解決策",
    UNIQUE_VALUE_PROPOSITION: "他社にはない独自の価値",
    UNFAIR_ADVANTAGE: "他社が真似できない優位性",
    CUSTOMER_SEGMENTS: "ターゲット顧客層",
    KEY_METRICS: "成功を測る重要な指標",
    CHANNELS: "顧客へのリーチ方法",
    COST_STRUCTURE: "ビジネス運営に必要なコスト",
    REVENUE_STREAMS: "収益を生む仕組み",
  },

  // アクションボタン
  ACTION_BUTTONS: {
    PDF_SAVE: "📄 PDFで保存",
    SHARE: "🚀 共有",
    CREATE_NEW: "✨ 新しいキャンバスを作成",
  },

  // 成功メッセージ
  SUCCESS: {
    EMOJI: "🎊",
    TITLE: "おめでとうございます！",
    MESSAGE_PART1: "AIとの協力により、あなたのビジネスアイデアが具体的な",
    MESSAGE_CANVAS: "リーンキャンバス",
    MESSAGE_PART2: "として形になりました。",
    MESSAGE_PART3: "このキャンバスを基に、さらなる",
    MESSAGE_BUSINESS: "ビジネス展開",
    MESSAGE_PART4: "を検討してみてください。",
  },
} as const;

// フォーム関連
export const FORM_LABELS = {
  KEYWORD_INPUT: "ビジネスキーワードを入力してください",
  KEYWORD_PLACEHOLDER: "例: サステナブル、AI、健康管理、教育...",

  PRODUCT_CATEGORY: "商品・サービスのカテゴリー",
  PRODUCT_FEATURE: "主な特徴・機能",
  BRAND_IMAGE: "ブランドイメージ",

  CATEGORY_PLACEHOLDER: "例: モバイルアプリ、Webサービス、物理的製品...",
  FEATURE_PLACEHOLDER: "例: AI搭載、エコフレンドリー、高品質...",
  BRAND_PLACEHOLDER: "例: プレミアム、親しみやすい、革新的...",
} as const;

// ツールチップ・ヒント
export const HINTS = {
  KEYWORD_TIPS: [
    "具体的な業界や技術に関するキーワードが効果的です",
    "複数のキーワードを組み合わせることも可能です",
    "新しいトレンドや社会課題に関連するキーワードもおすすめです",
  ],

  PERSONA_SELECTION_HINT: "選択したペルソナが次のステップの基盤となります",
  BUSINESS_IDEA_HINT:
    "ペルソナの課題やニーズに最も適したアイデアを選んでください",
  PRODUCT_NAME_HINT: "ブランドイメージと一致する名前を選択してください",
} as const;

// チュートリアル用メッセージ
export const TUTORIAL_MESSAGES = {
  WELCOME: {
    TITLE: "AI Lean Canvasへようこそ！",
    DESCRIPTION: "このアプリの使い方をご案内します",
    CONTENT:
      "AIを活用してステップバイステップでリーンキャンバスを作成しましょう。キーワードから始めて、最終的に完全なビジネスプランが完成します。",
  },

  STEPS: {
    KEYWORD_INPUT: {
      TITLE: "1. キーワード入力",
      DESCRIPTION: "ビジネスアイデアのキーワードを入力",
      CONTENT:
        "まず、あなたのビジネスアイデアに関連するキーワードを入力してください。例：「フィットネス」「料理」「教育」など。このキーワードを基にAIがペルソナを生成します。",
    },

    GENERATE_PERSONAS: {
      TITLE: "2. ペルソナ生成",
      DESCRIPTION: "AIが10個のペルソナを生成します",
      CONTENT:
        "「ペルソナを生成」ボタンをクリックすると、AIがあなたのキーワードに基づいて10個の異なるペルソナ（顧客像）を生成します。",
    },
  },

  NAVIGATION_HINT:
    "リセットボタンで最初からやり直したり、テーマ切り替えボタンでダークモードを楽しんだりできます。いつでもこのチュートリアルを再表示することも可能です。",
} as const;

// 国際化対応のためのヘルパー関数（将来の拡張用）
export const getMessage = (key: string, locale: string = "ja"): string => {
  // 将来的にはlocaleに基づいて適切なメッセージを返す
  // 現在は日本語のみ対応
  return key;
};
