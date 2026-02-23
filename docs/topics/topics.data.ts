import type { FindingTopic } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { formatTopicLabel, TOPIC_KEYS } from "../.vitepress/shared";
import { loadStreamAnalyses } from "../.vitepress/utils";

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

    const entries = await loadStreamAnalyses();

    for (const { analysis, rawDate, date, streamId } of entries) {
      for (const finding of analysis.findings ?? []) {
        const currentTopic = topicMap[finding.topic];
        if (!currentTopic) continue;

        currentTopic.push({
          summary: finding.summary,
          quote: finding.quote,
          streamDate: date,
          streamRawDate: rawDate,
          streamId,
        });
      }
    }

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
