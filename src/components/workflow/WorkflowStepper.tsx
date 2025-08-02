'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { WorkflowStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
}

const steps = [
  { key: 'keyword', label: 'キーワード入力' },
  { key: 'persona-selection', label: 'ペルソナ選択' },
  { key: 'business-idea-selection', label: 'ビジネスアイデア選択' },
  { key: 'details-input', label: '詳細入力' },
  { key: 'product-name-selection', label: 'プロダクト名選択' },
  { key: 'canvas-display', label: 'リーンキャンバス' },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <motion.div
                className={cn(
                  'relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                  isCompleted && 'bg-gradient-primary border-transparent text-white shadow-lg',
                  isCurrent && 'bg-gradient-primary border-transparent text-white shadow-xl scale-110',
                  isUpcoming && 'border-gray-300 bg-white text-gray-400'
                )}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  boxShadow: isCurrent ? '0 8px 25px rgba(102, 126, 234, 0.6)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <motion.span
                className={cn(
                  'mt-3 text-sm font-medium text-center px-2 transition-colors duration-300',
                  (isCompleted || isCurrent) && 'text-primary',
                  isUpcoming && 'text-gray-400'
                )}
                animate={{
                  color: (isCompleted || isCurrent) ? '#667eea' : '#9ca3af',
                }}
              >
                {step.label}
              </motion.span>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 -z-10">
                  <motion.div
                    className="h-full bg-gradient-primary"
                    initial={{ width: '0%' }}
                    animate={{
                      width: index < currentStepIndex ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.5, delay: index < currentStepIndex ? 0.2 : 0 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}