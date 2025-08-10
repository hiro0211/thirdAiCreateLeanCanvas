// エラー表示専用コンポーネント

"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "./button";
import { ANIMATION_CONFIG } from "@/lib/constants/app-constants";
import { UI_LABELS } from "@/lib/constants/messages";

export interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  dismissible?: boolean;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  retryLabel = UI_LABELS.RETRY,
  dismissible = false,
  className = "",
  variant = "default",
}: ErrorDisplayProps) {
  if (!error) return null;

  const baseClasses = "bg-red-50 border border-red-200 rounded-lg text-red-700";
  const variantClasses = {
    default: "p-4 mb-6",
    compact: "p-3 mb-4",
    inline: "p-2 mb-2 text-sm",
  };

  return (
    <motion.div
      initial={{ opacity: ANIMATION_CONFIG.INITIAL_OPACITY, x: -20 }}
      animate={{ opacity: ANIMATION_CONFIG.FINAL_OPACITY, x: 0 }}
      exit={{ opacity: ANIMATION_CONFIG.INITIAL_OPACITY, x: -20 }}
      transition={{ duration: ANIMATION_CONFIG.MEDIUM_DURATION }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <AlertCircle
          className={`flex-shrink-0 mt-0.5 ${variant === "inline" ? "w-4 h-4" : "w-5 h-5"} text-red-500`}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <p
            className={`${variant === "inline" ? "text-xs" : "text-sm"} leading-relaxed break-words`}
          >
            {error}
          </p>

          {(onRetry || dismissible) && variant !== "inline" && (
            <div className="flex items-center space-x-2 mt-3">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="text-red-700 border-red-300 hover:border-red-400 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {retryLabel}
                </Button>
              )}

              {dismissible && onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                >
                  <X className="w-4 h-4 mr-1" />
                  閉じる
                </Button>
              )}
            </div>
          )}
        </div>

        {dismissible && onDismiss && variant === "inline" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <X className="w-3 h-3" />
            <span className="sr-only">閉じる</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// 使いやすいプリセット
export function InlineErrorDisplay({
  error,
  onDismiss,
}: Pick<ErrorDisplayProps, "error" | "onDismiss">) {
  return (
    <ErrorDisplay
      error={error}
      variant="inline"
      dismissible={!!onDismiss}
      onDismiss={onDismiss}
    />
  );
}

export function CompactErrorDisplay({
  error,
  onRetry,
  retryLabel,
}: Pick<ErrorDisplayProps, "error" | "onRetry" | "retryLabel">) {
  return (
    <ErrorDisplay
      error={error}
      variant="compact"
      onRetry={onRetry}
      retryLabel={retryLabel}
    />
  );
}

export function RetryableErrorDisplay({
  error,
  onRetry,
  retryLabel,
}: Pick<ErrorDisplayProps, "error" | "onRetry" | "retryLabel">) {
  return (
    <ErrorDisplay
      error={error}
      onRetry={onRetry}
      retryLabel={retryLabel}
      dismissible={false}
    />
  );
}
