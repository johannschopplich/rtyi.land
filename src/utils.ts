import type { LanguageModelV1 } from "ai";
import process from "node:process";
import { mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import {
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_GOOGLE_MODEL,
  DEFAULT_OPENAI_MODEL,
} from "./constants";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await access(dirPath, constants.F_OK);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

export function resolveProviderLanguageModel(model?: string): LanguageModelV1 {
  const languageModel = model?.trim() || DEFAULT_OPENAI_MODEL;

  if (languageModel?.startsWith("claude")) {
    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    return anthropic(languageModel || DEFAULT_ANTHROPIC_MODEL);
  }

  if (languageModel?.startsWith("gemini")) {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    return google(languageModel || DEFAULT_GOOGLE_MODEL);
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai(languageModel);
}
