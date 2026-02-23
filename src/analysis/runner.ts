import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { generateText, Output } from "ai";
import { template } from "utilful";
import { STREAM_ANALYSIS_DIR } from "../constants";
import { STT_CORRECTIONS } from "../stt-corrections";
import { ensureDirectoryExists, resolveLanguageModel } from "../utils";
import { STREAM_ANALYSIS_PROMPT } from "./prompt";
import { StreamAnalysisSchema } from "./schemas";

export type TranscriptResult =
  | { status: "processed"; fileName: string }
  | { status: "skipped"; fileName: string }
  | { status: "error"; fileName: string; error: unknown };

export async function analyzeTranscript(
  filePath: string,
): Promise<TranscriptResult> {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const outputPath = join(STREAM_ANALYSIS_DIR, `${fileNameWithoutExt}.json`);

  await ensureDirectoryExists(STREAM_ANALYSIS_DIR);

  if (await fileExists(outputPath)) {
    return { status: "skipped", fileName };
  }

  try {
    const rawTranscript = await fsp.readFile(filePath, "utf-8");
    const transcriptContent = applyTranscriptCorrections(rawTranscript);
    const languageModel = resolveLanguageModel();

    const { output } = await generateText({
      model: languageModel,
      output: Output.object({ schema: StreamAnalysisSchema }),
      prompt: template(STREAM_ANALYSIS_PROMPT, {
        transcript: transcriptContent,
      }),
      providerOptions: {
        openai: {
          reasoningEffort: "high",
        } satisfies OpenAILanguageModelChatOptions,
      },
    });

    await fsp.writeFile(
      outputPath,
      JSON.stringify(output, undefined, 2),
      "utf-8",
    );

    return { status: "processed", fileName };
  } catch (error) {
    return { status: "error", fileName, error };
  }
}

function applyTranscriptCorrections(text: string) {
  let sanitizedText = text;

  for (const [pattern, replacement] of STT_CORRECTIONS) {
    sanitizedText = sanitizedText.replace(pattern, replacement);
  }

  return sanitizedText;
}

async function fileExists(filePath: string) {
  return fsp.stat(filePath).then(
    () => true,
    () => false,
  );
}
