"use client";

import { motion } from "framer-motion";
import { Award, Download, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/stores/workflow-store";
import { ANIMATION_CONFIG, LAYOUT_CONFIG, TYPOGRAPHY_CONFIG, SHADOW_CONFIG } from "@/lib/constants/app-constants";
import { getBlockTheme, GRADIENTS, BUTTON_THEMES } from "@/lib/constants/theme-config";
import { SUCCESS_MESSAGES, ERROR_MESSAGES, UI_LABELS } from "@/lib/constants/messages";

export function StepLeanCanvasDisplay() {
  const { leanCanvasData, selectedProductName, resetWorkflow } =
    useWorkflowStore();

  if (!leanCanvasData) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">
          {ERROR_MESSAGES.LEAN_CANVAS_GENERATION_FAILED}
        </p>
        <Button onClick={resetWorkflow} className="mt-4">
          {UI_LABELS.START_OVER}
        </Button>
      </div>
    );
  }


  const CanvasBlock = ({
    number,
    title,
    content,
    className = "",
    isHalfHeight = false,
  }: {
    number: number;
    title: string;
    content: string[];
    className?: string;
    isHalfHeight?: boolean;
  }) => {
    const colors = getBlockTheme(number);

    return (
      <motion.div
        className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} p-3 flex flex-col rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${isHalfHeight ? "min-h-[180px]" : "h-full"} ${className}`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center mb-3 flex-shrink-0">
          <div
            className={`w-8 h-8 ${colors.accent} text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 shadow-md`}
          >
            {number}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-800 mb-1">{title}</h3>
            <span className="text-lg">{colors.icon}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm p-2 rounded-md border border-white/40 hover:bg-white/80 transition-all duration-200"
            >
              <p className="text-xs text-gray-700 leading-relaxed">• {item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-2 sm:px-4"
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <motion.div
          className="mx-auto mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
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
          <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-sm"
        >
          🎯 リーンキャンバス
        </motion.h1>

        {selectedProductName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl font-bold text-gray-700 mb-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl mx-2 sm:mx-0 shadow-lg backdrop-blur-sm"
          >
            <span className="text-purple-600">プロダクト名:</span>{" "}
            <span className="text-indigo-700">{selectedProductName.name}</span>
          </motion.div>
        )}
      </div>

      {/* Modern Lean Canvas Layout */}
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-2xl mb-6 sm:mb-8 min-h-[720px] p-4 backdrop-blur-sm">
        {/* Top Section */}
        <div className="grid grid-cols-5 min-h-[500px] gap-3 mb-3">
          {/* Column 1: Problems */}
          <CanvasBlock
            number={1}
            title="課題"
            content={leanCanvasData.problem}
          />

          {/* Column 2: Solution and Key Metrics */}
          <div className="flex flex-col gap-3">
            <CanvasBlock
              number={2}
              title="ソリューション"
              content={leanCanvasData.solution}
              className="flex-1"
              isHalfHeight={true}
            />
            <CanvasBlock
              number={6}
              title="主要指標"
              content={leanCanvasData.keyMetrics}
              className="flex-1"
              isHalfHeight={true}
            />
          </div>

          {/* Column 3: Unique Value Proposition */}
          <CanvasBlock
            number={3}
            title="独自の価値提案"
            content={leanCanvasData.uniqueValueProposition}
          />

          {/* Column 4: Unfair Advantage and Channels */}
          <div className="flex flex-col gap-3">
            <CanvasBlock
              number={4}
              title="圧倒的優位性"
              content={leanCanvasData.unfairAdvantage}
              className="flex-1"
              isHalfHeight={true}
            />
            <CanvasBlock
              number={7}
              title="チャネル"
              content={leanCanvasData.channels}
              className="flex-1"
              isHalfHeight={true}
            />
          </div>

          {/* Column 5: Customer Segments */}
          <CanvasBlock
            number={5}
            title="顧客セグメント"
            content={leanCanvasData.customerSegments}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 min-h-[200px] gap-3">
          <CanvasBlock
            number={8}
            title="コスト構造"
            content={leanCanvasData.costStructure}
          />
          <CanvasBlock
            number={9}
            title="収益の流れ"
            content={leanCanvasData.revenueStreams}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 px-2"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.print()}
          >
            <Download className="w-5 h-5" />
            <span>📄 PDFで保存</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
            <span>🚀 共有</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="flex items-center justify-center space-x-3 w-full sm:w-auto min-h-[50px] bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            onClick={resetWorkflow}
          >
            <RotateCcw className="w-5 h-5" />
            <span>✨ 新しいキャンバスを作成</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-emerald-200 mx-2 sm:mx-0 shadow-xl backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl mb-4"
        >
          🎊
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
          おめでとうございます！
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
          AIとの協力により、あなたのビジネスアイデアが具体的な
          <span className="font-semibold text-purple-600">
            {" "}
            リーンキャンバス
          </span>
          として形になりました。
          <br />
          このキャンバスを基に、さらなる
          <span className="font-semibold text-blue-600">ビジネス展開</span>
          を検討してみてください。
        </p>
      </motion.div>
    </motion.div>
  );
}
