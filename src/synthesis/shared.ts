import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { z } from "zod";
import type { StreamAnalysis } from "../analysis/schemas";
import { generateText, Output } from "ai";

export type SynthesisTask = "story-threads" | "narrative-arcs" | "topic-arcs";

export type ProgressEvent =
  | { phase: "map-start"; total: number; streamCounts: number[] }
  | {
      phase: "map-chunk-done";
      index: number;
      total: number;
      chunkStreams: number;
    }
  | { phase: "reduce-start"; batches: number }
  | {
      phase: "single-prompt-start";
      tokens: number;
      tier: number;
      totalFindings: number;
      selectedFindings: number;
    }
  | { phase: "topic-start"; total: number }
  | { phase: "topic-done"; index: number; total: number; name: string };

export interface ParsedStream {
  rawDate: string;
  fileName: string;
  analysis: StreamAnalysis;
}

export interface SynthesisOptions {
  task: SynthesisTask;
  model: LanguageModelV3;
  streams: ParsedStream[];
  dateRange: string;
  onProgress?: (event: ProgressEvent) => void;
}

export const OPENAI_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high",
  } satisfies OpenAILanguageModelChatOptions,
};

export async function generateObject<T extends z.ZodType>(
  model: LanguageModelV3,
  schema: T,
  prompt: string,
  system?: string,
): Promise<z.output<T> | undefined> {
  const { output } = await generateText({
    model,
    output: Output.object({ schema }),
    ...(system ? { system } : {}),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output as z.output<T> | undefined;
}
