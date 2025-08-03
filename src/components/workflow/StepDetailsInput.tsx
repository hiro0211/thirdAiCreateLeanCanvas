'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflowStore } from '@/stores/workflow-store';
import { ProductDetails } from '@/lib/types';

export function StepDetailsInput() {
  const {
    productDetails,
    isLoading,
    error,
    setProductDetails,
    generateProductNames,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const [localDetails, setLocalDetails] = useState<ProductDetails>(productDetails);

  const handleInputChange = (field: keyof ProductDetails, value: string) => {
    setLocalDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = localDetails.category.trim() && 
                     localDetails.feature.trim() && 
                     localDetails.brandImage.trim();

  const handleNext = async () => {
    if (!isFormValid) return;
    
    setProductDetails(localDetails);
    await generateProductNames();
    if (!error) {
      goToNextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Package className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          商品・サービス詳細
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          プロダクト名生成のための詳細情報を入力してください
        </p>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>商品・サービス詳細情報</span>
          </CardTitle>
          <CardDescription>
            以下の3つの項目をすべて入力してください
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6" data-tutorial="product-details">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label htmlFor="category" className="text-base font-semibold text-gray-700">
              商品・サービスカテゴリー
            </Label>
            <Input
              id="category"
              value={localDetails.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="例: モバイルアプリ、Webサービス、IoTデバイス、コンサルティング..."
              className="text-base py-4 px-4 border-2 rounded-xl"
            />
            <p className="text-sm text-gray-500">
              あなたの商品やサービスがどのようなカテゴリーに属するかを記入してください
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label htmlFor="feature" className="text-base font-semibold text-gray-700">
              主な特徴・機能
            </Label>
            <Input
              id="feature"
              value={localDetails.feature}
              onChange={(e) => handleInputChange('feature', e.target.value)}
              placeholder="例: AI搭載、リアルタイム分析、シンプル操作、高セキュリティ..."
              className="text-base py-4 px-4 border-2 rounded-xl"
            />
            <p className="text-sm text-gray-500">
              商品・サービスの最も重要な特徴や機能を記入してください
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label htmlFor="brandImage" className="text-base font-semibold text-gray-700">
              ブランドイメージ・コンセプト
            </Label>
            <Input
              id="brandImage"
              value={localDetails.brandImage}
              onChange={(e) => handleInputChange('brandImage', e.target.value)}
              placeholder="例: 革新的、信頼性、親しみやすい、プレミアム、エコフレンドリー..."
              className="text-base py-4 px-4 border-2 rounded-xl"
            />
            <p className="text-sm text-gray-500">
              どのようなブランドイメージを目指しているかを記入してください
            </p>
          </motion.div>

          {/* Preview Card */}
          {isFormValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <h4 className="font-semibold text-gray-800 mb-2">📋 入力内容プレビュー</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">カテゴリー:</span> {localDetails.category}</div>
                <div><span className="font-medium">特徴:</span> {localDetails.feature}</div>
                <div><span className="font-medium">ブランドイメージ:</span> {localDetails.brandImage}</div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>戻る</span>
            </Button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleNext}
                disabled={!isFormValid || isLoading}
                size="lg"
                className="flex items-center space-x-2 px-8"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                <span>
                  {isLoading ? 'プロダクト名を生成中...' : 'プロダクト名を生成'}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}