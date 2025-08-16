"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { BusinessIdea } from "@/lib/types";
import { WorkflowHeader, WorkflowNavigation, SelectableCard } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

export function StepBusinessIdeaSelection() {
  const {
    businessIdeas,
    selectedBusinessIdea,
    error,
    selectBusinessIdea,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handleIdeaSelect = useCallback((idea: BusinessIdea) => {
    selectBusinessIdea(idea);
  }, [selectBusinessIdea]);

  const handleNext = useCallback(() => {
    if (selectedBusinessIdea) {
      goToNextStep();
    }
  }, [selectedBusinessIdea, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.MAIN}
    >
      <WorkflowHeader
        icon={<Lightbulb className="w-10 h-10" />}
        title="ビジネスアイデアを選択してください"
        description="最も魅力的で実現可能なアイデアを1つ選んでください"
        gradient="secondary"
        animationType="bounce"
        iconSize="lg"
        className="mb-8"
      />

      {error && (
        <RetryableErrorDisplay
          error={error}
          onRetry={() => window.location.reload()}
          retryLabel="ページを再読み込み"
        />
      )}

      <div className={LAYOUT_PRESETS.GRID.TWO_COLUMN + " mb-8"}>
        {businessIdeas.map((idea, index) => {
          const isSelected = selectedBusinessIdea?.id === idea.id;
          
          return (
            <SelectableCard
              key={idea.id}
              item={idea}
              index={index}
              isSelected={isSelected}
              onSelect={handleIdeaSelect}
              renderHeader={(idea) => (
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    アイデア {idea.id}
                  </h3>
                </div>
              )}
              renderContent={(idea) => (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      ビジネスコンセプト
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
                      {idea.idea_text}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <span>💡</span>
                      <span>発想のヒント</span>
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                      {idea.osborn_hint}
                    </p>
                  </div>
                </div>
              )}
              animationDelay={0.1}
            />
          );
        })}
      </div>

      {/* Selected Idea Summary */}
      <AnimatePresence>
        {selectedBusinessIdea && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 p-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                      選択されたアイデア
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedBusinessIdea.idea_text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WorkflowNavigation
        onPrevious={goToPreviousStep}
        onNext={handleNext}
        isNextDisabled={!selectedBusinessIdea}
        nextLabel="次へ進む"
        nextVariant="gradient"
      />
    </motion.div>
  );
}
