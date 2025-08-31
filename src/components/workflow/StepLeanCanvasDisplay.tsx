"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Award,
  Download,
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/stores/workflow-store";
import { ANIMATION_CONFIG, LAYOUT_CONFIG } from "@/lib/constants/app-constants";
import { getBlockTheme } from "@/lib/constants/theme-config";
import {
  ERROR_MESSAGES,
  UI_LABELS,
  LEAN_CANVAS,
} from "@/lib/constants/messages";
import {
  LEAN_CANVAS_BLOCKS,
  CANVAS_DISPLAY_ORDER,
  CANVAS_LAYOUT,
  getBlockByNumber,
  getBlockData,
  getBlocksForColumn,
} from "@/lib/constants/canvas-structure";
import { type LeanCanvasData } from "@/lib/types";
import {
  CONTAINER_CLASSES,
  HEADER_CLASSES,
  CANVAS_BLOCK_CLASSES,
  GRID_CLASSES,
  BUTTON_CLASSES,
  SUCCESS_CLASSES,
  getDynamicClasses,
} from "@/lib/constants/css-classes";
import { getBlockTitle } from "@/lib/utils/message-helpers";
import { ErrorDisplay } from "@/components/ui/error-display";

export function StepLeanCanvasDisplay() {
  const { leanCanvasData, selectedProductName, resetWorkflow } =
    useWorkflowStore();

  // カード式ナビゲーション用の状態
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFullCanvas, setShowFullCanvas] = useState(false);

  // 全ブロック一覧（表示順）
  const allBlocks = LEAN_CANVAS_BLOCKS.sort((a, b) => a.id - b.id);

  // スワイプ検出の設定
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!leanCanvasData) {
    return (
      <div className="text-center max-w-2xl mx-auto mt-8">
        <ErrorDisplay
          error={ERROR_MESSAGES.LEAN_CANVAS_GENERATION_FAILED}
          onRetry={() => window.location.reload()}
          retryLabel={UI_LABELS.START_OVER}
          className="mb-4"
        />
        <Button onClick={resetWorkflow} size="lg" className="mt-4">
          {UI_LABELS.START_OVER}
        </Button>
      </div>
    );
  }

  // モバイル用カードコンポーネント
  const MobileCanvasCard = ({
    number,
    title,
    content,
  }: {
    number: number;
    title: string;
    content: string[];
  }) => {
    const colors = getBlockTheme(number);

    return (
      <motion.div
        className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-xl overflow-hidden"
        style={{ borderColor: colors.border.replace("border-", "") }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* カードヘッダー */}
        <div
          className={`p-6 bg-gradient-to-r ${colors.bg} border-b-2`}
          style={{ borderBottomColor: colors.border.replace("border-", "") }}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${colors.accent}`}
            >
              {number}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {title}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{colors.icon}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ブロック {number}/9
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* カードコンテンツ */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-4">
            {content.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${colors.accent} flex-shrink-0 mt-0.5`}
                >
                  {index + 1}
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // デスクトップ用ブロックコンポーネント（既存）
  const CanvasBlock = ({
    number,
    title,
    content,
    className = "",
    isHalfHeight = false,
  }: {
    number: number;
    title: string;
    content: string[];
    className?: string;
    isHalfHeight?: boolean;
  }) => {
    const colors = getBlockTheme(number);

    return (
      <motion.div
        className={getDynamicClasses.canvasBlock(
          isHalfHeight,
          `bg-gradient-to-br ${colors.bg} border-2 ${colors.border} hover:scale-[${ANIMATION_CONFIG.HOVER_SCALE}] ${className}`
        )}
        whileHover={{ y: ANIMATION_CONFIG.HOVER_TRANSLATE_Y }}
        transition={{ duration: ANIMATION_CONFIG.FAST_DURATION }}
      >
        <div className={CANVAS_BLOCK_CLASSES.HEADER}>
          <div
            className={`${CANVAS_BLOCK_CLASSES.NUMBER_BADGE} ${colors.accent}`}
          >
            {number}
          </div>
          <div className={CANVAS_BLOCK_CLASSES.TITLE_CONTAINER}>
            <h3 className={CANVAS_BLOCK_CLASSES.TITLE}>{title}</h3>
            <span className={CANVAS_BLOCK_CLASSES.ICON}>{colors.icon}</span>
          </div>
        </div>
        <div className={CANVAS_BLOCK_CLASSES.CONTENT_CONTAINER}>
          {content.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
                x: ANIMATION_CONFIG.ITEM_INITIAL_X,
              }}
              animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, x: 0 }}
              transition={{ delay: index * ANIMATION_CONFIG.STAGGER_DELAY }}
              className={CANVAS_BLOCK_CLASSES.CONTENT_ITEM}
            >
              <p className={CANVAS_BLOCK_CLASSES.CONTENT_TEXT}>• {item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // ナビゲーション関数
  const nextCard = () => {
    setCurrentBlockIndex((prev) =>
      prev < allBlocks.length - 1 ? prev + 1 : prev
    );
  };

  const prevCard = () => {
    setCurrentBlockIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToCard = (index: number) => {
    setCurrentBlockIndex(index);
  };

  // スワイプハンドラー
  const handleSwipe = (event: any, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextCard();
    } else if (swipe > swipeConfidenceThreshold) {
      prevCard();
    }
  };

  // ブロック描画用ヘルパー関数（デスクトップ）
  const renderCanvasBlock = (
    blockNumber: number,
    isHalfHeight = false,
    className = ""
  ) => {
    const blockConfig = getBlockByNumber(blockNumber);
    if (!blockConfig) return null;

    const title = getBlockTitle(blockConfig.titleKey);
    const content = getBlockData(
      leanCanvasData as LeanCanvasData,
      blockConfig.dataKey
    );

    return (
      <CanvasBlock
        number={blockNumber}
        title={title}
        content={content}
        className={className}
        isHalfHeight={isHalfHeight}
      />
    );
  };

  // モバイル用カード取得
  const getCurrentCardData = () => {
    const blockConfig = allBlocks[currentBlockIndex];
    if (!blockConfig) return null;

    const title = getBlockTitle(blockConfig.titleKey);
    const content = getBlockData(
      leanCanvasData as LeanCanvasData,
      blockConfig.dataKey
    );

    return {
      number: blockConfig.id,
      title,
      content,
      blockConfig,
    };
  };

  const currentCardData = getCurrentCardData();

  return (
    <motion.div
      initial={{
        opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
        y: ANIMATION_CONFIG.INITIAL_Y,
      }}
      animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG.SLOW_DURATION }}
      className="max-w-6xl mx-auto px-2 sm:px-4"
    >
      {/* ヘッダー - レスポンシブ対応 */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Award className="w-8 h-8 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
        >
          {LEAN_CANVAS.TITLE_WITH_EMOJI}
        </motion.h1>

        {selectedProductName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 inline-block shadow-lg backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {LEAN_CANVAS.PRODUCT_NAME_LABEL}
            </span>{" "}
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {selectedProductName.name}
            </span>
          </motion.div>
        )}

        {/* モバイル/デスクトップ切り替えボタン */}
        <div className="mt-6 flex justify-center">
          <div className="md:hidden flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
            <button
              onClick={() => setShowFullCanvas(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !showFullCanvas
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              カード表示
            </button>
            <button
              onClick={() => setShowFullCanvas(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showFullCanvas
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              全体表示
            </button>
          </div>
        </div>
      </div>

      {/* モバイル: カード式表示 */}
      <div className="md:hidden">
        {!showFullCanvas ? (
          <div className="relative">
            {/* メインカードエリア */}
            <div className="h-[calc(100vh-250px)] min-h-[500px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {currentCardData && (
                  <motion.div
                    key={currentBlockIndex}
                    className="absolute inset-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleSwipe}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <MobileCanvasCard
                      number={currentCardData.number}
                      title={currentCardData.title}
                      content={currentCardData.content}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ナビゲーションボタン */}
              <button
                onClick={prevCard}
                disabled={currentBlockIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={nextCard}
                disabled={currentBlockIndex === allBlocks.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* プログレスインジケーター */}
            <div className="mt-6 flex justify-center space-x-2">
              {allBlocks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentBlockIndex
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            {/* カード情報 */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentBlockIndex + 1} / {allBlocks.length} ブロック
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                スワイプまたは矢印ボタンで移動
              </p>
            </div>
          </div>
        ) : (
          // モバイル: 全体表示（コンパクト版）
          <div className="space-y-4">
            {allBlocks.map((block) => {
              const title = getBlockTitle(block.titleKey);
              const content = getBlockData(
                leanCanvasData as LeanCanvasData,
                block.dataKey
              );
              const colors = getBlockTheme(block.id);

              return (
                <div
                  key={block.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm p-4"
                  style={{ borderColor: colors.border.replace("border-", "") }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${colors.accent}`}
                    >
                      {block.id}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {title}
                    </h3>
                    <span className="text-lg">{colors.icon}</span>
                  </div>
                  <div className="space-y-2">
                    {content.map((item, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* デスクトップ: 従来のグリッド表示 */}
      <div className="hidden md:block">
        <div
          className={getDynamicClasses.canvasContainer(
            LAYOUT_CONFIG.CANVAS_MIN_HEIGHT,
            LAYOUT_CONFIG.CARD_PADDING
          )}
        >
          {/* Top Section */}
          <div
            className={getDynamicClasses.topSection(
              LAYOUT_CONFIG.TOP_SECTION_MIN_HEIGHT
            )}
          >
            {CANVAS_DISPLAY_ORDER.TOP_SECTION.map((column) => {
              const blocks = getBlocksForColumn("top", column.col);

              if (blocks.length === 1) {
                // 単一ブロック列
                return (
                  <div key={`top-col-${column.col}`}>
                    {renderCanvasBlock(blocks[0])}
                  </div>
                );
              } else if (blocks.length === 2) {
                // 分割ブロック列
                return (
                  <div
                    key={`top-col-${column.col}`}
                    className={GRID_CLASSES.SPLIT_COLUMN}
                  >
                    {renderCanvasBlock(blocks[0], true, "flex-1")}
                    {renderCanvasBlock(blocks[1], true, "flex-1")}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Bottom Section */}
          <div
            className={getDynamicClasses.bottomSection(
              LAYOUT_CONFIG.BOTTOM_SECTION_MIN_HEIGHT
            )}
          >
            {CANVAS_DISPLAY_ORDER.BOTTOM_SECTION.map((column) => {
              const blocks = getBlocksForColumn("bottom", column.col);
              return blocks.map((blockNumber) => (
                <div key={`bottom-block-${blockNumber}`}>
                  {renderCanvasBlock(blockNumber)}
                </div>
              ));
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons - レスポンシブ対応 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 sm:mt-12"
      >
        {/* モバイル: 縦並びボタン */}
        <div className="md:hidden space-y-3">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center space-x-3 py-4 text-base font-medium border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
              onClick={() => window.print()}
            >
              <Download className="w-5 h-5" />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.PDF_SAVE}</span>
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center space-x-3 py-4 text-base font-medium border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:border-purple-600 dark:hover:bg-purple-900/20"
            >
              <Share2 className="w-5 h-5" />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.SHARE}</span>
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="w-full flex items-center justify-center space-x-3 py-4 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              onClick={resetWorkflow}
            >
              <RotateCcw className="w-5 h-5" />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.CREATE_NEW}</span>
            </Button>
          </motion.div>
        </div>

        {/* デスクトップ: 横並びボタン */}
        <div className="hidden md:flex flex-wrap justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className={BUTTON_CLASSES.PDF_SAVE}
              onClick={() => window.print()}
            >
              <Download className={BUTTON_CLASSES.ICON} />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.PDF_SAVE}</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className={BUTTON_CLASSES.SHARE}
            >
              <Share2 className={BUTTON_CLASSES.ICON} />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.SHARE}</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className={BUTTON_CLASSES.CREATE_NEW}
              onClick={resetWorkflow}
            >
              <RotateCcw className={BUTTON_CLASSES.ICON} />
              <span>{LEAN_CANVAS.ACTION_BUTTONS.CREATE_NEW}</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Success Message - レスポンシブ対応 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 sm:mt-12 text-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 mx-2 sm:mx-0 shadow-xl backdrop-blur-sm p-6 sm:p-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl sm:text-5xl mb-4"
        >
          {LEAN_CANVAS.SUCCESS.EMOJI}
        </motion.div>

        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {LEAN_CANVAS.SUCCESS.TITLE}
        </h3>

        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART1}
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {" "}
            {LEAN_CANVAS.SUCCESS.MESSAGE_CANVAS}
          </span>
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART2}
          <br className="hidden sm:block" />
          <span className="block sm:inline mt-2 sm:mt-0">
            {LEAN_CANVAS.SUCCESS.MESSAGE_PART3}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {LEAN_CANVAS.SUCCESS.MESSAGE_BUSINESS}
            </span>
            {LEAN_CANVAS.SUCCESS.MESSAGE_PART4}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
