import type { LanguageModelV3 } from "@ai-sdk/provider";
import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import process from "node:process";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { DEFAULT_OPENAI_MODEL } from "./constants";

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fsp.access(dirPath, constants.F_OK);
  } catch {
    await fsp.mkdir(dirPath, { recursive: true });
  }
}

export function resolveProviderLanguageModel(model?: string): LanguageModelV3 {
  const languageModel = model?.trim() || DEFAULT_OPENAI_MODEL;

  if (languageModel?.startsWith("gemini")) {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    return google(languageModel);
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai(languageModel);
}
