import type { FindingTopic, Significance } from "../../src/schemas";
import { defineLoader } from "vitepress";
import { loadStreamAnalyses } from "../.vitepress/utils";

export interface ModelStreamData {
  id: string;
  date: string;
  rawDate: string;
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
    const entries = await loadStreamAnalyses();

    const streamData: ModelStreamData[] = entries.map(
      ({ analysis, rawDate, date, streamId }) => {
        const topicCounts: Partial<Record<FindingTopic, number>> = {};
        for (const finding of analysis.findings ?? []) {
          topicCounts[finding.topic] = (topicCounts[finding.topic] || 0) + 1;
        }

        return {
          id: streamId,
          date,
          rawDate,
          excerpt: analysis.stream_context?.summary || "",
          significance: analysis.stream_context?.significance || "routine",
          significanceReason:
            analysis.stream_context?.significance_reason || null,
          level: analysis.stream_context?.level ?? [],
          topicCounts,
          quoteCount: analysis.memorable_quotes?.length ?? 0,
          storyCount: analysis.key_stories?.length ?? 0,
          questionCount: analysis.open_questions?.length ?? 0,
        };
      },
    );

    streamData.sort((a, b) => b.rawDate.localeCompare(a.rawDate));

    return streamData;
  },
});
