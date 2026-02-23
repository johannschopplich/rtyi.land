import type { LanguageModelV3 } from "@ai-sdk/provider";
import * as fsp from "node:fs/promises";
import process from "node:process";
import { createOpenAI } from "@ai-sdk/openai";
import { LANGUAGE_MODEL } from "./constants";

export async function ensureDirectoryExists(dirPath: string) {
  await fsp.mkdir(dirPath, { recursive: true });
}

export function resolveLanguageModel(): LanguageModelV3 {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai(LANGUAGE_MODEL);
}
