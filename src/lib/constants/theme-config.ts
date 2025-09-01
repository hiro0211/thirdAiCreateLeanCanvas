// テーマ・カラー・グラデーション設定

// リーンキャンバスブロックのテーマ設定 - 可読性重視のモノクロマティックデザイン
export const LEAN_CANVAS_THEME = {
  // 各ブロックのカラーテーマ（1-9）- グレースケール+ブルーアクセント
  BLOCKS: {
    1: {
      name: '課題',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '🎯',
      textColor: 'text-gray-800',
    },
    2: {
      name: 'ソリューション',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '💡',
      textColor: 'text-gray-800',
    },
    3: {
      name: '独自の価値提案',
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-300',
      accent: 'bg-blue-600',
      icon: '💎',
      textColor: 'text-blue-900',
    },
    4: {
      name: '圧倒的優位性',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '🚀',
      textColor: 'text-gray-800',
    },
    5: {
      name: '顧客セグメント',
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-300',
      accent: 'bg-blue-600',
      icon: '👥',
      textColor: 'text-blue-900',
    },
    6: {
      name: '主要指標',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '📊',
      textColor: 'text-gray-800',
    },
    7: {
      name: 'チャネル',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '📢',
      textColor: 'text-gray-800',
    },
    8: {
      name: 'コスト構造',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '💰',
      textColor: 'text-gray-800',
    },
    9: {
      name: '収益の流れ',
      bg: 'from-gray-50 to-gray-100',
      border: 'border-gray-300',
      accent: 'bg-blue-600',
      icon: '💵',
      textColor: 'text-gray-800',
    },
  }
} as const;

// グラデーション設定
export const GRADIENTS = {
  // プライマリグラデーション
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  PRIMARY_CLASS: 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600',
  
  // セカンダリグラデーション  
  SECONDARY: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  SECONDARY_CLASS: 'bg-gradient-to-r from-pink-500 to-rose-500',
  
  // アクセントグラデーション
  ACCENT: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ACCENT_CLASS: 'bg-gradient-to-r from-blue-500 to-cyan-500',

  // 成功メッセージ用
  SUCCESS: 'bg-gradient-to-r from-emerald-600 to-blue-600',
  SUCCESS_BG: 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50',

  // アプリ背景用
  APP_BACKGROUND: 'bg-gradient-to-br from-gray-50 to-white',
  CARD_BACKGROUND: 'bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20',
} as const;

// カラーパレット（セマンティック）
export const COLORS = {
  // 状態カラー
  SUCCESS: {
    bg: 'bg-green-50',
    border: 'border-green-200', 
    text: 'text-green-700',
    accent: 'bg-green-500',
  },
  ERROR: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    accent: 'bg-red-500',
  },
  WARNING: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    accent: 'bg-yellow-500',
  },
  INFO: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
  },

  // ニュートラルカラー
  GRAY: {
    50: 'bg-gray-50',
    100: 'bg-gray-100',
    200: 'border-gray-200',
    300: 'border-gray-300',
    400: 'text-gray-400',
    500: 'text-gray-500',
    600: 'text-gray-600',
    700: 'text-gray-700',
    800: 'text-gray-800',
    900: 'text-gray-900',
  },

  // プライマリカラー
  PRIMARY: {
    text: 'text-primary',
    bg: 'bg-primary',
    border: 'border-primary',
    hover: 'hover:bg-primary/90',
  },
} as const;

// ボタンのテーマ設定
export const BUTTON_THEMES = {
  PRIMARY: {
    base: 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600',
    hover: 'hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700',
    text: 'text-white',
    shadow: 'shadow-lg hover:shadow-xl',
  },
  SECONDARY: {
    base: 'bg-gradient-to-r from-blue-50 to-cyan-50',
    hover: 'hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100',
    text: 'text-blue-700',
    border: 'border-2 border-blue-200 hover:border-blue-300',
    shadow: 'shadow-lg hover:shadow-xl',
  },
  SUCCESS: {
    base: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    hover: 'hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100',
    text: 'text-emerald-700',
    border: 'border-2 border-emerald-200 hover:border-emerald-300',
    shadow: 'shadow-lg hover:shadow-xl',
  },
} as const;

// ヘルパー関数: ブロック番号からテーマを取得
export const getBlockTheme = (blockNumber: number) => {
  return LEAN_CANVAS_THEME.BLOCKS[blockNumber as keyof typeof LEAN_CANVAS_THEME.BLOCKS] || LEAN_CANVAS_THEME.BLOCKS[1];
};

// ヘルパー関数: 透明度付きクラス生成
export const withOpacity = (baseClass: string, opacity: number) => {
  return `${baseClass}/${Math.round(opacity * 100)}`;
};

// ダークモード対応カラー
export const DARK_MODE_COLORS = {
  // 背景
  BACKGROUND: 'dark:bg-gray-900',
  CARD_BACKGROUND: 'dark:bg-gray-800',
  
  // テキスト
  TEXT_PRIMARY: 'dark:text-gray-100',
  TEXT_SECONDARY: 'dark:text-gray-300',
  TEXT_MUTED: 'dark:text-gray-400',
  
  // ボーダー
  BORDER: 'dark:border-gray-700',
  BORDER_LIGHT: 'dark:border-gray-600',
} as const;