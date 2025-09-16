"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";

export default function LegalPage() {
  const legalData = [
    {
      label: "販売事業者名",
      value: "有村大旭",
    },
    {
      label: "運営統括責任者名",
      value: "同上",
    },
    {
      label: "事業者の所在地",
      value: "請求があったら遅滞なく開示します。",
    },
    {
      label: "事業者の連絡先（電話番号）",
      value: "請求があったら遅滞なく開示します。",
    },
    {
      label: "連絡先メールアドレス",
      value: "arimurahiroaki40@gmail.com",
    },
    {
      label: "販売価格",
      value: "当サービスへのサポートとして、任意の金額を受け付けております。",
    },
    {
      label: "商品代金以外の必要料金",
      value: "なし",
    },
    {
      label: "お支払い方法",
      value: "クレジットカード",
    },
    {
      label: "サービスの提供時期",
      value:
        "本件はサービス利用の対価ではなく、運営を支援するための任意のお支払いのため、商品の引渡しは発生しません。サービスの利用は、お支払いの有無にかかわらず常時可能です。",
    },
    {
      label: "返品・キャンセルに関する特約",
      value:
        "お支払いの性質上、決済完了後のキャンセル・返金はお受けできません。",
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/30">
      <Header />

      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                特定商取引法に基づく表記
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {legalData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <td className="py-4 pr-6 font-semibold text-gray-700 dark:text-gray-300 align-top min-w-[200px] sm:min-w-[250px]">
                          {item.label}
                        </td>
                        <td className="py-4 text-gray-900 dark:text-gray-100 leading-relaxed">
                          {item.value}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  本サービスは、リーンキャンバス作成支援ツールとして無料でご利用いただけます。
                  寄付機能は、サービスの継続的な運営と改善のためのサポートとして設置しており、
                  任意でのご支援をお願いしております。
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-center sm:text-left">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                © 2025 AI Lean Canvas Creator.{" "}
                <span className="block sm:inline">
                  Powered by{" "}
                  <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
                    Dify AI
                  </span>
                </span>
              </p>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span>Made with ❤️ for entrepreneurs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
