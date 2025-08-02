'use client';

import { motion } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useWorkflowStore } from '@/stores/workflow-store';

export function Header() {
  const { currentStep, resetWorkflow } = useWorkflowStore();

  const handleReset = () => {
    if (window.confirm('ワークフローをリセットして最初からやり直しますか？')) {
      resetWorkflow();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Title */}
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Lean Canvas
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Dify AI
            </p>
          </div>
        </motion.div>

        {/* Navigation Info */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {currentStep === 'keyword' && 'キーワード入力'}
            {currentStep === 'persona-selection' && 'ペルソナ選択'}
            {currentStep === 'business-idea-selection' && 'ビジネスアイデア選択'}
            {currentStep === 'details-input' && '詳細入力'}
            {currentStep === 'product-name-selection' && 'プロダクト名選択'}
            {currentStep === 'canvas-display' && 'リーンキャンバス表示'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {currentStep !== 'keyword' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">リセット</span>
              </Button>
            </motion.div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}