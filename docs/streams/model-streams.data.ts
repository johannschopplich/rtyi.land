import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { defineLoader } from "vitepress";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import {
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
      "**/*.json",
      TRANSCRIPTS_OUTPUT_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== STREAM_ANALYSIS_DIR) return;

        const streamData = tryParseJSON<Record<string, any>>(fileContent);

        if (!streamData) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);
        const excerpt = streamData.stream_context?.summary || "";

        const streamInfo: ModelStreamData = {
          id: `${modelDir}-${rawDate}`,
          date: formattedDate,
          rawDate,
          model: modelDir,
          excerpt,
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
