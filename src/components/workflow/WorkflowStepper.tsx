"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { WorkflowStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ANIMATION_CONFIG,
  LAYOUT_CONFIG,
  SHADOW_CONFIG,
} from "@/lib/constants/app-constants";
import { WORKFLOW_STEPS } from "@/lib/constants/messages";

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
}

const steps = [
  { key: "keyword", label: WORKFLOW_STEPS.STEP_LABELS.KEYWORD },
  {
    key: "persona-selection",
    label: WORKFLOW_STEPS.STEP_LABELS.PERSONA_SELECTION,
  },
  {
    key: "creativity-level-selection",
    label: WORKFLOW_STEPS.STEP_LABELS.CREATIVITY_LEVEL_SELECTION,
  },
  {
    key: "business-idea-selection",
    label: WORKFLOW_STEPS.STEP_LABELS.BUSINESS_IDEA_SELECTION,
  },
  { key: "details-input", label: WORKFLOW_STEPS.STEP_LABELS.DETAILS_INPUT },
  {
    key: "product-name-selection",
    label: WORKFLOW_STEPS.STEP_LABELS.PRODUCT_NAME_SELECTION,
  },
  { key: "canvas-display", label: WORKFLOW_STEPS.STEP_LABELS.CANVAS_DISPLAY },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const [isExpanded, setIsExpanded] = useState(false);

  // 現在のステップ情報を取得
  const currentStepInfo = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  // ローカルストレージから状態を復元
  useEffect(() => {
    const savedState = localStorage.getItem("stepper-expanded");
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);

  // 状態変更時にローカルストレージに保存
  const handleToggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("stepper-expanded", JSON.stringify(newState));
  };

  return (
    <div className="w-full py-4 md:py-8 overflow-hidden">
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto px-4 gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center min-w-0">
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                    isCompleted &&
                      "bg-gradient-primary border-transparent text-white shadow-lg",
                    isCurrent &&
                      "bg-gradient-primary border-transparent text-white shadow-xl scale-110",
                    isUpcoming &&
                      "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                  )}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    boxShadow: isCurrent
                      ? "0 8px 25px rgba(102, 126, 234, 0.6)"
                      : "0 4px 15px rgba(102, 126, 234, 0.4)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  className={cn(
                    "mt-3 text-sm font-medium text-center px-2 transition-colors duration-300 leading-tight",
                    (isCompleted || isCurrent) && "text-primary",
                    isUpcoming && "text-gray-400 dark:text-gray-500"
                  )}
                  animate={{
                    color: isCompleted || isCurrent ? "#667eea" : "#9ca3af",
                  }}
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="flex items-center flex-1 px-2">
                  <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      className="h-full bg-gradient-primary"
                      initial={{ width: "0%" }}
                      animate={{
                        width: index < currentStepIndex ? "100%" : "0%",
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index < currentStepIndex ? 0.2 : 0,
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Accordion Layout */}
      <div className="md:hidden max-w-sm mx-auto px-4">
        {/* Compact Header - Always Visible */}
        <motion.button
          onClick={handleToggleExpanded}
          className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation tap-highlight-none"
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? "ステップ一覧を閉じる" : "ステップ一覧を開く"
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Current Step Circle */}
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                {currentStepIndex > 0 ? (
                  currentStepIndex < steps.length - 1 ? (
                    <span className="text-white text-sm font-bold">
                      {currentStepIndex + 1}
                    </span>
                  ) : (
                    <Check className="w-5 h-5 text-white" />
                  )
                ) : (
                  <span className="text-white text-sm font-bold">1</span>
                )}
              </div>

              {/* Current Step Info */}
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {currentStepInfo?.label
                    .replace("ビジネスアイデア選択", "アイデア選択")
                    .replace("プロダクト名選択", "プロダクト名")
                    .replace("リーンキャンバス", "キャンバス")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ステップ {currentStepIndex + 1} / {steps.length}
                </div>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            />
          </div>
        </motion.button>

        {/* Expandable Step List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut" as const,
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
              }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isUpcoming = index > currentStepIndex;

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        {/* Step Circle */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            isCompleted &&
                              "bg-gradient-primary border-transparent text-white",
                            isCurrent &&
                              "bg-gradient-primary border-transparent text-white ring-2 ring-blue-200",
                            isUpcoming &&
                              "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-semibold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="flex-1">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              (isCompleted || isCurrent) &&
                                "text-primary font-semibold",
                              isUpcoming && "text-gray-400 dark:text-gray-500"
                            )}
                          >
                            {step.label
                              .replace("ビジネスアイデア選択", "アイデア選択")
                              .replace("プロダクト名選択", "プロダクト名")
                              .replace("リーンキャンバス", "キャンバス")}
                          </span>
                          {isCurrent && (
                            <div className="text-xs text-primary mt-0.5">
                              現在のステップ
                            </div>
                          )}
                        </div>

                        {/* Status Icon */}
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-500"
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={handleToggleExpanded}
                  className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>閉じる</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
