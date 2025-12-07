// 統合されたプリセット設定
// 全ワークフローコンポーネントで共通使用

// アニメーション設定
export const ANIMATION_PRESETS = {
  // ヘッダーアニメーション
  HEADER: {
    ICON_ROTATE: {
      animate: { rotate: [0, 360] },
      transition: { duration: 20, repeat: Infinity, ease: "linear" as const }
    },
    ICON_SCALE: {
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
    },
    ICON_BOUNCE: {
      animate: { 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    },
    TITLE: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.1 }
    },
    DESCRIPTION: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2 }
    }
  },

  // カードアニメーション
  CARD: {
    ENTER: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { 
        duration: 0.4, 
        type: "spring", 
        stiffness: 100 
      }
    },
    HOVER: {
      y: -8,
      transition: { duration: 0.2 }
    },
    TAP: { scale: 0.98 },
    SELECTION_INDICATOR: {
      initial: { scale: 0, rotate: -180 },
      animate: { scale: 1, rotate: 0 },
      exit: { scale: 0, rotate: 180 },
      transition: { type: "spring", stiffness: 200 }
    }
  },

  // ボタンアニメーション
  BUTTON: {
    HOVER: { scale: 1.02 },
    TAP: { scale: 0.98 },
    LARGE_HOVER: { scale: 1.03 },
    LARGE_TAP: { scale: 0.97 }
  },

  // コンテナアニメーション
  CONTAINER: {
    FADE_IN: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
    SLIDE_UP: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    }
  }
} as const;

// スタイルプリセット
export const STYLE_PRESETS = {
  // グラデーション
  GRADIENTS: {
    PRIMARY: "from-indigo-500 via-purple-500 to-pink-500",
    SECONDARY: "from-blue-500 to-cyan-500",
    ACCENT: "from-purple-600 via-blue-600 to-indigo-600",
    SUCCESS: "from-green-500 to-emerald-500",
    WARNING: "from-yellow-500 to-orange-500",
    ERROR: "from-red-500 to-pink-500"
  },

  // カードスタイル
  CARD: {
    BASE: "border-2 rounded-xl transition-all duration-300 hover:shadow-xl",
    SELECTED: "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5",
    UNSELECTED: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
    BACKGROUND_GLOW: "bg-gradient-to-br from-primary/10 to-accent/10"
  },

  // ボタンスタイル
  BUTTON: {
    PRIMARY: "bg-primary hover:bg-primary/90",
    GRADIENT: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
    OUTLINE: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    NAVIGATION: "px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
  },

  // テキストスタイル
  TEXT: {
    GRADIENT_TITLE: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
    DESCRIPTION: "text-gray-600 dark:text-gray-300",
    MUTED: "text-gray-500 dark:text-gray-400",
    BOLD: "font-bold text-gray-800 dark:text-gray-100"
  },

  // サイズ設定
  SIZES: {
    ICON: {
      SM: { container: "w-12 h-12", icon: "w-6 h-6" },
      MD: { container: "w-16 h-16", icon: "w-8 h-8" },
      LG: { container: "w-20 h-20", icon: "w-10 h-10" }
    },
    SPACING: {
      CARD_GAP: "gap-6",
      SECTION_MARGIN: "mb-8",
      LARGE_SECTION_MARGIN: "mb-10"
    }
  }
} as const;

// レイアウトプリセット
export const LAYOUT_PRESETS = {
  // グリッドレイアウト
  GRID: {
    RESPONSIVE_CARDS: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
    TWO_COLUMN: "grid grid-cols-1 md:grid-cols-2 gap-6",
    SINGLE_COLUMN: "grid grid-cols-1 gap-6"
  },

  // コンテナ
  CONTAINER: {
    MAIN: "max-w-7xl mx-auto px-4",
    CENTERED: "max-w-2xl mx-auto",
    FULL_WIDTH: "w-full"
  },

  // ナビゲーション
  NAVIGATION: {
    BETWEEN: "flex justify-between items-center mt-8",
    CENTER: "flex justify-center items-center mt-8",
    END: "flex justify-end items-center mt-8"
  }
} as const;

// 共通メッセージ
export const COMMON_MESSAGES = {
  BUTTONS: {
    NEXT: "次へ",
    PREVIOUS: "戻る",
    CONTINUE: "続ける", 
    LOADING: "処理中...",
    GENERATING: "生成中...",
    RETRY: "再試行",
    RESET: "リセット"
  },
  
  STATES: {
    LOADING: "読み込み中...",
    ERROR: "エラーが発生しました",
    SUCCESS: "成功しました",
    NO_DATA: "データがありません"
  },

  TOOLTIPS: {
    SELECT: "選択してください",
    REQUIRED: "必須項目です",
    OPTIONAL: "任意項目です"
  }
} as const;

// ユーティリティ関数
export const createAnimationWithDelay = (baseAnimation: any, delay: number) => ({
  ...baseAnimation,
  transition: {
    ...baseAnimation.transition,
    delay
  }
});

export const createStaggeredAnimation = (baseAnimation: any, index: number, staggerDelay = 0.1) => 
  createAnimationWithDelay(baseAnimation, index * staggerDelay);

export const combineClassNames = (...classes: (string | undefined)[]) => 
  classes.filter(Boolean).join(' ');

export const getGradientClass = (gradient: keyof typeof STYLE_PRESETS.GRADIENTS) => 
  `bg-gradient-to-br ${STYLE_PRESETS.GRADIENTS[gradient]}`;

export const getTextGradientClass = (gradient: keyof typeof STYLE_PRESETS.GRADIENTS) => 
  `bg-gradient-to-r ${STYLE_PRESETS.GRADIENTS[gradient]} bg-clip-text text-transparent`;