"use client";

import { useCallback } from "react";
import { Lightbulb, Target, Sparkles } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { BusinessIdea } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { WorkflowHeader, WorkflowNavigation, SelectableCard } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

const IDEA_STYLES = [
  { gradient: "from-violet-400 to-purple-400", icon: "🚀" },
  { gradient: "from-blue-400 to-indigo-400", icon: "💡" },
  { gradient: "from-emerald-400 to-teal-400", icon: "🌱" },
  { gradient: "from-orange-400 to-amber-400", icon: "🔥" },
  { gradient: "from-pink-400 to-rose-400", icon: "✨" },
  { gradient: "from-cyan-400 to-blue-400", icon: "🌊" },
  { gradient: "from-yellow-400 to-orange-400", icon: "⚡" },
  { gradient: "from-indigo-400 to-purple-400", icon: "🎯" },
  { gradient: "from-green-400 to-emerald-400", icon: "🌟" },
  { gradient: "from-red-400 to-pink-400", icon: "🔮" },
];

const getIdeaStyle = (index: number) => IDEA_STYLES[index % IDEA_STYLES.length];

export function StepBusinessIdeaSelection() {
  const {
    businessIdeas,
    selectedBusinessIdea,
    error,
    selectBusinessIdea,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handleIdeaSelect = useCallback(
    (idea: BusinessIdea) => {
      selectBusinessIdea(idea);
    },
    [selectBusinessIdea]
  );

  const handleNext = useCallback(() => {
    if (!selectedBusinessIdea) return;
    goToNextStep();
  }, [selectedBusinessIdea, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.MAIN}
    >
      {/* ヘッダーセクション */}
      <WorkflowHeader
        icon={<Lightbulb className="w-10 h-10" />}
        title="ビジネスアイデアを選択"
        description="最もピンとくるアイデアを選んでください"
        gradient="accent"
        animationType="scale"
        iconSize="lg"
        className="mb-10"
      />

      {error && (
        <RetryableErrorDisplay
          error={error}
          onRetry={() => window.location.reload()}
          retryLabel="ページを再読み込み"
        />
      )}

      {/* ビジネスアイデアグリッド */}
      <div className={LAYOUT_PRESETS.GRID.RESPONSIVE_CARDS + " mb-10"}>
        {businessIdeas.map((idea, index) => {
          const style = getIdeaStyle(index);
          const isSelected = selectedBusinessIdea?.id === idea.id;

          return (
            <SelectableCard
              key={idea.id}
              item={idea}
              index={index}
              isSelected={isSelected}
              onSelect={handleIdeaSelect}
              renderHeader={(idea) => (
                <div className="flex items-start space-x-4">
                  {/* アイデアアイコン */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0 ${style.gradient}`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                  </motion.div>

                  {/* タイトル部分 */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      ビジネスアイデア
                    </h3>
                  </div>
                </div>
              )}
              renderContent={(idea) => (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        コンセプト
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {idea.idea_text}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-gray-700">
                        発想のヒント
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 bg-amber-50 p-2 rounded border border-amber-200">
                      {idea.osborn_hint}
                    </p>
                  </div>
                </div>
              )}
              animationDelay={0.08}
            />
          );
        })}
      </div>

      {/* 選択されたアイデアのハイライト */}
      <AnimatePresence>
        {selectedBusinessIdea && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" as const,
                    }}
                    className="flex-shrink-0"
                  >
                    <Sparkles className="w-10 h-10 text-amber-500" />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                      選択されたビジネスアイデア
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedBusinessIdea.idea_text}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                        ヒント:{" "}
                        {selectedBusinessIdea.osborn_hint.substring(0, 30)}
                        ...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ナビゲーションボタン */}
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
