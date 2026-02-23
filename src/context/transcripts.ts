import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import * as clack from "@clack/prompts";
import slugify from "@sindresorhus/slugify";
import { generateText, Output } from "ai";
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
    clack.log.info(`${fileName} is already processed. Skipping…`);
    return;
  }

  try {
    const transcriptContent = await fsp.readFile(filePath, "utf-8");
    const languageModel = resolveProviderLanguageModel(model);

    const { output } = await generateText({
      model: languageModel,
      output: Output.object({ schema: StreamAnalysisSchema }),
      prompt: template(STREAM_ANALYSIS_PROMPT_v2, {
        transcript: transcriptContent,
      }),
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

async function isFileProcessed(filePath: string) {
  try {
    await fsp.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
