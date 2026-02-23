import type { StreamAnalysis } from "../../src/schemas";
import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { defineLoader } from "vitepress";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import { formatDateFromYYYYMMDD } from "../.vitepress/shared";
import { globAndProcessFiles } from "../.vitepress/utils";

export interface QuoteEntry {
  speaker: string;
  quote: string;
  context: string;
  streamDate: string;
  streamRawDate: string;
  streamId: string;
}

export default defineLoader({
  async load() {
    const quotes: QuoteEntry[] = [];

    await globAndProcessFiles(
      "**/*.json",
      TRANSCRIPTS_OUTPUT_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== STREAM_ANALYSIS_DIR) return;

        const streamData = tryParseJSON<StreamAnalysis>(fileContent);
        if (!streamData) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);
        const streamId = `${modelDir}-${rawDate}`;

        for (const memorableQuote of streamData.memorable_quotes ?? []) {
          quotes.push({
            speaker: memorableQuote.speaker,
            quote: memorableQuote.quote,
            context: memorableQuote.context,
            streamDate: formattedDate,
            streamRawDate: rawDate,
            streamId,
          });
        }

        return null;
      },
    );

    quotes.sort((a, b) => a.streamRawDate.localeCompare(b.streamRawDate));

    return quotes;
  },
});
