"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WorkflowNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  showPrevious?: boolean;
  nextVariant?: "default" | "gradient" | "outline";
  className?: string;
}

const BUTTON_VARIANTS = {
  default: "bg-primary hover:bg-primary/90",
  gradient:
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
};

export function WorkflowNavigation({
  onPrevious,
  onNext,
  isNextDisabled = false,
  isPreviousDisabled = false,
  isLoading = false,
  nextLabel = "次へ",
  previousLabel = "戻る",
  showPrevious = true,
  nextVariant = "gradient",
  className,
}: WorkflowNavigationProps) {
  return (
    <div className={cn("mt-6 md:mt-8", className)}>
      {/* Mobile Layout - Stacked */}
      <div className="flex md:hidden flex-col space-y-4">
        {/* Next Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            size="lg"
            className={cn(
              "w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              BUTTON_VARIANTS[nextVariant]
            )}
          >
            <span className="text-base">
              {isLoading ? "処理中..." : nextLabel}
            </span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </motion.div>

        {/* Previous Button */}
        {showPrevious && onPrevious && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isPreviousDisabled || isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{previousLabel}</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden md:flex justify-between items-center">
        {/* Previous Button */}
        {showPrevious && onPrevious ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isPreviousDisabled || isLoading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{previousLabel}</span>
            </Button>
          </motion.div>
        ) : (
          <div /> // Spacer for alignment
        )}

        {/* Next Button */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            size="lg"
            className={cn(
              "flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              BUTTON_VARIANTS[nextVariant]
            )}
          >
            <span>{isLoading ? "処理中..." : nextLabel}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
