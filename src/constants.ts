import * as path from "node:path";

export const ROOT_DIR = path.join(import.meta.dirname, "..");

// Paths
export const DATA_DIR = path.join(ROOT_DIR, ".data");
export const DOCS_DIR = path.join(ROOT_DIR, "docs");

export const TRANSCRIPTS_INPUT_DIR = path.join(ROOT_DIR, "transcripts");
export const TRANSCRIPTS_OUTPUT_DIR = path.join(DATA_DIR, "streams_v2");

// AI language models
export const DEFAULT_OPENAI_REASONING_MODEL = "gpt-5.2" as const;
export const DEFAULT_GOOGLE_MODEL = "gemini-3-flash-preview" as const;
export const DEFAULT_GOOGLE_REASONING_MODEL = "gemini-3.1-pro-preview" as const;

export const STREAM_ANALYSIS_MODEL = DEFAULT_OPENAI_REASONING_MODEL;
export const STREAM_ANALYSIS_DIR = modelToDirectoryName(STREAM_ANALYSIS_MODEL);

export const MODEL_LABELS: Record<string, string> = {
  [DEFAULT_OPENAI_REASONING_MODEL]: "GPT-5.2",
  [DEFAULT_GOOGLE_MODEL]: "Gemini 3 Flash",
  [DEFAULT_GOOGLE_REASONING_MODEL]: "Gemini 3.1 Pro",
};

/** Derive a filesystem-safe directory name from a model identifier. */
export function modelToDirectoryName(model: string): string {
  return model.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}
