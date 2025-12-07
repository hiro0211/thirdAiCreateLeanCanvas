"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkflowStore } from "@/stores/workflow-store";
import { generatePersonasAction } from "@/app/actions";
import { RetryableErrorDisplay } from "@/components/ui/error-display";
import { WorkflowHeader } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

export function StepKeywordInput() {
  const { keyword, challenges, notes, error, setInitialInputs, setPersonas, goToNextStep, setError } =
    useWorkflowStore();

  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [localChallenges, setLocalChallenges] = useState(challenges);
  const [localNotes, setLocalNotes] = useState(notes);
  const [isPending, startTransition] = useTransition();

  // コンポーネント初期化時にエラー状態をクリア（マウント時のみ実行）
  useEffect(() => {
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(() => {
    if (!localKeyword.trim() || isPending) return;

    setInitialInputs(localKeyword.trim(), localChallenges.trim(), localNotes.trim());

    startTransition(async () => {
      const result = await generatePersonasAction({
        keyword: localKeyword.trim(),
        challenges: localChallenges.trim() || undefined,
        notes: localNotes.trim() || undefined,
      });

      if (result.success) {
        setPersonas(result.data);
        goToNextStep();
      } else {
        setError(result.error);
      }
    });
  }, [localKeyword, localChallenges, localNotes, isPending, setInitialInputs, setPersonas, goToNextStep, setError]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleSubmit();
    }
  }, [handleSubmit, isPending]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.CENTERED}
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
              rotate: { duration: 20, repeat: Infinity, ease: "linear" as const },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AIリーンキャンバス作成
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            ビジネスアイデアを具体化しましょう
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="keyword"
              className="text-base font-semibold text-gray-700"
            >
              興味のあるキーワードを入力してください
            </Label>
            <div className="relative" data-tutorial="keyword-input">
              <Input
                id="keyword"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="例: サステナブル、ダイエット、属人化、健康管理、教育..."
                className="text-lg py-6 px-4 border-2 rounded-xl shadow-sm focus:shadow-md transition-all duration-300"
                disabled={isPending}
              />
              {localKeyword && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                >
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="challenges"
              className="text-base font-semibold text-gray-700"
            >
              顧客課題（任意）
            </Label>
            <Textarea
              id="challenges"
              value={localChallenges}
              onChange={(e) => setLocalChallenges(e.target.value)}
              placeholder="例: 時間がない、コストが高い、使い方がわからない..."
              className="text-base border-2 rounded-xl shadow-sm focus:shadow-md transition-all duration-300 min-h-[100px]"
              disabled={isPending}
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="notes"
              className="text-base font-semibold text-gray-700"
            >
              補足情報（任意）
            </Label>
            <Textarea
              id="notes"
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="例: ターゲット地域、業界の特性、その他の背景情報..."
              className="text-base border-2 rounded-xl shadow-sm focus:shadow-md transition-all duration-300 min-h-[100px]"
              disabled={isPending}
            />
          </div>

          <RetryableErrorDisplay
            error={error}
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
              disabled={!localKeyword.trim() || isPending}
              size="lg"
              className="w-full text-lg py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-tutorial="generate-personas"
            >
              {isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                  className="mr-2"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              {isPending ? "ペルソナを生成中..." : "ペルソナを生成"}
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
              <li>• 複数のキーワードを組み合わせられます</li>
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
