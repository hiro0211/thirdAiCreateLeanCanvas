"use client";

import { useCallback } from "react";
import { Users, User, Search, Lightbulb, Heart } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { Persona } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { WorkflowHeader, WorkflowNavigation, SelectableCard } from "./shared";
import { LAYOUT_PRESETS } from "@/lib/constants/unified-presets";

const PERSONA_STYLES = [
  { gradient: "from-purple-400 to-pink-400", icon: "👩‍💼" },
  { gradient: "from-blue-400 to-cyan-400", icon: "👨‍💻" },
  { gradient: "from-green-400 to-emerald-400", icon: "👩‍🏫" },
  { gradient: "from-orange-400 to-red-400", icon: "👨‍🎨" },
  { gradient: "from-indigo-400 to-purple-400", icon: "👩‍⚕️" },
  { gradient: "from-pink-400 to-rose-400", icon: "👨‍🍳" },
  { gradient: "from-teal-400 to-cyan-400", icon: "👩‍🔬" },
  { gradient: "from-yellow-400 to-orange-400", icon: "👨‍🌾" },
  { gradient: "from-violet-400 to-purple-400", icon: "👩‍🚀" },
  { gradient: "from-rose-400 to-pink-400", icon: "👨‍🏭" },
];

const getPersonaStyle = (index: number) => PERSONA_STYLES[index % PERSONA_STYLES.length];

export function StepPersonaSelection() {
  const {
    personas,
    selectedPersona,
    selectPersona,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handlePersonaSelect = useCallback((persona: Persona) => {
    selectPersona(persona);
  }, [selectPersona]);

  const handleNext = useCallback(() => {
    if (!selectedPersona) return;
    goToNextStep();
  }, [selectedPersona, goToNextStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={LAYOUT_PRESETS.CONTAINER.MAIN}
    >
      {/* ヘッダーセクション */}
      <WorkflowHeader
        icon={<Users className="w-10 h-10" />}
        title="ペルソナを選択"
        description="最も共感できるペルソナを選んでください"
        gradient="primary"
        animationType="bounce"
        iconSize="lg"
        className="mb-10"
      />

      {/* ペルソナグリッド */}
      <div
        className={LAYOUT_PRESETS.GRID.RESPONSIVE_CARDS + " mb-10"}
        data-tutorial="persona-cards"
      >
        {personas.map((persona, index) => {
          const style = getPersonaStyle(index);
          const isSelected = selectedPersona?.id === persona.id;

          return (
            <SelectableCard
              key={persona.id}
              item={persona}
              index={index}
              isSelected={isSelected}
              onSelect={handlePersonaSelect}
              renderHeader={(persona) => (
                <div className="flex items-start space-x-4">
                  {/* アバター */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0 ${style.gradient}`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                  </motion.div>

                  {/* タイトル */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      ペルソナ {persona.id}
                    </h3>
                  </div>
                </div>
              )}
              renderContent={(persona) => (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">人物像</span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {persona.description}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-700">顕在ニーズ</span>
                    </div>
                    <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
                      {persona.explicit_needs}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-semibold text-gray-700">潜在ニーズ</span>
                    </div>
                    <p className="text-xs text-gray-700 bg-amber-50 p-2 rounded border border-amber-200">
                      {persona.implicit_needs}
                    </p>
                  </div>
                </div>
              )}
              animationDelay={0.08}
            />
          );
        })}
      </div>

      {/* 選択されたペルソナのハイライト */}
      <AnimatePresence>
        {selectedPersona && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8 mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" as const,
                    }}
                    className="flex-shrink-0"
                  >
                    <Heart className="w-10 h-10 text-red-500" />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                      選択されたペルソナ
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedPersona.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                        顕在: {selectedPersona.explicit_needs.substring(0, 30)}
                        ...
                      </span>
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                        潜在: {selectedPersona.implicit_needs.substring(0, 30)}
                        ...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ナビゲーションボタン */}
      <WorkflowNavigation
        onPrevious={goToPreviousStep}
        onNext={handleNext}
        isNextDisabled={!selectedPersona}
        nextLabel="次へ進む"
        nextVariant="gradient"
      />
    </motion.div>
  );
}
