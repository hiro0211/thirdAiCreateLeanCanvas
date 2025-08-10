"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
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
import { Persona } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepPersonaSelection() {
  const {
    personas,
    selectedPersona,
    isLoading,
    error,
    selectPersona,
    generateBusinessIdeas,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handlePersonaSelect = (persona: Persona) => {
    selectPersona(persona);
  };

  const handleNext = async () => {
    if (!selectedPersona) return;

    await generateBusinessIdeas();
    if (!error) {
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
          <Users className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          ペルソナを選択してください
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          最も共感できるターゲットユーザーを1つ選んでください
        </p>
      </div>

      <RetryableErrorDisplay
        error={error}
        onRetry={generateBusinessIdeas}
        retryLabel="ビジネスアイデアを再生成"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        data-tutorial="persona-cards"
      >
        {personas.map((persona, index) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                selectedPersona?.id === persona.id
                  ? "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
                  : "border-gray-200 hover:border-primary/50"
              )}
              onClick={() => handlePersonaSelect(persona)}
            >
              <CardHeader className="relative">
                {selectedPersona?.id === persona.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
                <CardTitle className="text-lg font-semibold text-gray-800">
                  ペルソナ {persona.id}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">概要</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm mb-1">
                      明確なニーズ
                    </h5>
                    <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded-md">
                      {persona.needs.explicit}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 text-sm mb-1">
                      潜在的ニーズ
                    </h5>
                    <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded-md">
                      {persona.needs.implicit}
                    </p>
                  </div>
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
            disabled={!selectedPersona || isLoading}
            size="lg"
            className="flex items-center space-x-2 px-8"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-5 h-5" />
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
