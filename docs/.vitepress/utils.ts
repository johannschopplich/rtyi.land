import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { glob } from "tinyglobby";

export interface FileHandlerOptions {
  filePath: string;
  fileContent: string;
  fileName: string;
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

export function formatDateFromYYYYMMDD(dateString: string) {
  // Parse date string like "20230422" to "April 22, 2023"
  if (dateString.length !== 8) {
    return dateString;
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day),
  );

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
