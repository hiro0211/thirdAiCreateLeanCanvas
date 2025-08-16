"use client";

import { motion } from "framer-motion";
import { Sparkles, RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useWorkflowStore } from "@/stores/workflow-store";
import { useTutorialStore } from "@/stores/workflow-store";

export function Header() {
  const { currentStep, resetWorkflow } = useWorkflowStore();
  const { startTutorial } = useTutorialStore();

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
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 transition-transform duration-200 ease-out hover:scale-105"
        >
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-full flex items-center justify-center"
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
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Lean Canvas
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Powered by Dify AI
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center space-x-1 sm:space-x-2"
          data-tutorial="header-actions"
        >
          <div className="transition-all duration-200 ease-out hover:scale-105 active:scale-95">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTutorial}
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-200 dark:border-blue-800 h-8 sm:h-9 px-2 sm:px-3"
            >
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
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
                <span className="hidden md:inline text-xs sm:text-sm">
                  リセット
                </span>
              </Button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
