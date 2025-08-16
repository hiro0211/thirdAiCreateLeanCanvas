"use client";

import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { WorkflowStepper } from "@/components/workflow/WorkflowStepper";
import { TutorialProvider } from "@/components/tutorial/TutorialProvider";
import { TutorialGuide } from "@/components/tutorial/TutorialGuide";
import { useWorkflowStore } from "@/stores/workflow-store";

// 動的インポートでコード分割を実現
const StepKeywordInput = lazy(() => 
  import("@/components/workflow/StepKeywordInput").then(module => ({ 
    default: module.StepKeywordInput 
  }))
);

const StepPersonaSelection = lazy(() => 
  import("@/components/workflow/StepPersonaSelection").then(module => ({ 
    default: module.StepPersonaSelection 
  }))
);

const StepCreativityLevelSelection = lazy(() => 
  import("@/components/workflow/StepCreativityLevelSelection").then(module => ({ 
    default: module.StepCreativityLevelSelection 
  }))
);

const StepBusinessIdeaSelection = lazy(() => 
  import("@/components/workflow/StepBusinessIdeaSelection").then(module => ({ 
    default: module.StepBusinessIdeaSelection 
  }))
);

const StepDetailsInput = lazy(() => 
  import("@/components/workflow/StepDetailsInput").then(module => ({ 
    default: module.StepDetailsInput 
  }))
);

const StepProductNameSelection = lazy(() => 
  import("@/components/workflow/StepProductNameSelection").then(module => ({ 
    default: module.StepProductNameSelection 
  }))
);

const StepLeanCanvasDisplay = lazy(() => 
  import("@/components/workflow/StepLeanCanvasDisplay").then(module => ({ 
    default: module.StepLeanCanvasDisplay 
  }))
);

const stepComponents = {
  keyword: StepKeywordInput,
  "persona-selection": StepPersonaSelection,
  "creativity-level-selection": StepCreativityLevelSelection,
  "business-idea-selection": StepBusinessIdeaSelection,
  "details-input": StepDetailsInput,
  "product-name-selection": StepProductNameSelection,
  "canvas-display": StepLeanCanvasDisplay,
};

// ローディングコンポーネント
const StepLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default function HomePage() {
  const { currentStep } = useWorkflowStore();
  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <TutorialProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
        <Header />

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full overflow-hidden">
          {/* Progress Stepper */}
          <div className="no-print">
            <WorkflowStepper currentStep={currentStep} />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 sm:mt-8"
            >
              <Suspense fallback={<StepLoadingFallback />}>
                <CurrentStepComponent />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Background Decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-3/4 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Footer */}
        <footer className="no-print border-t bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  © 2025 AI Lean Canvas Creator. Powered by{" "}
                  <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
                    Dify AI
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-muted-foreground">
                <span>Made with ❤️ for entrepreneurs</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Tutorial Guide */}
        <TutorialGuide />
      </div>
    </TutorialProvider>
  );
}
