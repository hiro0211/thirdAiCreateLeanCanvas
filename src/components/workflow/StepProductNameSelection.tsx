"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { useGenerateLeanCanvas } from "@/hooks/useApiMutations";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { ProductName } from "@/lib/types";
import { WorkflowHeader, WorkflowNavigation, SelectableCard } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

export function StepProductNameSelection() {
  const {
    productNames,
    selectedProductName,
    error,
    selectedPersona,
    selectedBusinessIdea,
    selectProductName,
    setLeanCanvasData,
    setError,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const generateLeanCanvasMutation = useGenerateLeanCanvas();

  const handleNameSelect = useCallback((name: ProductName) => {
    selectProductName(name);
  }, [selectProductName]);

  const handleNext = useCallback(async () => {
    if (!selectedProductName || !selectedPersona || !selectedBusinessIdea) {
      setError("必要な情報が選択されていません");
      return;
    }

    try {
      setError(null);
      const leanCanvasData = await generateLeanCanvasMutation.mutateAsync({
        persona: selectedPersona,
        businessIdea: selectedBusinessIdea,
        productName: selectedProductName,
      });
      setLeanCanvasData(leanCanvasData);
      goToNextStep();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "リーンキャンバスの生成に失敗しました"
      );
    }
  }, [selectedProductName, selectedPersona, selectedBusinessIdea, setError, generateLeanCanvasMutation, setLeanCanvasData, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.MAIN}
    >
      <WorkflowHeader
        icon={<Tag className="w-10 h-10" />}
        title="プロダクト名を選択してください"
        description="最も魅力的で覚えやすい名前を1つ選んでください"
        gradient="accent"
        animationType="bounce"
        iconSize="lg"
        className="mb-8"
      />

      <RetryableErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
        retryLabel="ページを再読み込み"
      />

      <div className={LAYOUT_PRESETS.GRID.TWO_COLUMN + " mb-8"}>
        {productNames.map((name, index) => {
          const isSelected = selectedProductName?.id === name.id;
          
          return (
            <SelectableCard
              key={name.id}
              item={name}
              index={index}
              isSelected={isSelected}
              onSelect={handleNameSelect}
              renderHeader={(name) => (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {name.name}
                  </h3>
                  <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              )}
              renderContent={(name) => (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <span>💡</span>
                      <span>命名理由</span>
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      {name.reason}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span>メリット</span>
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-md border border-green-200 dark:border-green-800">
                        {name.pros}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center space-x-1">
                        <ThumbsDown className="w-4 h-4 text-orange-600" />
                        <span>注意点</span>
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-md border border-orange-200 dark:border-orange-800">
                        {name.cons}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              animationDelay={0.1}
            />
          );
        })}
      </div>

      {/* Selected Name Summary */}
      <AnimatePresence>
        {selectedProductName && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                      選択されたプロダクト名
                    </h4>
                    <div className="text-2xl font-bold text-center text-primary mb-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {selectedProductName.name}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">選択理由:</span> {selectedProductName.reason}
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
        isNextDisabled={!selectedProductName}
        isLoading={generateLeanCanvasMutation.isLoading}
        nextLabel={generateLeanCanvasMutation.isLoading ? "リーンキャンバスを生成中..." : "リーンキャンバスを生成"}
        nextVariant="gradient"
      />
    </motion.div>
  );
}
