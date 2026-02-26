import type { StreamAnalysis } from "../../src/analysis/schemas";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { glob } from "tinyglobby";
import { STREAM_ANALYSIS_DIR, SYNTHESIS_DIR } from "../../src/constants";
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

  return results.filter((result): result is Awaited<T> => result != null);
}

export async function loadStreamAnalyses(): Promise<ParsedStream[]> {
  return globAndProcessFiles(
    "*.json",
    STREAM_ANALYSIS_DIR,
    ({ fileName, fileContent }) => {
      let analysis: StreamAnalysis;
      try {
        analysis = JSON.parse(fileContent) as StreamAnalysis;
      } catch {
        return;
      }

      const [rawDate] = fileName.split("-");

      return {
        analysis,
        rawDate,
        date: formatDateFromYYYYMMDD(rawDate),
        streamId: rawDate,
      };
    },
  );
}

export async function loadSynthesisFile<T>(
  filename: string,
): Promise<T | null> {
  const filePath = path.join(SYNTHESIS_DIR, filename);
  try {
    const content = await fsp.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}
