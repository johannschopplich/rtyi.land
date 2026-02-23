import * as path from "node:path";

export const ROOT_DIR = path.join(import.meta.dirname, "..");
export const DATA_DIR = path.join(ROOT_DIR, ".data");

export const TRANSCRIPTS_INPUT_DIR = path.join(ROOT_DIR, "transcripts");
export const STREAM_ANALYSIS_DIR = path.join(DATA_DIR, "streams");
export const SYNTHESIS_DIR = path.join(DATA_DIR, "synthesis");

export const LANGUAGE_MODEL = "gpt-5.2";

export const QUOTE_FORMATTING_INSTRUCTIONS =
  "Minor grammatical errors should be corrected and surrounding quotation marks must be omitted.";
