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
import { BusinessIdea } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepBusinessIdeaSelection() {
  const {
    businessIdeas,
    selectedBusinessIdea,
    error,
    generateBusinessIdeas,
    selectBusinessIdea,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handleIdeaSelect = (idea: BusinessIdea) => {
    selectBusinessIdea(idea);
  };

  const handleNext = () => {
    if (selectedBusinessIdea) {
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
          className="mx-auto mb-4 w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lightbulb className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          ビジネスアイデアを選択してください
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          最も魅力的で実現可能なアイデアを1つ選んでください
        </p>
      </div>

      <RetryableErrorDisplay
        error={error}
        onRetry={generateBusinessIdeas}
        retryLabel="ビジネスアイデアを再生成"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {businessIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 h-full",
                selectedBusinessIdea?.id === idea.id
                  ? "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5"
                  : "border-gray-200 hover:border-primary/50"
              )}
              onClick={() => handleIdeaSelect(idea)}
            >
              <CardHeader className="relative">
                {selectedBusinessIdea?.id === idea.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>アイデア {idea.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    ビジネスコンセプト
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    {idea.idea_text}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <span>💡</span>
                    <span>発想のヒント</span>
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-200">
                    {idea.osborn_hint}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
            disabled={!selectedBusinessIdea}
            size="lg"
            className="flex items-center space-x-2 px-8"
          >
            <ArrowRight className="w-5 h-5" />
            <span>次へ進む</span>
          </Button>
        </motion.div>
      </div>

      {/* Selected Idea Summary */}
      {selectedBusinessIdea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>選択されたアイデア</span>
          </h4>
          <p className="text-sm text-gray-700">
            {selectedBusinessIdea.idea_text}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
