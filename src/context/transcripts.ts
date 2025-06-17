import type { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import * as clack from "@clack/prompts";
import slugify from "@sindresorhus/slugify";
import { generateText } from "ai";
import { template } from "utilful";
import { STREAMS_DIR } from "../constants";
import { EXTRACTION_PROMPT_REASONING } from "../prompts";
import { ensureDirectoryExists, resolveProviderLanguageModel } from "../utils";

export async function processTranscript(filePath: string, model: string) {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const modelSlug = slugify(model);
  const modelDir = join(STREAMS_DIR, modelSlug);
  const outputPath = join(modelDir, `${slugify(fileNameWithoutExt)}.txt`);

  await ensureDirectoryExists(modelDir);

  if (await isFileProcessed(outputPath)) {
    clack.note(`${fileName} is already processed. Skipping…`);
    return;
  }

  try {
    const transcriptContent = await fsp.readFile(filePath, "utf-8");
    const languageModel = resolveProviderLanguageModel(model);

    const result = await generateText({
      model: languageModel,
      temperature: model.startsWith("gemini") ? 1 : 0.5,
      providerOptions: {
        // Enable reasoning for the Anthropic model
        anthropic: {
          thinking: {
            type: "enabled",
            budgetTokens: model.startsWith("claude-opus") ? 16_000 : 32_000,
          },
        } satisfies AnthropicProviderOptions,
      },
      prompt: template(EXTRACTION_PROMPT_REASONING, {
        transcript: transcriptContent,
      }),
    });

    await fsp.writeFile(outputPath, result.text);
    clack.note(`Processed ${fileName}`);

    return result.text;
  } catch (error) {
    clack.cancel(`Error processing ${fileName}`);
    console.error(error);
  }
}

export function createTranscriptProcessor(model: string) {
  return async (filePath: string) => processTranscript(filePath, model);
}

async function isFileProcessed(filePath: string) {
  try {
    await fsp.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
