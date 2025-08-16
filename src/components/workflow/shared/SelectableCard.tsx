"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SelectableCardProps<T> {
  item: T;
  index: number;
  isSelected: boolean;
  onSelect: (item: T) => void;
  renderHeader?: (item: T, isSelected: boolean) => React.ReactNode;
  renderContent: (item: T, isSelected: boolean) => React.ReactNode;
  className?: string;
  cardClassName?: string;
  selectionIndicator?: 'checkmark' | 'glow' | 'both';
  animationDelay?: number;
}

const SELECTION_STYLES = {
  selected: "border-primary shadow-xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-accent/5",
  unselected: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
};

const SelectableCardComponent = <T,>({
  item,
  index,
  isSelected,
  onSelect,
  renderHeader,
  renderContent,
  className,
  cardClassName,
  selectionIndicator = 'both',
  animationDelay = 0.1
}: SelectableCardProps<T>) => {
  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  const showCheckmark = selectionIndicator === 'checkmark' || selectionIndicator === 'both';
  const showGlow = selectionIndicator === 'glow' || selectionIndicator === 'both';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * animationDelay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn("transition-transform duration-200 ease-out", className)}
    >
      <Card
        className={cn(
          "cursor-pointer relative overflow-hidden h-full border-2 transition-all duration-300 hover:shadow-xl",
          isSelected && showGlow ? SELECTION_STYLES.selected : SELECTION_STYLES.unselected,
          cardClassName
        )}
        onClick={handleClick}
      >
        {/* Selection Glow Background */}
        {isSelected && showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
          />
        )}

        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && showCheckmark && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        {renderHeader && (
          <CardHeader className="relative">
            {renderHeader(item, isSelected)}
          </CardHeader>
        )}

        {/* Content */}
        <CardContent className="relative space-y-4">
          {renderContent(item, isSelected)}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// メモ化でパフォーマンス最適化
export const SelectableCard = memo(SelectableCardComponent) as <T>(
  props: SelectableCardProps<T>
) => JSX.Element;