"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
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
import { useGeneratePersonas } from "@/hooks/useApiMutations";
import { RetryableErrorDisplay } from "@/components/ui/error-display";

export function StepKeywordInput() {
  const { keyword, error, setKeyword, setPersonas, goToNextStep, setError } =
    useWorkflowStore();

  const [localKeyword, setLocalKeyword] = useState(keyword);
  const generatePersonasMutation = useGeneratePersonas();

  // コンポーネント初期化時にエラー状態をクリア
  useEffect(() => {
    setError(null); // ワークフローストアのエラーをクリア
    if (generatePersonasMutation.error) {
      generatePersonasMutation.reset(); // ミューテーションのエラーをクリア
    }
  }, [setError]);

  const handleSubmit = async () => {
    if (!localKeyword.trim()) return;

    setKeyword(localKeyword.trim());

    try {
      const personas = await generatePersonasMutation.mutateAsync(
        localKeyword.trim()
      );
      setPersonas(personas);
      goToNextStep();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "ペルソナ生成に失敗しました"
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !generatePersonasMutation.isPending) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20">
        <CardHeader className="text-center pb-6">
          <motion.div
            className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AIリーンキャンバス作成
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            あなたのビジネスアイデアを具体化しましょう
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="keyword"
              className="text-base font-semibold text-gray-700"
            >
              ビジネスキーワードを入力してください
            </Label>
            <div className="relative" data-tutorial="keyword-input">
              <Input
                id="keyword"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="例: サステナブル、AI、健康管理、教育..."
                className="text-lg py-6 px-4 border-2 rounded-xl shadow-sm focus:shadow-md transition-all duration-300"
                disabled={generatePersonasMutation.isPending}
              />
              {localKeyword && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  image.png                </motion.div>
              )}
            </div>
          </div>

          <RetryableErrorDisplay
            error={
              error ||
              (generatePersonasMutation.error instanceof Error
                ? generatePersonasMutation.error.message
                : generatePersonasMutation.error
                  ? "ペルソナ生成中に不明なエラーが発生しました"
                  : null)
            }
            onRetry={handleSubmit}
            retryLabel="ペルソナを再生成"
          />

          <motion.div
            className="pt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={
                !localKeyword.trim() || generatePersonasMutation.isPending
              }
              size="lg"
              className="w-full text-lg py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-tutorial="generate-personas"
            >
              {generatePersonasMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <ArrowRight className="w-5 h-5 mr-2" />
              )}
              {generatePersonasMutation.isPending
                ? "ペルソナを生成中..."
                : "ペルソナを生成"}
            </Button>
          </motion.div>

          {/* Helpful Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
          >
            <h4 className="font-semibold text-gray-800 mb-2">💡 ヒント</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 具体的な業界や技術に関するキーワードが効果的です</li>
              <li>• 複数のキーワードを組み合わせることも可能です</li>
              <li>
                • 新しいトレンドや社会課題に関連するキーワードもおすすめです
              </li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
