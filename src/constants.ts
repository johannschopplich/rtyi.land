import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));

// Paths
export const TRANSCRIPTS_DIR = join(ROOT_DIR, "transcripts");
export const DATA_DIR = join(ROOT_DIR, ".data");

// AI language models
export const DEFAULT_OPENAI_MODEL = "o4-mini" as const;
export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514" as const;
export const DEFAULT_ANTHROPIC_PRO_MODEL = "claude-opus-4-20250514" as const;
export const DEFAULT_GOOGLE_MODEL = "gemini-2.5-flash-preview-04-17" as const;
export const DEFAULT_GOOGLE_PRO_MODEL = "gemini-2.5-pro-preview-05-06" as const;

export const MODEL_LABELS: Record<string, string> = {
  [DEFAULT_OPENAI_MODEL]: "o4-mini",
  [DEFAULT_ANTHROPIC_MODEL]: "Claude Sonnet 4",
  [DEFAULT_ANTHROPIC_PRO_MODEL]: "Claude Opus 4",
  [DEFAULT_GOOGLE_MODEL]: "Gemini 2.5 Flash",
  [DEFAULT_GOOGLE_PRO_MODEL]: "Gemini 2.5 Pro",
};
