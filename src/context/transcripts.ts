import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import * as clack from "@clack/prompts";
import slugify from "@sindresorhus/slugify";
import { generateObject } from "ai";
import { template } from "utilful";
import { TRANSCRIPTS_OUTPUT_DIR } from "../constants";
import { STREAM_ANALYSIS_PROMPT_v2 } from "../prompts";
import { StreamAnalysisSchema } from "../schemas";
import { ensureDirectoryExists, resolveProviderLanguageModel } from "../utils";

export async function processTranscript(filePath: string, model: string) {
  const fileName = basename(filePath);
  const fileNameWithoutExt = basename(filePath, extname(filePath));
  const modelSlug = slugify(model);
  const modelDir = join(TRANSCRIPTS_OUTPUT_DIR, modelSlug);
  const outputPath = join(modelDir, `${fileNameWithoutExt}.json`);

  await ensureDirectoryExists(modelDir);

  if (await isFileProcessed(outputPath)) {
    clack.note(`${fileName} is already processed. Skipping…`);
    return;
  }

  try {
    const transcriptContent = await fsp.readFile(filePath, "utf-8");
    const languageModel = resolveProviderLanguageModel(model);

    const { object } = await generateObject({
      model: languageModel,
      temperature: 0.5,
      schema: StreamAnalysisSchema,
      output: "object",
      prompt: template(STREAM_ANALYSIS_PROMPT_v2, {
        transcript: transcriptContent,
      }),
    });

    await fsp.writeFile(
      outputPath,
      JSON.stringify(object, undefined, 2),
      "utf-8",
    );
    clack.note(`Processed ${fileName}`);

    return object;
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
