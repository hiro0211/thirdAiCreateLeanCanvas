"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, RotateCcw, HelpCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useWorkflowStore } from "@/stores/workflow-store";
import { useTutorialStore } from "@/stores/workflow-store";
import { DonationAccordion } from "@/components/donation/DonationAccordion";

export function Header() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const { currentStep, resetWorkflow } = useWorkflowStore();
  const { startTutorial, donationHighlightSeen } = useTutorialStore();

  const handleReset = () => {
    if (window.confirm("ワークフローをリセットして最初からやり直しますか？")) {
      resetWorkflow();
    }
  };

  const handleStartTutorial = () => {
    startTutorial();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 transition-transform duration-200 ease-out hover:scale-105 min-w-0 flex-1">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
              AI Lean Canvas
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Powered by Dify AI
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
          data-tutorial="header-actions"
        >
          {/* 目立つ寄付ボタン */}
          <div className="relative">
            <motion.div
              className="transition-all duration-200 ease-out hover:scale-105 active:scale-95"
              animate={
                !donationHighlightSeen ? { scale: [1, 1.05, 1] } : { scale: 1 }
              }
              transition={{
                duration: 2,
                repeat: !donationHighlightSeen ? Infinity : 0,
              }}
            >
              <Button
                onClick={() => setIsDonationOpen(!isDonationOpen)}
                className={`relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl font-medium h-8 sm:h-9 px-3 sm:px-4 ${
                  isDonationOpen ? "ring-2 ring-purple-300" : ""
                }`}
              >
                <Heart className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">寄付をする</span>
                {!donationHighlightSeen && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </Button>
            </motion.div>
          </div>
          <div className="transition-all duration-200 ease-out hover:scale-105 active:scale-95">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTutorial}
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-200 dark:border-blue-800 h-8 sm:h-9 px-2 sm:px-3"
            >
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden lg:inline text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                チュートリアル
              </span>
            </Button>
          </div>
          {currentStep !== "keyword" && (
            <div className="transition-all duration-200 ease-out hover:scale-105 active:scale-95">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-9 px-2 sm:px-3"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden lg:inline text-xs sm:text-sm">
                  リセット
                </span>
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
      {/* アコーディオン式寄付フォーム */}
      <DonationAccordion
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </motion.header>
  );
}
