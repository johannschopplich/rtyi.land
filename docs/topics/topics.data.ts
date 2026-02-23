import type { FindingTopic, StreamAnalysis } from "../../src/schemas";
import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { defineLoader } from "vitepress";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  formatTopicLabel,
  TOPIC_KEYS,
} from "../.vitepress/shared";
import { globAndProcessFiles } from "../.vitepress/utils";

export interface TopicFinding {
  summary: string;
  quote: string | null;
  streamDate: string;
  streamRawDate: string;
  streamId: string;
}

export interface TopicData {
  topic: FindingTopic;
  label: string;
  findings: TopicFinding[];
  streamCount: number;
}

export default defineLoader({
  async load() {
    const topicMap: Partial<Record<FindingTopic, TopicFinding[]>> = {};

    for (const key of TOPIC_KEYS) {
      topicMap[key] = [];
    }

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

        const findings = streamData.findings ?? [];
        for (const finding of findings) {
          const currentTopic = topicMap[finding.topic];
          if (!currentTopic) continue;

          currentTopic.push({
            summary: finding.summary,
            quote: finding.quote,
            streamDate: formattedDate,
            streamRawDate: rawDate,
            streamId,
          });
        }

        return null;
      },
    );

    const result: Partial<Record<FindingTopic, TopicData>> = {};
    for (const [topic, findings] of Object.entries(topicMap)) {
      if (!findings) continue;
      findings.sort((a, b) => a.streamRawDate.localeCompare(b.streamRawDate));

      const uniqueStreams = new Set(
        findings.map((finding) => finding.streamId),
      );

      result[topic as FindingTopic] = {
        topic: topic as FindingTopic,
        label: formatTopicLabel(topic as FindingTopic),
        findings,
        streamCount: uniqueStreams.size,
      };
    }

    return result;
  },
});
