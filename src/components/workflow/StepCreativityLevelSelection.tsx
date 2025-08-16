"use client";

import { useCallback } from "react";
import { Lightbulb } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { useGenerateBusinessIdeas } from "@/hooks/useApiMutations";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { CreativityLevel } from "@/lib/types";
import { WorkflowHeader, WorkflowNavigation, SelectableCard } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";
import { motion } from "framer-motion";

const creativityOptions: Array<{
  level: CreativityLevel;
  title: string;
  description: string;
  example: string;
  icon: string;
}> = [
  {
    level: "realistic",
    title: "現実的",
    description: "実現可能で堅実なアプローチ",
    example: "既存の市場やトレンドに基づいた実証済みのビジネスモデル",
    icon: "🎯",
  },
  {
    level: "creative",
    title: "革新的",
    description: "創造的で差別化されたアイデア",
    example: "新しい技術や手法を組み合わせた独創的なソリューション",
    icon: "💡",
  },
  {
    level: "visionary",
    title: "ぶっとび",
    description: "業界を変革する破壊的なアイデア",
    example: "常識を覆す斬新で大胆なビジネスコンセプト",
    icon: "🚀",
  },
];

export function StepCreativityLevelSelection() {
  const {
    creativityLevel,
    error,
    selectedPersona,
    setCreativityLevel,
    setBusinessIdeas,
    setError,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const generateBusinessIdeasMutation = useGenerateBusinessIdeas();

  const handleLevelSelect = useCallback((option: typeof creativityOptions[0]) => {
    setCreativityLevel(option.level);
  }, [setCreativityLevel]);

  const handleNext = useCallback(async () => {
    if (!selectedPersona) {
      setError("ペルソナが選択されていません");
      return;
    }

    try {
      setError(null);
      const businessIdeas = await generateBusinessIdeasMutation.mutateAsync({
        persona: selectedPersona,
        creativityLevel,
      });
      setBusinessIdeas(businessIdeas);
      goToNextStep();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ビジネスアイデアの生成に失敗しました"
      );
    }
  }, [selectedPersona, creativityLevel, setError, generateBusinessIdeasMutation, setBusinessIdeas, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.MAIN}
    >
      <WorkflowHeader
        icon={<Lightbulb className="w-10 h-10" />}
        title="思考モードを選択してください"
        description="ビジネスアイデアの創造性レベルを選んでください"
        gradient="accent"
        animationType="scale"
        iconSize="lg"
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {creativityOptions.map((option, index) => {
          const isSelected = creativityLevel === option.level;
          
          return (
            <SelectableCard
              key={option.level}
              item={option}
              index={index}
              isSelected={isSelected}
              onSelect={handleLevelSelect}
              renderHeader={(option) => (
                <div className="text-center">
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              )}
              renderContent={(option) => (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">例:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {option.example}
                  </p>
                </div>
              )}
              animationDelay={0.1}
            />
          );
        })}
      </div>

      <RetryableErrorDisplay
        error={error}
        onRetry={handleNext}
        retryLabel="ビジネスアイデアを再生成"
      />

      <WorkflowNavigation
        onPrevious={goToPreviousStep}
        onNext={handleNext}
        isNextDisabled={!creativityLevel}
        isLoading={generateBusinessIdeasMutation.isLoading}
        nextLabel={generateBusinessIdeasMutation.isLoading ? "ビジネスアイデアを生成中..." : "ビジネスアイデアを生成"}
        nextVariant="gradient"
      />
    </motion.div>
  );
}
