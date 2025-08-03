'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTutorialStore } from '@/stores/workflow-store';

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { hasCompleted, isSkipped, startTutorial, skipTutorial } = useTutorialStore();
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初回訪問時のウェルカムモーダル表示判定
  useEffect(() => {
    if (!mounted) return;
    
    const isFirstVisit = !hasCompleted && !isSkipped;
    if (isFirstVisit) {
      // 少し遅延させてUIが落ち着いてから表示
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, hasCompleted, isSkipped]);

  const handleStartTutorial = () => {
    setShowWelcome(false);
    startTutorial();
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    skipTutorial();
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* ウェルカムモーダル */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleSkipWelcome}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Lean Canvasへようこそ！
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      AIと一緒にステップバイステップで<br />
                      <span className="font-semibold text-foreground">リーンキャンバスを作成</span>しましょう
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">✨ AI生成</div>
                        <div className="text-blue-600 dark:text-blue-400">ペルソナ・アイデア・プロダクト名</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-lg">
                        <div className="font-semibold text-purple-700 dark:text-purple-300">🎯 簡単操作</div>
                        <div className="text-purple-600 dark:text-purple-400">選択するだけで完成</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 pt-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={handleStartTutorial}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        チュートリアルを開始
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSkipWelcome}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        スキップして始める
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-muted-foreground"
                  >
                    いつでもヘッダーの「？」アイコンからチュートリアルを再表示できます
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}