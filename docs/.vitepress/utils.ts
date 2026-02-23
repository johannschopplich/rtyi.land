import type { StreamAnalysis } from "../../src/schemas";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { glob } from "tinyglobby";
import { tryParseJSON } from "utilful";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import { formatDateFromYYYYMMDD } from "./shared";

export interface FileHandlerOptions {
  filePath: string;
  fileContent: string;
  fileName: string;
}

export interface ParsedStream {
  analysis: StreamAnalysis;
  rawDate: string;
  date: string;
  streamId: string;
}

export async function globAndProcessFiles<T>(
  pattern: string,
  baseDir: string,
  processor: (params: FileHandlerOptions) => T | Promise<T> | null | undefined,
) {
  const files = await glob(pattern, {
    cwd: baseDir,
    absolute: true,
  });

  const results = await Promise.all(
    files.map(async (filePath) => {
      const fileName = path.basename(filePath);
      const fileContent = await fsp.readFile(filePath, "utf8");
      return processor({ filePath, fileName, fileContent });
    }),
  );

  return results.filter((result) => result != null) as T[];
}

/**
 * Load and parse all stream analysis JSON files for the active model.
 * Returns pre-parsed entries so consumers don't need to repeat the
 * glob → filter → parse → date-extract boilerplate.
 */
export async function loadStreamAnalyses(): Promise<ParsedStream[]> {
  return globAndProcessFiles(
    "**/*.json",
    TRANSCRIPTS_OUTPUT_DIR,
    ({ filePath, fileName, fileContent }) => {
      const modelDir = path.basename(path.dirname(filePath));
      if (modelDir !== STREAM_ANALYSIS_DIR) return;

      const analysis = tryParseJSON<StreamAnalysis>(fileContent);
      if (!analysis) return;

      const [rawDate] = fileName.split("-");

      return {
        analysis,
        rawDate,
        date: formatDateFromYYYYMMDD(rawDate),
        streamId: `${STREAM_ANALYSIS_DIR}-${rawDate}`,
      };
    },
  );
}
