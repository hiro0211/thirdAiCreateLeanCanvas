"use client";

import { useState, useCallback } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { Persona } from "@/lib/types";

interface UsePersonaStreamReturn {
  isLoading: boolean;
  error: string | null;
  generatePersonas: (keyword: string) => Promise<void>;
}

export function usePersonaStream(): UsePersonaStreamReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { clearPersonas, addPersona, setStreamingError } = useWorkflowStore();

  const generatePersonas = useCallback(
    async (keyword: string) => {
      if (!keyword.trim()) {
        setError("キーワードが必要です");
        return;
      }

      setIsLoading(true);
      setError(null);
      setStreamingError(null);

      // 既存のペルソナをクリア
      clearPersonas();

      try {
        const response = await fetch("/api/dify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: "persona",
            keyword: keyword.trim(),
            streaming: true, // ストリーミングモードを指定
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("レスポンスボディが存在しません");
        }

        // ReadableStreamをTextDecoderで読み取り
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // SSE行のバッファ
        let accumulatedText = ""; // テキストチャンクを蓄積

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            // チャンクをデコードしてバッファに追加
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // バッファから完全な行を抽出
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // 最後の不完全な行はバッファに残す

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const dataContent = line.slice(6).trim(); // "data: " を除去
                  if (!dataContent) continue;

                  const data = JSON.parse(dataContent);

                  if (process.env.NODE_ENV === "development") {
                    console.log("受信したSSEデータ:", data);
                  }

                  if (data.event === "error") {
                    throw new Error(
                      data.message || data.error || "ストリーミング中にエラーが発生しました"
                    );
                  }

                  // Difyのストリーミングでは、テキストチャンクが message イベントで送信される
                  if (data.event === "message" && data.answer) {
                    if (process.env.NODE_ENV === "development") {
                      console.log("メッセージチャンク受信:", data.answer);
                    }

                    // テキストチャンクを蓄積
                    accumulatedText += data.answer;

                    // 完全なJSONオブジェクトかどうかを試行
                    try {
                      const parsedData = JSON.parse(accumulatedText);

                      // 単一のペルソナの場合
                      if (parsedData.id && parsedData.description) {
                        if (process.env.NODE_ENV === "development") {
                          console.log("単一ペルソナを追加:", parsedData);
                        }
                        addPersona(parsedData as Persona);
                        accumulatedText = ""; // リセット
                      }
                      // ペルソナ配列の場合
                      else if (
                        parsedData.personas &&
                        Array.isArray(parsedData.personas)
                      ) {
                        if (process.env.NODE_ENV === "development") {
                          console.log(
                            "ペルソナ配列を処理:",
                            parsedData.personas
                          );
                        }
                        parsedData.personas.forEach((persona: Persona) => {
                          if (
                            persona &&
                            typeof persona.id === "number" &&
                            typeof persona.description === "string" &&
                            typeof persona.explicit_needs === "string" &&
                            typeof persona.implicit_needs === "string"
                          ) {
                            addPersona(persona);
                          }
                        });
                        accumulatedText = ""; // リセット
                      }
                    } catch (parseError) {
                      // まだ完全なJSONではない、蓄積を続行
                      if (process.env.NODE_ENV === "development") {
                        console.log(
                          "蓄積中のテキスト:",
                          accumulatedText.length,
                          "文字"
                        );
                      }
                    }
                  }

                  // message_end で最終処理
                  if (data.event === "message_end") {
                    if (process.env.NODE_ENV === "development") {
                      console.log("ストリーミング終了");
                    }

                    // 蓄積されたテキストがあれば最終処理
                    if (accumulatedText.trim()) {
                      try {
                        const finalData = JSON.parse(accumulatedText);
                        if (
                          finalData.personas &&
                          Array.isArray(finalData.personas)
                        ) {
                          if (process.env.NODE_ENV === "development") {
                            console.log(
                              "最終ペルソナ配列を処理:",
                              finalData.personas
                            );
                          }
                          finalData.personas.forEach((persona: Persona) => {
                            if (
                              persona &&
                              typeof persona.id === "number" &&
                              typeof persona.description === "string" &&
                              typeof persona.explicit_needs === "string" &&
                              typeof persona.implicit_needs === "string"
                            ) {
                              addPersona(persona);
                            }
                          });
                        }
                      } catch (parseError) {
                        console.warn(
                          "最終データのパースに失敗:",
                          accumulatedText
                        );
                      }
                    }

                    // message_end の answer も処理
                    if (data.answer) {
                      try {
                        const endData = JSON.parse(data.answer);
                        if (
                          endData.personas &&
                          Array.isArray(endData.personas)
                        ) {
                          if (process.env.NODE_ENV === "development") {
                            console.log(
                              "message_end からペルソナ配列を処理:",
                              endData.personas
                            );
                          }
                          endData.personas.forEach((persona: Persona) => {
                            addPersona(persona);
                          });
                        }
                      } catch (parseError) {
                        console.warn(
                          "message_end の answer パースに失敗:",
                          data.answer
                        );
                      }
                    }
                    break;
                  }
                } catch (jsonError) {
                  console.warn("SSEデータのパースに失敗:", line);
                  // JSONパースエラーは無視して続行
                }
              }
            }
          }

          // ストリームが終了したときの残りバッファ処理
          if (buffer.trim()) {
            if (buffer.startsWith("data: ")) {
              try {
                const dataContent = buffer.slice(6).trim();
                if (dataContent) {
                  const data = JSON.parse(dataContent);
                  if (data.event === "message_end" && accumulatedText.trim()) {
                    try {
                      const finalData = JSON.parse(accumulatedText);
                      if (finalData.personas && Array.isArray(finalData.personas)) {
                        finalData.personas.forEach((persona: Persona) => {
                          if (persona && typeof persona.id === "number") {
                            addPersona(persona);
                          }
                        });
                      }
                    } catch (parseError) {
                      console.warn("最終バッファデータのパースに失敗:", accumulatedText);
                    }
                  }
                }
              } catch (jsonError) {
                console.warn("残りバッファのパースに失敗:", buffer);
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error
            ? fetchError.message
            : "ペルソナ生成中に不明なエラーが発生しました";

        setError(errorMessage);
        setStreamingError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [clearPersonas, addPersona, setStreamingError]
  );

  return {
    isLoading,
    error,
    generatePersonas,
  };
}
