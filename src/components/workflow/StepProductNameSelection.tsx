"use client";

import { motion } from "framer-motion";
import {
  Tag,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
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
import { ProductName } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepProductNameSelection() {
  const {
    productNames,
    selectedProductName,
    isLoading,
    error,
    generateProductNames,
    selectProductName,
    generateLeanCanvas,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handleNameSelect = (name: ProductName) => {
    selectProductName(name);
  };

  const handleNext = async () => {
    if (!selectedProductName) return;

    await generateLeanCanvas();
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
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Tag className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          プロダクト名を選択してください
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          最も魅力的で覚えやすい名前を1つ選んでください
        </p>
      </div>

      <RetryableErrorDisplay
        error={error}
        onRetry={generateProductNames}
        retryLabel="プロダクト名を再生成"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {productNames.map((name, index) => (
          <motion.div
            key={name.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2 h-full",
                selectedProductName?.id === name.id
                  ? "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
                  : "border-gray-200 hover:border-primary/50"
              )}
              onClick={() => handleNameSelect(name)}
            >
              <CardHeader className="relative">
                {selectedProductName?.id === name.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
                <CardTitle className="text-2xl font-bold text-center text-gray-800 mb-2">
                  {name.name}
                </CardTitle>
                <div className="w-full h-1 bg-gradient-primary rounded-full"></div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <span>💡</span>
                    <span>命名理由</span>
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg">
                    {name.reason}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm mb-2 flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span>メリット</span>
                    </h5>
                    <p className="text-xs text-gray-600 bg-green-50 p-2 rounded-md border border-green-200">
                      {name.pros}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 text-sm mb-2 flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-orange-600" />
                      <span>注意点</span>
                    </h5>
                    <p className="text-xs text-gray-600 bg-orange-50 p-2 rounded-md border border-orange-200">
                      {name.cons}
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
            disabled={!selectedProductName || isLoading}
            size="lg"
            className="flex items-center space-x-2 px-8"
            variant="gradient"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Tag className="w-5 h-5" />
              </motion.div>
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            <span>
              {isLoading
                ? "リーンキャンバスを生成中..."
                : "リーンキャンバスを生成"}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Selected Name Summary */}
      {selectedProductName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
        >
          <h4 className="font-bold text-xl text-gray-800 mb-2 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>選択されたプロダクト名</span>
          </h4>
          <div className="text-3xl font-bold text-center text-primary mb-3 py-4 bg-white rounded-lg shadow-sm">
            {selectedProductName.name}
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">選択理由:</span>{" "}
            {selectedProductName.reason}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
