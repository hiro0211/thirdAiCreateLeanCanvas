"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface WorkflowHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: 'primary' | 'secondary' | 'accent';
  animationType?: 'rotate' | 'scale' | 'bounce';
  iconSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GRADIENT_PRESETS = {
  primary: "from-indigo-500 via-purple-500 to-pink-500",
  secondary: "from-blue-500 to-cyan-500", 
  accent: "from-purple-600 via-blue-600 to-indigo-600"
};

const ICON_ANIMATIONS = {
  rotate: {
    animate: { rotate: [0, 360] },
    transition: { duration: 20, repeat: Infinity, ease: "linear" as const }
  },
  scale: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
  },
  bounce: {
    animate: { 
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0]
    },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
  }
};

const ICON_SIZES = {
  sm: { container: "w-12 h-12", icon: "w-6 h-6" },
  md: { container: "w-16 h-16", icon: "w-8 h-8" },
  lg: { container: "w-20 h-20", icon: "w-10 h-10" }
};

export function WorkflowHeader({
  icon,
  title,
  description,
  gradient = 'primary',
  animationType = 'scale',
  iconSize = 'md',
  className
}: WorkflowHeaderProps) {
  const iconAnimation = ICON_ANIMATIONS[animationType];
  const sizeClasses = ICON_SIZES[iconSize];
  const gradientClass = GRADIENT_PRESETS[gradient];

  return (
    <div className={cn("text-center mb-8", className)}>
      <motion.div
        className={cn(
          "mx-auto mb-4 bg-gradient-to-br rounded-full flex items-center justify-center shadow-2xl",
          sizeClasses.container,
          gradientClass
        )}
        animate={iconAnimation.animate}
        transition={iconAnimation.transition}
      >
        <div className={cn("text-white", sizeClasses.icon)}>
          {icon}
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
      >
        {title}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    </div>
  );
}