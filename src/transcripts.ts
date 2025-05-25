import * as clack from "@clack/prompts";
import { readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { generateText } from "ai";
import { join, basename, extname } from "node:path";
import { resolveProviderLanguageModel, ensureDirectoryExists } from "./utils";
import { DATA_DIR } from "./constants";
import { EXTRACTION_PROMPT_REASONING } from "./prompts";
import { template } from "utilful";
import slugify from "@sindresorhus/slugify";
import { AnthropicProviderOptions } from "@ai-sdk/anthropic";

export async function processTranscript(filePath: string, model: string) {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const modelSlug = slugify(model);
  const modelDir = join(DATA_DIR, modelSlug);
  const outputPath = join(modelDir, `${slugify(fileNameWithoutExt)}.txt`);

  await ensureDirectoryExists(modelDir);

  if (await isFileProcessed(outputPath)) {
    clack.note(`${fileName} is already processed. Skipping…`);
    return;
  }

  try {
    const transcriptContent = await readFile(filePath, "utf-8");
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

    await writeFile(outputPath, result.text);
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
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
