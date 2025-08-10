"use client";

import { motion } from "framer-motion";
import { Award, Download, RotateCcw, Share2 } from "lucide-react";
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

  // キャンバスブロックコンポーネント
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

  // ブロック描画用ヘルパー関数
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

  return (
    <motion.div
      initial={{
        opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
        y: ANIMATION_CONFIG.INITIAL_Y,
      }}
      animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG.SLOW_DURATION }}
      className={CONTAINER_CLASSES.MAIN_CONTAINER}
    >
      {/* Header */}
      <div className={CONTAINER_CLASSES.HEADER_CONTAINER}>
        <motion.div
          className={HEADER_CLASSES.ICON_BACKGROUND}
          animate={{
            scale: ANIMATION_CONFIG.HEADER_SCALE_KEYFRAMES,
            rotate: ANIMATION_CONFIG.HEADER_ROTATE_KEYFRAMES,
          }}
          transition={{
            duration: ANIMATION_CONFIG.HEADER_ROTATE_DURATION,
            repeat: Infinity,
            ease: ANIMATION_CONFIG.BOUNCE_EASE,
          }}
        >
          <Award className={HEADER_CLASSES.ICON} />
        </motion.div>

        <motion.h1
          initial={{
            opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
            y: ANIMATION_CONFIG.HEADER_INITIAL_Y,
          }}
          animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, y: 0 }}
          transition={{ delay: ANIMATION_CONFIG.HEADER_DELAY }}
          className={HEADER_CLASSES.TITLE}
        >
          {LEAN_CANVAS.TITLE_WITH_EMOJI}
        </motion.h1>

        {selectedProductName && (
          <motion.div
            initial={{
              opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
              scale: ANIMATION_CONFIG.PRODUCT_NAME_SCALE,
            }}
            animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, scale: 1 }}
            transition={{ delay: ANIMATION_CONFIG.PRODUCT_NAME_DELAY }}
            className={HEADER_CLASSES.PRODUCT_NAME_CONTAINER}
          >
            <span className={HEADER_CLASSES.PRODUCT_NAME_LABEL}>
              {LEAN_CANVAS.PRODUCT_NAME_LABEL}
            </span>{" "}
            <span className={HEADER_CLASSES.PRODUCT_NAME_VALUE}>
              {selectedProductName.name}
            </span>
          </motion.div>
        )}
      </div>

      {/* Modern Lean Canvas Layout */}
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
              return renderCanvasBlock(blocks[0]);
            } else if (blocks.length === 2) {
              // 分割ブロック列
              return (
                <div
                  key={`col-${column.col}`}
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
            return blocks.map((blockNumber) => renderCanvasBlock(blockNumber));
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{
          opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
          y: ANIMATION_CONFIG.INITIAL_Y,
        }}
        animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, y: 0 }}
        transition={{ delay: ANIMATION_CONFIG.BUTTON_DELAY }}
        className={CONTAINER_CLASSES.BUTTON_CONTAINER}
      >
        <motion.div
          whileHover={{ scale: ANIMATION_CONFIG.BUTTON_HOVER_SCALE }}
          whileTap={{ scale: ANIMATION_CONFIG.BUTTON_ACTIVE_SCALE }}
        >
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

        <motion.div
          whileHover={{ scale: ANIMATION_CONFIG.BUTTON_HOVER_SCALE }}
          whileTap={{ scale: ANIMATION_CONFIG.BUTTON_ACTIVE_SCALE }}
        >
          <Button size="lg" variant="outline" className={BUTTON_CLASSES.SHARE}>
            <Share2 className={BUTTON_CLASSES.ICON} />
            <span>{LEAN_CANVAS.ACTION_BUTTONS.SHARE}</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: ANIMATION_CONFIG.BUTTON_HOVER_SCALE }}
          whileTap={{ scale: ANIMATION_CONFIG.BUTTON_ACTIVE_SCALE }}
        >
          <Button
            size="lg"
            className={BUTTON_CLASSES.CREATE_NEW}
            onClick={resetWorkflow}
          >
            <RotateCcw className={BUTTON_CLASSES.ICON} />
            <span>{LEAN_CANVAS.ACTION_BUTTONS.CREATE_NEW}</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{
          opacity: ANIMATION_CONFIG.INITIAL_OPACITY,
          scale: ANIMATION_CONFIG.PRODUCT_NAME_SCALE,
        }}
        animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, scale: 1 }}
        transition={{ delay: ANIMATION_CONFIG.SUCCESS_DELAY }}
        className={getDynamicClasses.successContainer(6, 8)}
      >
        <motion.div
          animate={{ rotate: ANIMATION_CONFIG.SUCCESS_ROTATE_KEYFRAMES }}
          transition={{
            duration: ANIMATION_CONFIG.SUCCESS_ROTATE_DURATION,
            repeat: Infinity,
            ease: ANIMATION_CONFIG.BOUNCE_EASE,
          }}
          className={SUCCESS_CLASSES.EMOJI_CONTAINER}
        >
          {LEAN_CANVAS.SUCCESS.EMOJI}
        </motion.div>
        <h3 className={SUCCESS_CLASSES.TITLE}>{LEAN_CANVAS.SUCCESS.TITLE}</h3>
        <p className={SUCCESS_CLASSES.MESSAGE}>
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART1}
          <span className={SUCCESS_CLASSES.HIGHLIGHT_PURPLE}>
            {" "}
            {LEAN_CANVAS.SUCCESS.MESSAGE_CANVAS}
          </span>
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART2}
          <br />
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART3}
          <span className={SUCCESS_CLASSES.HIGHLIGHT_BLUE}>
            {LEAN_CANVAS.SUCCESS.MESSAGE_BUSINESS}
          </span>
          {LEAN_CANVAS.SUCCESS.MESSAGE_PART4}
        </p>
      </motion.div>
    </motion.div>
  );
}
