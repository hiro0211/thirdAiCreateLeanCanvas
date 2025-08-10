// リーンキャンバスの構造定義
import { LeanCanvasData } from "../types";

// キャンバスブロックの型定義
export interface CanvasBlockConfig {
  id: number;
  titleKey: string;
  dataKey: keyof LeanCanvasData;
  position: {
    section: "top" | "bottom";
    row?: number;
    col: number;
    span?: "full" | "half-top" | "half-bottom";
  };
}

// リーンキャンバスブロック構造定義
export const LEAN_CANVAS_BLOCKS: CanvasBlockConfig[] = [
  {
    id: 1,
    titleKey: "BLOCK_TITLES.PROBLEM",
    dataKey: "problem",
    position: { section: "top", col: 1 },
  },
  {
    id: 2,
    titleKey: "BLOCK_TITLES.SOLUTION",
    dataKey: "solution",
    position: { section: "top", col: 2, span: "half-top" },
  },
  {
    id: 3,
    titleKey: "BLOCK_TITLES.UNIQUE_VALUE_PROPOSITION",
    dataKey: "uniqueValueProposition",
    position: { section: "top", col: 3 },
  },
  {
    id: 4,
    titleKey: "BLOCK_TITLES.UNFAIR_ADVANTAGE",
    dataKey: "unfairAdvantage",
    position: { section: "top", col: 4, span: "half-top" },
  },
  {
    id: 5,
    titleKey: "BLOCK_TITLES.CUSTOMER_SEGMENTS",
    dataKey: "customerSegments",
    position: { section: "top", col: 5 },
  },
  {
    id: 6,
    titleKey: "BLOCK_TITLES.KEY_METRICS",
    dataKey: "keyMetrics",
    position: { section: "top", col: 2, span: "half-bottom" },
  },
  {
    id: 7,
    titleKey: "BLOCK_TITLES.CHANNELS",
    dataKey: "channels",
    position: { section: "top", col: 4, span: "half-bottom" },
  },
  {
    id: 8,
    titleKey: "BLOCK_TITLES.COST_STRUCTURE",
    dataKey: "costStructure",
    position: { section: "bottom", col: 1 },
  },
  {
    id: 9,
    titleKey: "BLOCK_TITLES.REVENUE_STREAMS",
    dataKey: "revenueStreams",
    position: { section: "bottom", col: 2 },
  },
];

// レイアウト構造定義
export const CANVAS_LAYOUT = {
  TOP_SECTION: {
    GRID_COLS: 5,
    MIN_HEIGHT_KEY: "TOP_SECTION_MIN_HEIGHT",
  },
  BOTTOM_SECTION: {
    GRID_COLS: 2,
    MIN_HEIGHT_KEY: "BOTTOM_SECTION_MIN_HEIGHT",
  },
  CONTAINER: {
    MIN_HEIGHT_KEY: "CANVAS_MIN_HEIGHT",
    PADDING_KEY: "CARD_PADDING",
    GAP_KEY: "GAP_SIZE",
  },
} as const;

// ブロック表示順序の定義
export const CANVAS_DISPLAY_ORDER = {
  TOP_SECTION: [
    { col: 1, blocks: [1] },
    { col: 2, blocks: [2, 6] },
    { col: 3, blocks: [3] },
    { col: 4, blocks: [4, 7] },
    { col: 5, blocks: [5] },
  ],
  BOTTOM_SECTION: [
    { col: 1, blocks: [8] },
    { col: 2, blocks: [9] },
  ],
} as const;

// データアクセス用ヘルパー関数
export const getBlockByNumber = (
  blockNumber: number
): CanvasBlockConfig | undefined => {
  return LEAN_CANVAS_BLOCKS.find((block) => block.id === blockNumber);
};

export const getBlockData = (
  leanCanvasData: LeanCanvasData,
  dataKey: keyof LeanCanvasData
): string[] => {
  return leanCanvasData[dataKey] || [];
};

export const getBlocksForColumn = (
  section: "top" | "bottom",
  column: number
): number[] => {
  const sectionData =
    section === "top"
      ? CANVAS_DISPLAY_ORDER.TOP_SECTION
      : CANVAS_DISPLAY_ORDER.BOTTOM_SECTION;
  const columnData = sectionData.find((col) => col.col === column);
  return [...(columnData?.blocks || [])];
};
