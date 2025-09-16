"use client";

import React, { useMemo, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Heart, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DONATION_AMOUNT,
  STRIPE_API_ENDPOINT,
} from "@/lib/config/stripe-config";
import { useTutorialStore } from "@/stores/workflow-store";

// Why: UI は金額入力と API 呼び出しのみに責務を限定。Stripe SDK 直接呼び出しはここでは redirect のみ。

export const DonationButton: React.FC = () => {
  const [amount, setAmount] = useState<number>(DONATION_AMOUNT.default);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初回ハイライト（Zustand の永続状態を利用）
  const { donationHighlightSeen, setDonationHighlightSeen } = useTutorialStore(
    (s: any) => ({
      donationHighlightSeen: (s as any).donationHighlightSeen,
      setDonationHighlightSeen: (s as any).setDonationHighlightSeen,
    })
  );

  const canSubmit = useMemo(() => {
    return (
      Number.isFinite(amount) &&
      amount >= DONATION_AMOUNT.min &&
      amount <= DONATION_AMOUNT.max
    );
  }, [amount]);

  useEffect(() => {
    // 初回訪問時の軽いアニメーションのトリガ
  }, []);

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // セッション作成を BFF に委譲（疎結合）
      const res = await fetch(STRIPE_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Session creation failed");

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
      );
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
    <Card className="p-4 sm:p-6 border-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Label htmlFor="donation-amount" className="text-sm">
            寄付金額（{DONATION_AMOUNT.min}〜{DONATION_AMOUNT.max} 円）
          </Label>
          <Input
            id="donation-amount"
            type="number"
            inputMode="numeric"
            min={DONATION_AMOUNT.min}
            max={DONATION_AMOUNT.max}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2"
          />
          {/* プリセット金額ボタン */}
          <div className="mt-3 flex flex-wrap gap-2">
            {DONATION_AMOUNT.presets.map((p) => (
              <Button
                key={p}
                type="button"
                variant={amount === p ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(p)}
              >
                {p.toLocaleString()} 円
              </Button>
            ))}
          </div>
        </div>
        <Button
          disabled={!canSubmit || isLoading}
          onClick={handleDonate}
          className="mt-6 sm:mt-8 whitespace-nowrap bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              リダイレクト中...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {amount.toLocaleString()} 円を寄付する
            </span>
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {!donationHighlightSeen && (
        <p className="mt-3 text-xs text-muted-foreground">
          ここから開発者を支援できます。はじめての方は金額を入力して寄付をお試しください。
        </p>
      )}
    </Card>
  );
};
