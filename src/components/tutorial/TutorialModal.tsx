"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, SkipForward, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTutorialStore } from "@/stores/workflow-store";
import { useEffect, useRef } from "react";

export function TutorialModal() {
  const {
    isActive,
    currentStepIndex,
    steps,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
  } = useTutorialStore();

  const modalRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        skipTutorial();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isActive, skipTutorial]);

  // ターゲット要素をハイライト
  useEffect(() => {
    if (!isActive || !currentStep?.target) return;

    const targetElement = document.querySelector(currentStep.target);
    if (targetElement) {
      targetElement.classList.add("tutorial-highlight");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    return () => {
      const allHighlighted = document.querySelectorAll(".tutorial-highlight");
      allHighlighted.forEach((el) => el.classList.remove("tutorial-highlight"));
    };
  }, [isActive, currentStep]);

  if (!isActive || !currentStep) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      skipTutorial();
    }
  };

  const getModalPosition = () => {
    if (!currentStep.target) {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const targetElement = document.querySelector(currentStep.target);
    if (!targetElement) {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const modalWidth = 400;
    const modalHeight = 300;
    const gap = 20;

    switch (currentStep.position) {
      case "top":
        return {
          position: "fixed" as const,
          top: Math.max(gap, rect.top - modalHeight - gap),
          left: Math.max(
            gap,
            Math.min(
              window.innerWidth - modalWidth - gap,
              rect.left + rect.width / 2 - modalWidth / 2
            )
          ),
        };
      case "bottom":
        return {
          position: "fixed" as const,
          top: Math.min(
            window.innerHeight - modalHeight - gap,
            rect.bottom + gap
          ),
          left: Math.max(
            gap,
            Math.min(
              window.innerWidth - modalWidth - gap,
              rect.left + rect.width / 2 - modalWidth / 2
            )
          ),
        };
      case "left":
        return {
          position: "fixed" as const,
          top: Math.max(
            gap,
            Math.min(
              window.innerHeight - modalHeight - gap,
              rect.top + rect.height / 2 - modalHeight / 2
            )
          ),
          left: Math.max(gap, rect.left - modalWidth - gap),
        };
      case "right":
        return {
          position: "fixed" as const,
          top: Math.max(
            gap,
            Math.min(
              window.innerHeight - modalHeight - gap,
              rect.top + rect.height / 2 - modalHeight / 2
            )
          ),
          left: Math.min(
            window.innerWidth - modalWidth - gap,
            rect.right + gap
          ),
        };
      default:
        return {
          position: "fixed" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60"
        onClick={handleBackdropClick}
      >
        {/* ターゲット要素のスポットライト効果 */}
        {currentStep.target && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              boxShadow:
                "0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.7)",
              borderRadius: "8px",
              ...(() => {
                const targetElement = document.querySelector(
                  currentStep.target!
                );
                if (!targetElement) return {};
                const rect = targetElement.getBoundingClientRect();
                return {
                  top: rect.top - 4,
                  left: rect.left - 4,
                  width: rect.width + 8,
                  height: rect.height + 8,
                };
              })(),
            }}
          />
        )}

        {/* チュートリアルカード */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md"
          style={getModalPosition()}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentStep.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {currentStep.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTutorial}
                  className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* プログレスバー */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>
                    ステップ {currentStepIndex + 1} / {steps.length}
                  </span>
                  <span>
                    {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <motion.p
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-6"
              >
                {currentStep.content}
              </motion.p>

              {/* アクションボタン */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousStep}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>戻る</span>
                    </Button>
                  )}

                  {currentStep.showSkip && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipTutorial}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                    >
                      <SkipForward className="h-4 w-4" />
                      <span>スキップ</span>
                    </Button>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={isLastStep ? completeTutorial : nextStep}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-1"
                  >
                    {isLastStep ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>完了</span>
                      </>
                    ) : (
                      <>
                        <span>次へ</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
