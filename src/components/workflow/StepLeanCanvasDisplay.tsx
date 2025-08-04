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
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-gold-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl"
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
          <Award className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
        >
          🎉 リーンキャンバス完成！
        </motion.h1>

        {selectedProductName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          >
            プロダクト名:{" "}
            <span className="text-primary">{selectedProductName.name}</span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600"
        >
          あなたのビジネスアイデアがリーンキャンバスとして完成しました
        </motion.p>
      </div>

      {/* Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-full overflow-hidden">
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
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span className="text-xl">{block.icon}</span>
                  <span>{block.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <ul className="space-y-2">
                  {block.content.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                      className="text-sm text-gray-700 bg-white/50 p-2 rounded-md border border-white/30 break-words overflow-wrap-anywhere"
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
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <Button
          size="lg"
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => window.print()}
        >
          <Download className="w-5 h-5" />
          <span>PDFで保存</span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>共有</span>
        </Button>

        <Button
          size="lg"
          variant="gradient"
          className="flex items-center space-x-2"
          onClick={resetWorkflow}
        >
          <RotateCcw className="w-5 h-5" />
          <span>新しいキャンバスを作成</span>
        </Button>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🎊 おめでとうございます！
        </h3>
        <p className="text-gray-600">
          AIとの協力により、あなたのビジネスアイデアが具体的なリーンキャンバスとして形になりました。
          このキャンバスを基に、さらなるビジネス展開を検討してみてください。
        </p>
      </motion.div>
    </motion.div>
  );
}
