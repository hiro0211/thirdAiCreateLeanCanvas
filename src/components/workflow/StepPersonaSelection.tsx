"use client";

import { useCallback, useMemo, memo } from "react";
import { Users, User, Search, Lightbulb, Heart } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { usePersonaStream } from "@/hooks/usePersonaStream";
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

const getPersonaStyle = (index: number) =>
  PERSONA_STYLES[index % PERSONA_STYLES.length];

const PersonaCard = memo(
  ({
    persona,
    index,
    isSelected,
    onSelect,
  }: {
    persona: Persona;
    index: number;
    isSelected: boolean;
    onSelect: (persona: Persona) => void;
  }) => {
    const style = useMemo(() => getPersonaStyle(index), [index]);

    return (
      <SelectableCard
        item={persona}
        index={index}
        isSelected={isSelected}
        onSelect={onSelect}
        renderHeader={(persona) => (
          <div className="flex items-start space-x-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg flex-shrink-0 ${style.gradient}`}
            >
              <span className="text-2xl">{style.icon}</span>
            </motion.div>
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
                <span className="text-sm font-semibold text-gray-700">
                  人物像
                </span>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {persona.description}
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">
                  顕在ニーズ
                </span>
              </div>
              <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
                {persona.explicit_needs}
              </p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-gray-700">
                  潜在ニーズ
                </span>
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
  }
);

PersonaCard.displayName = "PersonaCard";

export function StepPersonaSelection() {
  const {
    personas,
    selectedPersona,
    selectPersona,
    goToNextStep,
    goToPreviousStep,
    streamingError,
  } = useWorkflowStore();

  const { isLoading } = usePersonaStream();

  const handlePersonaSelect = useCallback(
    (persona: Persona) => {
      selectPersona(persona);
    },
    [selectPersona]
  );

  const selectedPersonaId = selectedPersona?.id;

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

      {/* ローディング状態とエラー表示 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-8 mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Users className="w-12 h-12 text-blue-500" />
          </motion.div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            ペルソナを生成中...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {personas.length > 0 
              ? `${personas.length}/10 個のペルソナが生成されました`
              : "AIが10個のペルソナを作成しています"
            }
          </p>
          {personas.length > 0 && (
            <div className="mt-3 w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(personas.length / 10) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </motion.div>
      )}

      {streamingError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
        >
          <p className="text-red-700 dark:text-red-400 font-medium">
            エラーが発生しました
          </p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            {streamingError}
          </p>
        </motion.div>
      )}

      {/* ペルソナグリッド */}
      <AnimatePresence>
        <div
          className={LAYOUT_PRESETS.GRID.RESPONSIVE_CARDS + " mb-10"}
          data-tutorial="persona-cards"
        >
          {personas.map((persona, index) => {
            const isSelected = selectedPersonaId === persona.id;

            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                layout
              >
                <PersonaCard
                  persona={persona}
                  index={index}
                  isSelected={isSelected}
                  onSelect={handlePersonaSelect}
                />
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

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
                      ease: "easeInOut",
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
        nextLabel={isLoading ? "生成中..." : "次へ進む"}
        nextVariant="gradient"
      />
    </motion.div>
  );
}
