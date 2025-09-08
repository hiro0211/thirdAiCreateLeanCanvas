"use client";

import { useState, useCallback, useEffect } from "react";
import { useWorkflowStore } from "@/stores/workflow-store";
import { Persona, DifyPersonaResponse } from "@/lib/types";
import { useDifyStream } from "./useApiMutations";

interface UsePersonaStreamReturn {
  isLoading: boolean;
  error: string | null;
  generatePersonas: (keyword: string) => Promise<void>;
}

export function usePersonaStream(): UsePersonaStreamReturn {
  const [localError, setLocalError] = useState<string | null>(null);
  const { clearPersonas, addPersona, setStreamingError } = useWorkflowStore();
  
  const {
    data,
    isLoading,
    error: streamError,
    executeStream,
    reset
  } = useDifyStream<DifyPersonaResponse>();

  // ストリームからデータが取得された時の処理
  useEffect(() => {
    if (data) {
      // 単一のペルソナの場合
      if (data.id && data.description) {
        const persona = data as unknown as Persona;
        if (
          typeof persona.id === "number" &&
          typeof persona.description === "string" &&
          typeof persona.explicit_needs === "string" &&
          typeof persona.implicit_needs === "string"
        ) {
          addPersona(persona);
        }
      }
      // ペルソナ配列の場合
      else if (data.personas && Array.isArray(data.personas)) {
        data.personas.forEach((persona: Persona) => {
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
    }
  }, [data, addPersona]);

  // エラー処理
  useEffect(() => {
    const error = localError || streamError;
    setStreamingError(error);
  }, [localError, streamError, setStreamingError]);

  const generatePersonas = useCallback(
    async (keyword: string) => {
      if (!keyword.trim()) {
        setLocalError("キーワードが必要です");
        return;
      }

      setLocalError(null);
      setStreamingError(null);
      clearPersonas();
      reset();

      try {
        await executeStream({
          task: "persona",
          keyword: keyword.trim(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "ペルソナ生成中にエラーが発生しました";
        
        setLocalError(errorMessage);
      }
    },
    [executeStream, clearPersonas, setStreamingError, reset]
  );

  return {
    isLoading,
    error: localError || streamError,
    generatePersonas,
  };
}
