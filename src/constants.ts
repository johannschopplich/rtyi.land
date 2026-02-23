import * as path from "node:path";

export const ROOT_DIR = path.join(import.meta.dirname, "..");

// Paths
export const DATA_DIR = path.join(ROOT_DIR, ".data");

export const TRANSCRIPTS_INPUT_DIR = path.join(ROOT_DIR, "transcripts");
export const STREAM_ANALYSIS_DIR = path.join(DATA_DIR, "streams");
export const SYNTHESIS_DIR = path.join(DATA_DIR, "synthesis");

// AI language model
export const LANGUAGE_MODEL = "gpt-5.2";
