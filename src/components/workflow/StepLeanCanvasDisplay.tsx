"use client";

import { motion } from "framer-motion";
import { Award, Download, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkflowStore } from "@/stores/workflow-store";

export function StepLeanCanvasDisplay() {
  const { leanCanvasData, selectedProductName, resetWorkflow } =
    useWorkflowStore();

  if (!leanCanvasData) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">
          リーンキャンバスの生成に失敗しました。
        </p>
        <Button onClick={resetWorkflow} className="mt-4">
          最初からやり直す
        </Button>
      </div>
    );
  }

  const canvasBlocks = [
    {
      title: "課題",
      content: leanCanvasData.problem,
      color: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      icon: "❗",
    },
    {
      title: "ソリューション",
      content: leanCanvasData.solution,
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      icon: "✅",
    },
    {
      title: "独自の価値提案",
      content: leanCanvasData.uniqueValueProposition,
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      icon: "💎",
    },
    {
      title: "圧倒的優位性",
      content: leanCanvasData.unfairAdvantage,
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      icon: "🚀",
    },
    {
      title: "顧客セグメント",
      content: leanCanvasData.customerSegments,
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      icon: "👥",
    },
    {
      title: "主要指標",
      content: leanCanvasData.keyMetrics,
      color: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      icon: "📊",
    },
    {
      title: "チャネル",
      content: leanCanvasData.channels,
      color: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200",
      icon: "📢",
    },
    {
      title: "コスト構造",
      content: leanCanvasData.costStructure,
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      icon: "💰",
    },
    {
      title: "収益の流れ",
      content: leanCanvasData.revenueStreams,
      color: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      icon: "💵",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-2 sm:px-4"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          className="mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gold-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
        >
          🎉 リーンキャンバス完成！
        </motion.h1>

        {selectedProductName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 mx-2 sm:mx-0"
          >
            プロダクト名:{" "}
            <span className="text-primary break-words">
              {selectedProductName.name}
            </span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg text-gray-600 px-2"
        >
          あなたのビジネスアイデアがリーンキャンバスとして完成しました
        </motion.p>
      </div>

      {/* Canvas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-full overflow-hidden">
        {canvasBlocks.map((block, index) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              className={`h-full border-2 ${block.borderColor} bg-gradient-to-br ${block.color} hover:shadow-lg transition-all duration-300 overflow-hidden`}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span className="text-lg sm:text-xl">{block.icon}</span>
                  <span className="leading-tight">{block.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <ul className="space-y-1.5 sm:space-y-2">
                  {block.content.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                      className="text-xs sm:text-sm text-gray-700 bg-white/50 p-1.5 sm:p-2 rounded-md border border-white/30 break-words overflow-wrap-anywhere leading-relaxed"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2"
      >
        <Button
          size="default"
          variant="outline"
          className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">PDFで保存</span>
        </Button>

        <Button
          size="default"
          variant="outline"
          className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">共有</span>
        </Button>

        <Button
          size="default"
          variant="gradient"
          className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
          onClick={resetWorkflow}
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">新しいキャンバスを作成</span>
        </Button>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 mx-2 sm:mx-0"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
          🎊 おめでとうございます！
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          AIとの協力により、あなたのビジネスアイデアが具体的なリーンキャンバスとして形になりました。
          このキャンバスを基に、さらなるビジネス展開を検討してみてください。
        </p>
      </motion.div>
    </motion.div>
  );
}
