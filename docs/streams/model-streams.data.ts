import type {
  FindingTopic,
  Significance,
  StreamAnalysis,
} from "../../src/schemas";
import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { defineLoader } from "vitepress";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import { formatDateFromYYYYMMDD } from "../.vitepress/shared";
import { globAndProcessFiles } from "../.vitepress/utils";

export interface ModelStreamData {
  id: string;
  date: string;
  rawDate: string;
  model: string;
  excerpt: string;
  significance: Significance;
  significanceReason: string | null;
  level: string[];
  topicCounts: Partial<Record<FindingTopic, number>>;
  quoteCount: number;
  storyCount: number;
  questionCount: number;
}

export default defineLoader({
  async load() {
    const streamData = await globAndProcessFiles(
      "**/*.json",
      TRANSCRIPTS_OUTPUT_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== STREAM_ANALYSIS_DIR) return;

        const streamData = tryParseJSON<StreamAnalysis>(fileContent);

        if (!streamData) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);
        const excerpt = streamData.stream_context?.summary || "";

        const topicCounts: Partial<Record<FindingTopic, number>> = {};
        const findings = streamData.findings ?? [];
        for (const finding of findings) {
          topicCounts[finding.topic] = (topicCounts[finding.topic] || 0) + 1;
        }

        const level = streamData.stream_context?.level ?? [];

        const streamInfo: ModelStreamData = {
          id: `${modelDir}-${rawDate}`,
          date: formattedDate,
          rawDate,
          model: modelDir,
          excerpt,
          significance: streamData.stream_context?.significance || "routine",
          significanceReason:
            streamData.stream_context?.significance_reason || null,
          level,
          topicCounts,
          quoteCount: streamData.memorable_quotes?.length ?? 0,
          storyCount: streamData.key_stories?.length ?? 0,
          questionCount: streamData.open_questions?.length ?? 0,
        };

        return streamInfo;
      },
    );

    streamData.sort((a, b) => b.rawDate.localeCompare(a.rawDate));

    return streamData;
  },
});
