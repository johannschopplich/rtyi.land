import { defineLoader } from "vitepress";
import * as path from "path";
import { STREAMS_DIR } from "../../src/constants";
import {
  extractContent,
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export interface ModelStreamData {
  id: string;
  date: string;
  rawDate: string;
  model: string;
  excerpt: string;
}

export default defineLoader({
  async load() {
    const streamData = await globAndProcessFiles(
      "**/*.txt",
      STREAMS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        let content = extractContent(fileContent);

        if (!content) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        // Extract first sentence as excerpt
        const excerpt = content.split("\n")[1].slice(1).trim();

        const streamInfo: ModelStreamData = {
          id: `${modelDir}-${rawDate}`,
          date: formattedDate,
          rawDate,
          model: modelDir,
          excerpt:
            excerpt.length > 200 ? excerpt.substring(0, 200) + "…" : excerpt,
        };

        return streamInfo;
      },
    );

    const streamsByModel: Record<string, ModelStreamData[]> = {};

    // Group streams by model
    for (const stream of streamData) {
      streamsByModel[stream.model] ??= [];
      streamsByModel[stream.model].push(stream);
    }

    // Sort streams within each model by date (newest first)
    for (const modelName of Object.keys(streamsByModel)) {
      streamsByModel[modelName].sort((a, b) =>
        b.rawDate.localeCompare(a.rawDate),
      );
    }

    return streamsByModel;
  },
});
