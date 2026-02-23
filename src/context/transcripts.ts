import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import * as clack from "@clack/prompts";
import slugify from "@sindresorhus/slugify";
import { generateText, Output } from "ai";
import { template } from "utilful";
import { TRANSCRIPTS_OUTPUT_DIR } from "../constants";
import { STREAM_ANALYSIS_PROMPT } from "../prompts";
import { StreamAnalysisSchema } from "../schemas";
import { ensureDirectoryExists, resolveProviderLanguageModel } from "../utils";

const STT_CORRECTIONS: [RegExp, string][] = [
  // Team members
  [/\bBiomech\b/gi, "Biobak"],
  [/\bBiomek\b/gi, "Biobak"],
  [/\bBiomag\b/gi, "Biobak"],
  [/\bBiobike\b/gi, "Biobak"],
  [/\bBiomex\b/gi, "Biobak's"],
  [/\bBadoop\b/gi, "Badub"],
  [/\bBadoob\b/gi, "Badub"],
  [/\bBadoo\b/gi, "Badub"],
  [/\bBadou\b/gi, "Badub"],
  [/\bBadoub\b/gi, "Badub"],
  [/\bBarduke\b/gi, "Badub"],
  [/\bBad00p\b/gi, "Badub"],
  [/\bXena\b/gi, "Zeina"],
  [/\bZena\b/gi, "Zeina"],
  [/\bZeyna\b/gi, "Zeina"],
  [/\bLeela\b/gi, "Lilaa"],
  [/\bLeila\b/gi, "Lilaa"],
  [/\bLeyla\b/gi, "Lilaa"],
  [/\bLayla\b/gi, "Lilaa"],
  [/\bLaila\b/gi, "Lilaa"],
  [/\bLila\b/gi, "Lilaa"],
  [/\bSauron\b/gi, "Sauraen"],
  [/\bSaurin\b/gi, "Sauraen"],
  [/\bSauren\b/gi, "Sauraen"],
  [/\bAza\b/gi, "Aeza"],
  // Technical terms
  [/\bf3dx\b/gi, "F3DEX"],
  [/\bF3DX2\b/g, "F3DEX2"],
  [/\bF3DX3\b/g, "F3DEX3"],
  [/\bf3d\s*x2\b/gi, "F3DEX2"],
  [/\bf3d\s*x3\b/gi, "F3DEX3"],
  [/\bLib\s*Dragon\b/gi, "libdragon"],
  [/\bRom[Ee]x\b/g, "ROM hack"],
  [/\bromex\b/g, "ROM hack"],
];

export async function processTranscript(filePath: string, model: string) {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const modelSlug = slugify(model);
  const modelDir = join(TRANSCRIPTS_OUTPUT_DIR, modelSlug);
  const outputPath = join(modelDir, `${fileNameWithoutExt}.json`);

  await ensureDirectoryExists(modelDir);

  if (await isFileProcessed(outputPath)) {
    clack.log.info(`${fileName} is already processed. Skipping…`);
    return;
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
          reasoningEffort: "xhigh",
        } satisfies OpenAILanguageModelChatOptions,
      },
    });

    await fsp.writeFile(
      outputPath,
      JSON.stringify(output, undefined, 2),
      "utf-8",
    );
    clack.log.success(`Processed ${fileName}`);

    return output;
  } catch (error) {
    clack.log.error(`Error processing ${fileName}`);
    console.error(error);
  }
}

export function createTranscriptProcessor(model: string) {
  return async (filePath: string) => processTranscript(filePath, model);
}

function applyTranscriptCorrections(text: string) {
  let sanitizedText = text;

  for (const [pattern, replacement] of STT_CORRECTIONS) {
    sanitizedText = sanitizedText.replace(pattern, replacement);
  }

  return sanitizedText;
}

async function isFileProcessed(filePath: string) {
  try {
    await fsp.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
