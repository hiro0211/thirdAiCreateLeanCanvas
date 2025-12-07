"use client";

import { useState, useCallback, useTransition } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkflowStore } from "@/stores/workflow-store";
import {
  generateProductNamesAction,
  generateProductDetailsAction,
} from "@/app/actions";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { ProductDetails } from "@/lib/types";
import { WorkflowHeader, WorkflowNavigation } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

export function StepDetailsInput() {
  const {
    productDetails,
    error,
    selectedPersona,
    selectedBusinessIdea,
    setProductDetails,
    setProductNames,
    setError,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const [isPendingDetails, startDetailsTransition] = useTransition();
  const [isPendingNames, startNamesTransition] = useTransition();

  const [localDetails, setLocalDetails] =
    useState<ProductDetails>(productDetails);

  const handleInputChange = useCallback((field: keyof ProductDetails, value: string) => {
    setLocalDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const isFormValid =
    localDetails.category.trim() &&
    localDetails.feature.trim() &&
    localDetails.brandImage.trim();

  const handleAIGenerate = useCallback(() => {
    if (!selectedPersona || !selectedBusinessIdea || isPendingDetails) {
      if (!selectedPersona || !selectedBusinessIdea) {
        setError("ペルソナまたはビジネスアイデアが選択されていません");
      }
      return;
    }

    setError(null);
    startDetailsTransition(async () => {
      const result = await generateProductDetailsAction({
        persona: selectedPersona,
        businessIdea: selectedBusinessIdea,
      });

      if (result.success) {
        setLocalDetails(result.data);
      } else {
        setError(result.error);
      }
    });
  }, [selectedPersona, selectedBusinessIdea, isPendingDetails, setError]);

  const handleNext = useCallback(() => {
    if (!isFormValid || isPendingNames) return;
    if (!selectedPersona || !selectedBusinessIdea) {
      setError("ペルソナまたはビジネスアイデアが選択されていません");
      return;
    }

    setError(null);
    setProductDetails(localDetails);
    
    startNamesTransition(async () => {
      const result = await generateProductNamesAction({
        persona: selectedPersona,
        businessIdea: selectedBusinessIdea,
        productDetails: localDetails,
      });

      if (result.success) {
        setProductNames(result.data);
        goToNextStep();
      } else {
        setError(result.error);
      }
    });
  }, [isFormValid, selectedPersona, selectedBusinessIdea, isPendingNames, setError, setProductDetails, localDetails, setProductNames, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.CENTERED + " px-2 sm:px-4"}
    >
      <WorkflowHeader
        icon={<Package className="w-8 h-8 sm:w-10 sm:h-10" />}
        title="商品・サービス詳細"
        description="プロダクト名生成のための詳細情報を入力してください"
        gradient="primary"
        animationType="rotate"
        iconSize="lg"
        className="mb-6 sm:mb-8"
      />

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20 mx-2 sm:mx-0">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span>商品・サービス詳細情報</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2">
                以下の3つの項目をすべて入力してください
              </CardDescription>
            </div>
            <Button
              onClick={handleAIGenerate}
              disabled={isPendingDetails || !selectedPersona || !selectedBusinessIdea}
              variant="outline"
              size="sm"
              className="ml-4 shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isPendingDetails ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AIにおまかせ
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent
          className="space-y-4 sm:space-y-6"
          data-tutorial="product-details"
        >
          <RetryableErrorDisplay
            error={error}
            onRetry={isPendingDetails ? handleAIGenerate : handleNext}
            retryLabel={isPendingDetails ? "商品詳細を再生成" : "プロダクト名を再生成"}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label
              htmlFor="category"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              商品・サービスカテゴリー
            </Label>
            <Input
              id="category"
              value={localDetails.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="例: モバイルアプリ、Webサービス、IoTデバイス、コンサルティング..."
              className="text-sm sm:text-base py-3 sm:py-4 px-3 sm:px-4 border-2 rounded-xl min-h-[44px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label
              htmlFor="feature"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              主な特徴・機能
            </Label>
            <Input
              id="feature"
              value={localDetails.feature}
              onChange={(e) => handleInputChange("feature", e.target.value)}
              placeholder="例: AI搭載、リアルタイム分析、シンプル操作、高セキュリティ..."
              className="text-sm sm:text-base py-3 sm:py-4 px-3 sm:px-4 border-2 rounded-xl min-h-[44px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label
              htmlFor="brandImage"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              ブランドイメージ・コンセプト
            </Label>
            <Input
              id="brandImage"
              value={localDetails.brandImage}
              onChange={(e) => handleInputChange("brandImage", e.target.value)}
              placeholder="例: 革新的、信頼性、親しみやすい、プレミアム、エコフレンドリー..."
              className="text-sm sm:text-base py-3 sm:py-4 px-3 sm:px-4 border-2 rounded-xl min-h-[44px]"
            />
          </motion.div>

          {/* Preview Card */}
          {isFormValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                📋 入力内容プレビュー
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="font-medium">カテゴリー:</span>{" "}
                  {localDetails.category}
                </div>
                <div>
                  <span className="font-medium">特徴:</span>{" "}
                  {localDetails.feature}
                </div>
                <div>
                  <span className="font-medium">ブランドイメージ:</span>{" "}
                  {localDetails.brandImage}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 sm:pt-6">
            <WorkflowNavigation
              onPrevious={goToPreviousStep}
              onNext={handleNext}
              isNextDisabled={!isFormValid}
              isLoading={isPendingNames}
              nextLabel={isPendingNames ? "プロダクト名を生成中..." : "プロダクト名を生成"}
              nextVariant="gradient"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
