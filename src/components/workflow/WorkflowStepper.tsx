"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { WorkflowStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ANIMATION_CONFIG, LAYOUT_CONFIG, SHADOW_CONFIG } from "@/lib/constants/app-constants";
import { WORKFLOW_STEPS } from "@/lib/constants/messages";

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
}

const steps = [
  { key: "keyword", label: WORKFLOW_STEPS.STEP_LABELS.KEYWORD },
  { key: "persona-selection", label: WORKFLOW_STEPS.STEP_LABELS.PERSONA_SELECTION },
  { key: "creativity-level-selection", label: WORKFLOW_STEPS.STEP_LABELS.CREATIVITY_LEVEL_SELECTION },
  { key: "business-idea-selection", label: WORKFLOW_STEPS.STEP_LABELS.BUSINESS_IDEA_SELECTION },
  { key: "details-input", label: WORKFLOW_STEPS.STEP_LABELS.DETAILS_INPUT },
  { key: "product-name-selection", label: WORKFLOW_STEPS.STEP_LABELS.PRODUCT_NAME_SELECTION },
  { key: "canvas-display", label: WORKFLOW_STEPS.STEP_LABELS.CANVAS_DISPLAY },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="w-full py-4 md:py-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto px-2 md:px-4 gap-4 sm:gap-0">
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
                    "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300",
                    isCompleted &&
                      "bg-gradient-primary border-transparent text-white shadow-lg",
                    isCurrent &&
                      "bg-gradient-primary border-transparent text-white shadow-xl scale-110",
                    isUpcoming && "border-gray-300 bg-white text-gray-400"
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
                      <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">
                      {index + 1}
                    </span>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.span
                  className={cn(
                    "mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center px-1 sm:px-2 transition-colors duration-300 leading-tight",
                    (isCompleted || isCurrent) && "text-primary",
                    isUpcoming && "text-gray-400"
                  )}
                  animate={{
                    color: isCompleted || isCurrent ? "#667eea" : "#9ca3af",
                  }}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">
                    {step.label
                      .replace("ビジネスアイデア選択", "アイデア")
                      .replace("プロダクト名選択", "プロダクト名")
                      .replace("リーンキャンバス", "キャンバス")}
                  </span>
                </motion.span>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex items-center flex-1 px-2">
                  <div className="w-full h-0.5 bg-gray-200">
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
    </div>
  );
}
