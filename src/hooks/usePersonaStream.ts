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

      // 🔍 デバッグ: リクエストの詳細をログ出力
      const requestBody = {
        task: "persona",
        keyword: keyword.trim(),
        streaming: true, // ストリーミングモードを指定
      };

      console.log("🎯 [DEBUG] Frontend - Persona Stream Request:");
      console.log("📦 Request Body:", JSON.stringify(requestBody, null, 2));
      console.log("📍 Endpoint: /api/dify");

      try {
        const response = await fetch("/api/dify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        // 🔍 デバッグ: レスポンスの詳細をログ出力
        console.log("📥 [DEBUG] Frontend - API Response Details:");
        console.log("📊 Status:", response.status, response.statusText);
        console.log("📋 Response Headers:");
        response.headers.forEach((value, key) => {
          console.log(`  ${key}: ${value}`);
        });
        console.log("🔄 Content-Type:", response.headers.get("content-type"));
        console.log("🌊 Response Body Available:", !!response.body);
        console.log(
          "🔄 Is SSE Response:",
          response.headers.get("content-type")?.includes("text/event-stream")
        );

        if (!response.ok) {
          // エラーレスポンスの詳細をログ出力
          const errorText = await response.text();
          console.error("❌ [DEBUG] Frontend - HTTP Error Response:");
          console.error("📊 Status:", response.status, response.statusText);
          console.error("📝 Error Body:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          console.error("❌ [DEBUG] Frontend - No response body available");
          throw new Error("レスポンスボディが存在しません");
        }

        // ReadableStreamをTextDecoderで読み取り
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // SSE行のバッファ
        let accumulatedText = ""; // テキストチャンクを蓄積

        console.log("🌊 [DEBUG] Frontend - Starting SSE stream processing...");

        try {
          let chunkCount = 0;
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log(
                "🏁 [DEBUG] Frontend - Stream finished, total chunks:",
                chunkCount
              );
              break;
            }

            chunkCount++;

            // チャンクをデコードしてバッファに追加
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            console.log(`📦 [DEBUG] Frontend - Chunk ${chunkCount}:`, {
              chunkLength: chunk.length,
              chunkPreview:
                chunk.substring(0, 100) + (chunk.length > 100 ? "..." : ""),
              bufferLength: buffer.length,
            });

            // バッファから完全な行を抽出
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // 最後の不完全な行はバッファに残す

            console.log(
              `📋 [DEBUG] Frontend - Processing ${lines.length} lines from chunk ${chunkCount}`
            );

            for (const line of lines) {
              console.log(`🔍 [DEBUG] Frontend - Processing line:`, {
                lineLength: line.length,
                startsWithData: line.startsWith("data: "),
                linePreview:
                  line.substring(0, 100) + (line.length > 100 ? "..." : ""),
                fullLine: line,
              });

              if (line.startsWith("data: ")) {
                try {
                  const dataContent = line.slice(6).trim(); // "data: " を除去

                  console.log(`📋 [DEBUG] Frontend - Extracted data content:`, {
                    contentLength: dataContent.length,
                    isEmpty: !dataContent,
                    contentPreview:
                      dataContent.substring(0, 200) +
                      (dataContent.length > 200 ? "..." : ""),
                    fullContent: dataContent,
                  });

                  if (!dataContent) {
                    console.log(
                      "⚠️ [DEBUG] Frontend - Empty data content, skipping"
                    );
                    continue;
                  }

                  const data = JSON.parse(dataContent);

                  console.log("📨 [DEBUG] Frontend - Received SSE Data:", {
                    event: data.event,
                    hasAnswer: !!data.answer,
                    answerLength: data.answer?.length || 0,
                    answerPreview: data.answer
                      ? data.answer.substring(0, 50) +
                        (data.answer.length > 50 ? "..." : "")
                      : "N/A",
                    fullData: data,
                  });

                  // 🔍 詳細なイベント別ログ
                  switch (data.event) {
                    case "workflow_started":
                      console.log(
                        "🚀 [DEBUG] Frontend - Workflow started:",
                        data
                      );
                      break;
                    case "node_started":
                      console.log("🎯 [DEBUG] Frontend - Node started:", {
                        nodeType: data.data?.node_type,
                        nodeTitle: data.data?.title,
                        nodeId: data.data?.node_id,
                        iterationId: data.data?.iteration_id,
                        index: data.data?.index,
                        fullNodeData: data.data,
                      });
                      break;
                    case "node_finished":
                      console.log("✅ [DEBUG] Frontend - Node finished:", {
                        nodeType: data.data?.node_type,
                        nodeTitle: data.data?.title,
                        nodeId: data.data?.node_id,
                        status: data.data?.status,
                        hasOutputs: !!data.data?.outputs,
                        outputs: data.data?.outputs,
                        fullNodeData: data.data,
                      });
                      break;
                    case "workflow_finished":
                      console.log("🏁 [DEBUG] Frontend - Workflow finished:", {
                        status: data.data?.status,
                        hasOutputs: !!data.data?.outputs,
                        outputs: data.data?.outputs,
                        fullWorkflowData: data.data,
                      });
                      break;
                    case "message":
                      console.log(
                        "💬 [DEBUG] Frontend - Message event received:",
                        {
                          hasAnswer: !!data.answer,
                          answerType: typeof data.answer,
                          answerLength: data.answer?.length || 0,
                          isJsonLike:
                            data.answer?.trim().startsWith("{") ||
                            data.answer?.trim().startsWith("["),
                          answerSample: data.answer?.substring(0, 100),
                        }
                      );
                      break;
                    case "message_end":
                      console.log(
                        "🏁 [DEBUG] Frontend - Message end event:",
                        data
                      );
                      break;
                    case "error":
                      console.error("❌ [DEBUG] Frontend - Error event:", data);
                      break;
                    default:
                      console.log(
                        `🔔 [DEBUG] Frontend - Unknown event '${data.event}':`,
                        data
                      );
                  }

                  if (data.event === "error") {
                    throw new Error(
                      data.message ||
                        data.error ||
                        "ストリーミング中にエラーが発生しました"
                    );
                  }

                  // Difyのストリーミングでは、テキストチャンクが message イベントで送信される
                  if (data.event === "message" && data.answer) {
                    console.log(
                      "💬 [DEBUG] Frontend - Processing message event:",
                      {
                        answerLength: data.answer.length,
                        accumulatedLength: accumulatedText.length,
                        answerContent: data.answer,
                        answerStartsWith: data.answer.substring(0, 20),
                        answerEndsWith: data.answer.substring(
                          data.answer.length - 20
                        ),
                      }
                    );

                    // テキストチャンクを蓄積
                    const previousLength = accumulatedText.length;
                    accumulatedText += data.answer;

                    console.log("📝 [DEBUG] Frontend - Text accumulation:", {
                      previousLength: previousLength,
                      addedLength: data.answer.length,
                      newTotalLength: accumulatedText.length,
                      accumulatedPreview:
                        accumulatedText.substring(0, 300) +
                        (accumulatedText.length > 300 ? "..." : ""),
                      accumulatedStartsWith: accumulatedText.substring(0, 50),
                      accumulatedEndsWith:
                        accumulatedText.length > 50
                          ? accumulatedText.substring(
                              accumulatedText.length - 50
                            )
                          : accumulatedText,
                      looksLikeJson:
                        accumulatedText.trim().startsWith("{") ||
                        accumulatedText.trim().startsWith("["),
                      hasClosingBrace: accumulatedText.includes("}"),
                      braceCount: {
                        opening: (accumulatedText.match(/\{/g) || []).length,
                        closing: (accumulatedText.match(/\}/g) || []).length,
                      },
                    });

                    // 完全なJSONオブジェクトかどうかを試行
                    console.log(
                      "🔍 [DEBUG] Frontend - Attempting JSON parse..."
                    );
                    try {
                      const parsedData = JSON.parse(accumulatedText);

                      console.log(
                        "✅ [DEBUG] Frontend - Successfully parsed JSON:",
                        {
                          dataType: typeof parsedData,
                          isArray: Array.isArray(parsedData),
                          hasId: !!parsedData.id,
                          hasDescription: !!parsedData.description,
                          hasPersonas: !!parsedData.personas,
                          personasCount: parsedData.personas?.length || 0,
                          parsedKeys: Object.keys(parsedData),
                          fullParsedData: parsedData,
                        }
                      );

                      // 🔍 データ構造の詳細分析
                      console.log(
                        "🧪 [DEBUG] Frontend - Analyzing parsed data structure:"
                      );

                      // 単一のペルソナの場合
                      if (parsedData.id && parsedData.description) {
                        console.log(
                          "👤 [DEBUG] Frontend - Single persona detected:",
                          {
                            id: parsedData.id,
                            idType: typeof parsedData.id,
                            description: parsedData.description?.substring(
                              0,
                              100
                            ),
                            descriptionType: typeof parsedData.description,
                            hasExplicitNeeds: !!parsedData.explicit_needs,
                            hasImplicitNeeds: !!parsedData.implicit_needs,
                            explicitNeeds: parsedData.explicit_needs?.substring(
                              0,
                              100
                            ),
                            implicitNeeds: parsedData.implicit_needs?.substring(
                              0,
                              100
                            ),
                            allKeys: Object.keys(parsedData),
                            fullPersona: parsedData,
                          }
                        );

                        console.log(
                          "🎯 [DEBUG] Frontend - Attempting to add single persona..."
                        );
                        try {
                          addPersona(parsedData as Persona);
                          console.log(
                            "✅ [DEBUG] Frontend - Successfully added single persona!"
                          );
                          accumulatedText = ""; // リセット
                        } catch (addError) {
                          console.error(
                            "❌ [DEBUG] Frontend - Failed to add single persona:",
                            addError
                          );
                        }
                      }
                      // ペルソナ配列の場合
                      else if (
                        parsedData.personas &&
                        Array.isArray(parsedData.personas)
                      ) {
                        console.log(
                          "👥 [DEBUG] Frontend - Persona array detected:",
                          {
                            isArray: Array.isArray(parsedData.personas),
                            count: parsedData.personas.length,
                            firstPersona: parsedData.personas[0],
                            allPersonas: parsedData.personas,
                          }
                        );

                        parsedData.personas.forEach(
                          (persona: Persona, index: number) => {
                            console.log(
                              `👤 [DEBUG] Frontend - Validating persona ${index + 1}:`,
                              {
                                persona: persona,
                                hasId: !!persona.id,
                                idType: typeof persona.id,
                                idValue: persona.id,
                                hasDescription: !!persona.description,
                                descriptionType: typeof persona.description,
                                descriptionPreview:
                                  persona.description?.substring(0, 50),
                                hasExplicitNeeds: !!persona.explicit_needs,
                                explicitNeedsType:
                                  typeof persona.explicit_needs,
                                hasImplicitNeeds: !!persona.implicit_needs,
                                implicitNeedsType:
                                  typeof persona.implicit_needs,
                                personaKeys: Object.keys(persona || {}),
                              }
                            );

                            const validationChecks = {
                              hasPersona: !!persona,
                              hasNumericId: typeof persona.id === "number",
                              hasStringDescription:
                                typeof persona.description === "string",
                              hasStringExplicitNeeds:
                                typeof persona.explicit_needs === "string",
                              hasStringImplicitNeeds:
                                typeof persona.implicit_needs === "string",
                            };

                            console.log(
                              `🔍 [DEBUG] Frontend - Validation checks for persona ${index + 1}:`,
                              validationChecks
                            );

                            if (
                              validationChecks.hasPersona &&
                              validationChecks.hasNumericId &&
                              validationChecks.hasStringDescription &&
                              validationChecks.hasStringExplicitNeeds &&
                              validationChecks.hasStringImplicitNeeds
                            ) {
                              console.log(
                                `✅ [DEBUG] Frontend - Adding valid persona ${index + 1}:`,
                                persona
                              );
                              try {
                                addPersona(persona);
                                console.log(
                                  `🎉 [DEBUG] Frontend - Successfully added persona ${index + 1}!`
                                );
                              } catch (addError) {
                                console.error(
                                  `❌ [DEBUG] Frontend - Failed to add persona ${index + 1}:`,
                                  addError
                                );
                              }
                            } else {
                              console.warn(
                                `⚠️ [DEBUG] Frontend - Skipping invalid persona ${index + 1}:`,
                                {
                                  persona: persona,
                                  failedChecks: Object.entries(
                                    validationChecks
                                  ).filter(([key, value]) => !value),
                                }
                              );
                            }
                          }
                        );
                        console.log(
                          "🎯 [DEBUG] Frontend - Finished processing persona array, resetting accumulated text"
                        );
                        accumulatedText = ""; // リセット
                      }
                      // その他のデータ構造の場合
                      else {
                        console.warn(
                          "🤔 [DEBUG] Frontend - Unrecognized data structure:",
                          {
                            dataType: typeof parsedData,
                            isArray: Array.isArray(parsedData),
                            hasId: !!parsedData.id,
                            hasDescription: !!parsedData.description,
                            hasPersonas: !!parsedData.personas,
                            dataKeys: Object.keys(parsedData),
                            fullData: parsedData,
                          }
                        );
                      }
                    } catch (parseError) {
                      // まだ完全なJSONではない、蓄積を続行
                      console.log(
                        "⏳ [DEBUG] Frontend - JSON parse failed, continuing accumulation:",
                        {
                          currentLength: accumulatedText.length,
                          errorName:
                            parseError instanceof Error
                              ? parseError.name
                              : "Unknown",
                          errorMessage:
                            parseError instanceof Error
                              ? parseError.message
                              : "Unknown error",
                          accumulatedSample: accumulatedText.substring(0, 200),
                          lastCharacters: accumulatedText.slice(-50),
                          parseError: parseError,
                        }
                      );
                    }
                  }

                  // message_end で最終処理
                  if (data.event === "message_end") {
                    console.log(
                      "🏁 [DEBUG] Frontend - Processing message_end event:",
                      {
                        hasRemainingText: !!accumulatedText.trim(),
                        remainingTextLength: accumulatedText.length,
                        hasAnswerInEnd: !!data.answer,
                      }
                    );

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
                  console.error(
                    "❌ [DEBUG] Frontend - Failed to parse SSE line as JSON:",
                    {
                      line: line,
                      lineLength: line.length,
                      dataContent: line.startsWith("data: ")
                        ? line.slice(6).trim()
                        : "Not a data line",
                      errorName:
                        jsonError instanceof Error ? jsonError.name : "Unknown",
                      errorMessage:
                        jsonError instanceof Error
                          ? jsonError.message
                          : "Unknown error",
                      fullError: jsonError,
                    }
                  );
                  // JSONパースエラーは無視して続行
                }
              }
            }
          }

          // ストリームが終了したときの残りバッファ処理
          console.log("🔚 [DEBUG] Frontend - Processing final buffer:", {
            hasBuffer: !!buffer.trim(),
            bufferLength: buffer.length,
            bufferContent: buffer,
            hasAccumulatedText: !!accumulatedText.trim(),
            accumulatedLength: accumulatedText.length,
          });

          if (buffer.trim()) {
            if (buffer.startsWith("data: ")) {
              try {
                const dataContent = buffer.slice(6).trim();
                console.log(
                  "📋 [DEBUG] Frontend - Final buffer data content:",
                  dataContent
                );

                if (dataContent) {
                  const data = JSON.parse(dataContent);
                  console.log(
                    "📨 [DEBUG] Frontend - Final buffer parsed data:",
                    data
                  );

                  if (data.event === "message_end" && accumulatedText.trim()) {
                    console.log(
                      "🏁 [DEBUG] Frontend - Processing final accumulated text on message_end"
                    );
                    try {
                      const finalData = JSON.parse(accumulatedText);
                      console.log(
                        "✅ [DEBUG] Frontend - Final data parsed successfully:",
                        finalData
                      );

                      if (
                        finalData.personas &&
                        Array.isArray(finalData.personas)
                      ) {
                        console.log(
                          `👥 [DEBUG] Frontend - Processing ${finalData.personas.length} final personas`
                        );
                        finalData.personas.forEach(
                          (persona: Persona, index: number) => {
                            console.log(
                              `👤 [DEBUG] Frontend - Final persona ${index + 1}:`,
                              persona
                            );
                            if (persona && typeof persona.id === "number") {
                              addPersona(persona);
                              console.log(
                                `✅ [DEBUG] Frontend - Added final persona ${index + 1}`
                              );
                            } else {
                              console.warn(
                                `⚠️ [DEBUG] Frontend - Skipped invalid final persona ${index + 1}:`,
                                persona
                              );
                            }
                          }
                        );
                      }
                    } catch (parseError) {
                      console.error(
                        "❌ [DEBUG] Frontend - Failed to parse final accumulated text:",
                        {
                          accumulatedText: accumulatedText,
                          errorName:
                            parseError instanceof Error
                              ? parseError.name
                              : "Unknown",
                          errorMessage:
                            parseError instanceof Error
                              ? parseError.message
                              : "Unknown error",
                          fullError: parseError,
                        }
                      );
                    }
                  }
                }
              } catch (jsonError) {
                console.error(
                  "❌ [DEBUG] Frontend - Failed to parse final buffer:",
                  {
                    buffer: buffer,
                    errorName:
                      jsonError instanceof Error ? jsonError.name : "Unknown",
                    errorMessage:
                      jsonError instanceof Error
                        ? jsonError.message
                        : "Unknown error",
                    fullError: jsonError,
                  }
                );
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
