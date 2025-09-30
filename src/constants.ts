import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));

// Paths
export const DATA_DIR = join(ROOT_DIR, ".data");
export const DOCS_DIR = join(ROOT_DIR, "docs");

export const TRANSCRIPTS_INPUT_DIR = join(ROOT_DIR, "transcripts");
export const TRANSCRIPTS_OUTPUT_DIR = join(DATA_DIR, "streams_v2");

// AI language models
export const DEFAULT_OPENAI_MODEL = "o4-mini" as const;
export const DEFAULT_OPENAI_PRO_MODEL = "o3" as const;
export const DEFAULT_GOOGLE_MODEL = "gemini-2.5-flash" as const;
export const DEFAULT_GOOGLE_PRO_MODEL = "gemini-2.5-pro" as const;

export const MODEL_LABELS: Record<string, string> = {
  [DEFAULT_OPENAI_MODEL]: "o4-mini",
  [DEFAULT_OPENAI_PRO_MODEL]: "o3",
  [DEFAULT_GOOGLE_MODEL]: "Gemini 2.5 Flash",
  [DEFAULT_GOOGLE_PRO_MODEL]: "Gemini 2.5 Pro",
};
