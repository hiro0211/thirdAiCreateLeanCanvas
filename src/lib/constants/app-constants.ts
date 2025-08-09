// アプリケーション全体で使用される定数定義

// アニメーション設定
export const ANIMATION_CONFIG = {
  // 遅延設定
  STAGGER_DELAY: 0.1,
  FAST_DELAY: 0.2,
  MEDIUM_DELAY: 0.5,
  SLOW_DELAY: 1.0,
  SUCCESS_DELAY: 1.2,

  // 継続時間
  FAST_DURATION: 0.2,
  MEDIUM_DURATION: 0.3,
  SLOW_DURATION: 0.5,
  ROTATE_DURATION: 1.0,
  INFINITE_ROTATE_DURATION: 20,

  // スケール設定
  HOVER_SCALE: 1.02,
  ACTIVE_SCALE: 0.98,
  STEP_ACTIVE_SCALE: 1.1,
  BUTTON_HOVER_SCALE: 1.05,
  BUTTON_ACTIVE_SCALE: 0.95,

  // 移動距離
  HOVER_TRANSLATE_Y: -2,
  INITIAL_Y: 20,

  // イージング
  SPRING_EASE: "easeOut",
  LINEAR_EASE: "linear",
  BOUNCE_EASE: "easeInOut",
} as const;

// レイアウト設定
export const LAYOUT_CONFIG = {
  // リーンキャンバス寸法
  CANVAS_MIN_HEIGHT: 720,
  TOP_SECTION_MIN_HEIGHT: 500,
  BOTTOM_SECTION_MIN_HEIGHT: 200,
  HALF_HEIGHT_BLOCK_MIN_HEIGHT: 180,

  // バッジ・アイコンサイズ
  BADGE_SIZE: 32, // w-8 h-8
  LARGE_BADGE_SIZE: 48, // w-12 h-12
  ICON_BACKGROUND_SIZE: 64, // w-16 h-16
  LARGE_ICON_SIZE: 80, // w-20 h-20

  // パディング・マージン
  BLOCK_PADDING: 12, // p-3
  CARD_PADDING: 16, // p-4
  LARGE_PADDING: 24, // p-6

  // グリッド設定
  PERSONA_GRID_COLS: {
    BASE: 1,
    MD: 2,
    LG: 3,
  },
  CANVAS_GRID_COLS: 5,
  BOTTOM_GRID_COLS: 2,
  GAP_SIZE: 12, // gap-3
} as const;

// フォント設定
export const TYPOGRAPHY_CONFIG = {
  // フォントサイズ
  TITLE_SIZE: 'text-3xl sm:text-5xl',
  SUBTITLE_SIZE: 'text-lg sm:text-2xl',
  CARD_TITLE_SIZE: 'text-base sm:text-lg',
  BODY_SIZE: 'text-sm',
  SMALL_SIZE: 'text-xs',

  // フォント重量
  BOLD: 'font-bold',
  SEMIBOLD: 'font-semibold',
  MEDIUM: 'font-medium',
} as const;

// ブレークポイント設定
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// シャドウ設定
export const SHADOW_CONFIG = {
  SMALL: 'shadow-sm',
  MEDIUM: 'shadow-md',
  LARGE: 'shadow-lg',
  EXTRA_LARGE: 'shadow-xl',
  '2XL': 'shadow-2xl',
  
  // カスタムシャドウ（Box Shadow値）
  STEP_ACTIVE: '0 8px 25px rgba(102, 126, 234, 0.6)',
  STEP_DEFAULT: '0 4px 15px rgba(102, 126, 234, 0.4)',
} as const;

// API設定
export const API_CONFIG = {
  // タイムアウト設定（ミリ秒）
  DEFAULT_TIMEOUT: 60000,
  DEMO_MODE_MIN_DELAY: 1000,
  DEMO_MODE_MAX_DELAY: 2000,

  // エンドポイント
  DIFY_ENDPOINT: '/chat-messages',
  
  // ユーザー識別子
  DEFAULT_USER_ID: 'ai-lean-canvas-user',
  
  // HTTPステータスコード
  STATUS_CODES: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500,
  }
} as const;

// 境界線設定
export const BORDER_CONFIG = {
  THICKNESS: {
    THIN: 'border',
    MEDIUM: 'border-2',
    THICK: 'border-4',
  },
  RADIUS: {
    SMALL: 'rounded-md',
    MEDIUM: 'rounded-lg',
    LARGE: 'rounded-xl',
    EXTRA_LARGE: 'rounded-2xl',
    FULL: 'rounded-full',
  }
} as const;

// 数値制限
export const LIMITS = {
  MAX_PERSONAS: 10,
  MAX_BUSINESS_IDEAS: 10,
  MAX_PRODUCT_NAMES: 10,
  CANVAS_BLOCKS_COUNT: 9,
  WORKFLOW_STEPS_COUNT: 6,
} as const;