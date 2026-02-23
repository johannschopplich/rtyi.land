import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import slugify from "@sindresorhus/slugify";
import { generateText, Output } from "ai";
import { template } from "utilful";
import { TRANSCRIPTS_OUTPUT_DIR } from "../constants";
import { STREAM_ANALYSIS_PROMPT } from "../prompts";
import { StreamAnalysisSchema } from "../schemas";
import { ensureDirectoryExists, resolveProviderLanguageModel } from "../utils";
import { STT_CORRECTIONS } from "./stt-corrections";

export type TranscriptResult =
  | { status: "processed"; fileName: string }
  | { status: "skipped"; fileName: string }
  | { status: "error"; fileName: string; error: unknown };

export async function processTranscript(
  filePath: string,
  model: string,
): Promise<TranscriptResult> {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const modelDir = join(TRANSCRIPTS_OUTPUT_DIR, slugify(model));
  const outputPath = join(modelDir, `${fileNameWithoutExt}.json`);

  await ensureDirectoryExists(modelDir);

  if (await fileExists(outputPath)) {
    return { status: "skipped", fileName };
  }

  try {
    const rawTranscript = await fsp.readFile(filePath, "utf-8");
    const transcriptContent = applyTranscriptCorrections(rawTranscript);
    const languageModel = resolveProviderLanguageModel(model);

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

export function createTranscriptProcessor(model: string) {
  return (filePath: string) => processTranscript(filePath, model);
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
