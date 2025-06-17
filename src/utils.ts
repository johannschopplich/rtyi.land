import type { LanguageModelV1 } from "ai";
import type { StorageValue } from "unstorage";
import { constants } from "node:fs";
import * as fsp from "node:fs/promises";
import process from "node:process";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import {
  DEFAULT_ANTHROPIC_MODEL,
  DEFAULT_GOOGLE_MODEL,
  DEFAULT_OPENAI_MODEL,
  KV_QUESTIONS_DIR,
} from "./constants";

export function getQuestionStorage<T extends StorageValue>() {
  return createStorage<T>({
    driver: fsDriver({ base: KV_QUESTIONS_DIR }),
  });
}

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fsp.access(dirPath, constants.F_OK);
  } catch {
    await fsp.mkdir(dirPath, { recursive: true });
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
