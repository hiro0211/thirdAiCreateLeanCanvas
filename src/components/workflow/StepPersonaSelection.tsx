"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Search,
  Lightbulb,
  Sparkles,
  Heart,
  Target,
  Brain,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkflowStore } from "@/stores/workflow-store";
import { Persona } from "@/lib/types";
import { cn } from "@/lib/utils";

// ペルソナタイプに応じたアバターとカラー
const getPersonaStyle = (index: number) => {
  const styles = [
    { gradient: "from-purple-400 to-pink-400", icon: "👩‍💼", accent: "purple" },
    { gradient: "from-blue-400 to-cyan-400", icon: "👨‍💻", accent: "blue" },
    { gradient: "from-green-400 to-emerald-400", icon: "👩‍🏫", accent: "green" },
    { gradient: "from-orange-400 to-red-400", icon: "👨‍🎨", accent: "orange" },
    { gradient: "from-indigo-400 to-purple-400", icon: "👩‍⚕️", accent: "indigo" },
    { gradient: "from-pink-400 to-rose-400", icon: "👨‍🍳", accent: "pink" },
    { gradient: "from-teal-400 to-cyan-400", icon: "👩‍🔬", accent: "teal" },
    { gradient: "from-yellow-400 to-orange-400", icon: "👨‍🌾", accent: "yellow" },
    { gradient: "from-violet-400 to-purple-400", icon: "👩‍🚀", accent: "violet" },
    { gradient: "from-rose-400 to-pink-400", icon: "👨‍🏭", accent: "rose" },
  ];
  return styles[index % styles.length];
};

export function StepPersonaSelection() {
  const {
    personas,
    selectedPersona,
    selectPersona,
    goToNextStep,
    goToPreviousStep,
  } = useWorkflowStore();

  const handlePersonaSelect = (persona: Persona) => {
    selectPersona(persona);
  };

  const handleNext = () => {
    if (!selectedPersona) return;
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* ヘッダーセクション */}
      <div className="text-center mb-10">
        <motion.div
          className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Users className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
        >
          ターゲットペルソナを選択
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          <Sparkles className="inline-block w-5 h-5 mr-2 text-yellow-500" />
          あなたのビジネスに最も適したペルソナを選んでください
        </motion.p>
      </div>

      {/* ペルソナグリッド */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10"
        data-tutorial="persona-cards"
      >
        <AnimatePresence mode="wait">
          {personas.map((persona, index) => {
            const style = getPersonaStyle(index);
            const isSelected = selectedPersona?.id === persona.id;

            return (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer relative overflow-hidden h-full",
                    "transition-all duration-300",
                    "hover:shadow-xl",
                    "border-2",
                    isSelected
                      ? "border-blue-500 shadow-xl ring-4 ring-blue-500/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                  onClick={() => handlePersonaSelect(persona)}
                >
                  {/* 選択状態の背景ハイライト */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"
                    />
                  )}

                  {/* 選択インジケーター */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      {/* アバター */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center",
                          "bg-gradient-to-br shadow-lg flex-shrink-0",
                          style.gradient
                        )}
                      >
                        <span className="text-2xl">{style.icon}</span>
                      </motion.div>

                      {/* タイトル */}
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                          ペルソナ {persona.id}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {String(persona.id).padStart(3, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* 人物像セクション */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          人物像
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                        {persona.description}
                      </p>
                    </motion.div>

                    {/* ニーズセクション */}
                    <div className="space-y-3">
                      {/* 顕在ニーズ */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Search className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            顕在ニーズ
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            {persona.explicit_needs}
                          </p>
                        </div>
                      </motion.div>

                      {/* 潜在ニーズ */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            潜在ニーズ
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            {persona.implicit_needs}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* インサイトタグ */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                        <Target className="w-3 h-3 mr-1" />
                        ターゲット
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                        <Brain className="w-3 h-3 mr-1" />
                        インサイト
                      </span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
                      ease: "easeInOut",
                    }}
                    className="flex-shrink-0"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                      <Heart className="w-5 h-5 text-red-500 mr-2" />
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
      <div className="flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">戻る</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleNext}
            disabled={!selectedPersona}
            size="lg"
            className={cn(
              "flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
              "hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
              "text-white shadow-xl hover:shadow-2xl",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <span>次へ進む</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
