'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TutorialModal } from './TutorialModal';
import { useTutorialStore } from '@/stores/workflow-store';

export function TutorialGuide() {
  const { isActive, hasCompleted, isSkipped, startTutorial } = useTutorialStore();

  // 初回訪問時にチュートリアルを自動開始（完了していない場合）
  useEffect(() => {
    const isFirstVisit = !hasCompleted && !isSkipped;
    if (isFirstVisit) {
      // 少し遅延させてUIが落ち着いてから開始
      const timer = setTimeout(() => {
        startTutorial();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasCompleted, isSkipped, startTutorial]);

  // チュートリアル用のCSS を動的に追加
  useEffect(() => {
    if (isActive) {
      const style = document.createElement('style');
      style.textContent = `
        .tutorial-highlight {
          position: relative;
          z-index: 9998 !important;
          animation: tutorialPulse 2s infinite;
        }
        
        @keyframes tutorialPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
        
        .tutorial-spotlight {
          position: relative;
          z-index: 9998 !important;
        }
        
        body.tutorial-active {
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('tutorial-active');

      return () => {
        document.head.removeChild(style);
        document.body.classList.remove('tutorial-active');
        // すべてのハイライトを削除
        const highlighted = document.querySelectorAll('.tutorial-highlight, .tutorial-spotlight');
        highlighted.forEach(el => {
          el.classList.remove('tutorial-highlight', 'tutorial-spotlight');
        });
      };
    }
  }, [isActive]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TutorialModal />
        </motion.div>
      )}
    </AnimatePresence>
  );
}