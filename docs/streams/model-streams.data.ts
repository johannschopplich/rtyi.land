import { defineLoader } from "vitepress";
import fsp from "fs/promises";
import path from "path";
import { glob } from "tinyglobby";
import { STREAMS_DIR } from "../../src/constants";
import { extractContent, formatDateFromYYYYMMDD } from "../.vitepress/utils";

export interface ModelStreamData {
  id: string;
  date: string;
  rawDate: string;
  model: string;
  excerpt: string;
}

export default defineLoader({
  async load() {
    const files = await glob("**/*.txt", {
      cwd: STREAMS_DIR,
      absolute: true,
    });

    const streamsByModel: Record<string, ModelStreamData[]> = {};

    await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fsp.readFile(filePath, "utf8");
        const fileName = path.basename(filePath);
        const modelDir = path.basename(path.dirname(filePath));
        let content = extractContent(fileContent);

        if (!content) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        // Extract first sentence as excerpt
        const excerpt = content.split("\n")[1].slice(1).trim();

        const streamData: ModelStreamData = {
          id: `${modelDir}-${rawDate}`,
          date: formattedDate,
          rawDate,
          model: modelDir,
          excerpt:
            excerpt.length > 200 ? excerpt.substring(0, 200) + "…" : excerpt,
        };

        streamsByModel[modelDir] ??= [];
        streamsByModel[modelDir].push(streamData);
      }),
    );

    // Sort streams within each model by date (newest first)
    for (const modelName of Object.keys(streamsByModel)) {
      streamsByModel[modelName].sort((a, b) =>
        b.rawDate.localeCompare(a.rawDate),
      );
    }

    return streamsByModel;
  },
});
