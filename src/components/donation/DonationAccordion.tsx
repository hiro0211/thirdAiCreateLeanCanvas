"use client";

import React, { useMemo, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Heart, AlertCircle, Loader2, X, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DONATION_AMOUNT,
  STRIPE_API_ENDPOINT,
} from "@/lib/config/stripe-config";
import { useTutorialStore } from "@/stores/workflow-store";

interface DonationAccordionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationAccordion: React.FC<DonationAccordionProps> = ({
  isOpen,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(DONATION_AMOUNT.default);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setDonationHighlightSeen } = useTutorialStore((s: any) => ({
    setDonationHighlightSeen: (s as any).setDonationHighlightSeen,
  }));

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(amount) &&
      amount >= DONATION_AMOUNT.min &&
      amount <= DONATION_AMOUNT.max
    );
  }, [amount]);

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publicKey) {
        throw new Error(
          "Stripe公開キーが設定されていません。管理者にお問い合わせください。"
        );
      }

      const res = await fetch(STRIPE_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Session creation failed");

      const stripe = await loadStripe(publicKey);
      if (!stripe) throw new Error("Stripe.js failed to load");

      setDonationHighlightSeen(true);

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (redirectError) throw redirectError;
    } catch (e: any) {
      setError(e?.message || "寄付の処理に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-full left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-lg"
        >
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-2xl mx-auto">
              <Card className="p-4 sm:p-6 border-2 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 dark:from-pink-900/10 dark:via-purple-900/10 dark:to-blue-900/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        開発を応援する
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        このアプリの継続開発をサポートしていただけます
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* プリセット金額ボタン */}
                  <div>
                    <Label className="text-sm font-medium">
                      金額を選択してください
                    </Label>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {DONATION_AMOUNT.presets.map((p) => (
                        <Button
                          key={p}
                          type="button"
                          variant={amount === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAmount(p)}
                          className={`text-xs ${
                            amount === p
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                              : ""
                          }`}
                        >
                          ¥{p.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* カスタム金額入力 */}
                  <div>
                    <Label htmlFor="custom-amount" className="text-sm">
                      または任意の金額（{DONATION_AMOUNT.min}〜
                      {DONATION_AMOUNT.max.toLocaleString()} 円）
                    </Label>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          id="custom-amount"
                          type="number"
                          inputMode="numeric"
                          min={DONATION_AMOUNT.min}
                          max={DONATION_AMOUNT.max}
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="text-center font-mono"
                        />
                      </div>
                      <Button
                        disabled={!canSubmit || isLoading}
                        onClick={handleDonate}
                        className="px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            処理中...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />¥
                            {amount.toLocaleString()} で寄付する
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* エラー表示 */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}

                  {/* 説明文 */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      決済は Stripe
                      によって安全に処理されます。寄付はアプリの改善と継続運用に活用されます。
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
