import type { FileHandlerOptions } from "./shared";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { glob } from "tinyglobby";

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
