// CSS クラス定数の定義
// Tailwindクラスの組み合わせを定数化して保守性を向上

// コンテナレイアウト
export const CONTAINER_CLASSES = {
  MAIN_CONTAINER: "max-w-6xl mx-auto px-2 sm:px-4",
  HEADER_CONTAINER: "text-center mb-8 sm:mb-10",
  CANVAS_CONTAINER:
    "bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-2xl mb-6 sm:mb-8 backdrop-blur-sm",
  BUTTON_CONTAINER:
    "flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 px-2",
  SUCCESS_CONTAINER:
    "text-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-emerald-200 mx-2 sm:mx-0 shadow-xl backdrop-blur-sm",
} as const;

// ヘッダー要素
export const HEADER_CLASSES = {
  ICON_BACKGROUND:
    "mx-auto mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white",
  ICON: "w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg",
  TITLE:
    "text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-sm",
  PRODUCT_NAME_CONTAINER:
    "text-lg sm:text-xl font-bold text-gray-700 mb-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl mx-2 sm:mx-0 shadow-lg backdrop-blur-sm",
  PRODUCT_NAME_LABEL: "text-purple-600",
  PRODUCT_NAME_VALUE: "text-indigo-700",
} as const;

// キャンバスブロック - 可読性重視のデザイン
export const CANVAS_BLOCK_CLASSES = {
  CONTAINER:
    "bg-gradient-to-br border-2 p-4 flex flex-col rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
  HEADER: "flex items-center mb-4 flex-shrink-0",
  NUMBER_BADGE:
    "w-8 h-8 text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 shadow-sm",
  TITLE_CONTAINER: "flex-1",
  TITLE: "font-semibold text-base text-gray-900 dark:text-gray-100 mb-1",
  ICON: "text-lg opacity-70",
  CONTENT_CONTAINER: "flex-1 overflow-y-auto space-y-3",
  CONTENT_ITEM:
    "bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200",
  CONTENT_TEXT: "text-sm text-gray-800 dark:text-gray-200 leading-relaxed",
} as const;

// レイアウトグリッド
export const GRID_CLASSES = {
  TOP_SECTION: "grid grid-cols-5 gap-3 mb-3",
  BOTTOM_SECTION: "grid grid-cols-2 gap-3",
  SPLIT_COLUMN: "flex flex-col gap-3",
} as const;

// ボタンスタイル
export const BUTTON_CLASSES = {
  PDF_SAVE:
    "flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  SHARE:
    "flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  CREATE_NEW:
    "flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0",
  ICON: "w-5 h-5",
} as const;

// 成功メッセージ
export const SUCCESS_CLASSES = {
  EMOJI_CONTAINER: "text-4xl sm:text-5xl mb-4",
  TITLE:
    "text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4",
  MESSAGE:
    "text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto",
  HIGHLIGHT_PURPLE: "font-semibold text-purple-600",
  HIGHLIGHT_BLUE: "font-semibold text-blue-600",
} as const;

// 動的クラス生成ヘルパー
export const getDynamicClasses = {
  canvasBlock: (isHalfHeight: boolean, className: string = "") =>
    `${CANVAS_BLOCK_CLASSES.CONTAINER} ${isHalfHeight ? "min-h-[180px]" : "h-full"} ${className}`,

  topSection: (minHeight: number) =>
    `${GRID_CLASSES.TOP_SECTION} min-h-[${minHeight}px]`,

  bottomSection: (minHeight: number) =>
    `${GRID_CLASSES.BOTTOM_SECTION} min-h-[${minHeight}px]`,

  canvasContainer: (minHeight: number, padding: number) =>
    `${CONTAINER_CLASSES.CANVAS_CONTAINER} min-h-[${minHeight}px] p-${padding}`,

  successContainer: (paddingY: number, paddingX: number) =>
    `${CONTAINER_CLASSES.SUCCESS_CONTAINER} p-${paddingY} sm:p-${paddingX}`,
} as const;
