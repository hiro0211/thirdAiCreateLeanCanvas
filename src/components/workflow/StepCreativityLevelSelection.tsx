"use client";

import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkflowStore } from "@/stores/workflow-store";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { CreativityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    isLoading,
    error,
    setCreativityLevel,
    generateBusinessIdeas,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handleLevelSelect = (level: CreativityLevel) => {
    setCreativityLevel(level);
  };

  const handleNext = async () => {
    await generateBusinessIdeas();
    const store = useWorkflowStore.getState();
    if (!store.error) {
      goToNextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-4 w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lightbulb className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          思考モードを選択してください
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          ビジネスアイデアの創造性レベルを選んでください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {creativityOptions.map((option, index) => (
          <motion.div
            key={option.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 h-full",
                creativityLevel === option.level
                  ? "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
                  : "border-gray-200 hover:border-primary/50"
              )}
              onClick={() => handleLevelSelect(option.level)}
            >
              <CardHeader className="relative text-center">
                {creativityLevel === option.level && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
                <div className="text-4xl mb-2">{option.icon}</div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {option.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">例:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-md">
                    {option.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <RetryableErrorDisplay
        error={error}
        onRetry={generateBusinessIdeas}
        retryLabel="ビジネスアイデアを再生成"
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleNext}
            disabled={!creativityLevel || isLoading}
            size="lg"
            className="flex items-center space-x-2 px-8"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Lightbulb className="w-5 h-5" />
              </motion.div>
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            <span>
              {isLoading
                ? "ビジネスアイデアを生成中..."
                : "ビジネスアイデアを生成"}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}