import type { FindingTopic } from "../../src/analysis/schemas";
import { formatTopicLabel, TOPIC_KEYS } from "../.vitepress/shared";
import { loadStreamAnalyses } from "../.vitepress/utils";

interface TopicFinding {
  summary: string;
  quote: string | null;
  streamDate: string;
  streamRawDate: string;
  streamId: string;
}

export default {
  async paths() {
    const topicMap: Partial<Record<FindingTopic, TopicFinding[]>> = {};

    for (const key of TOPIC_KEYS) {
      topicMap[key] = [];
    }

    const entries = await loadStreamAnalyses();

    for (const { analysis, rawDate, date, streamId } of entries) {
      for (const finding of analysis.findings) {
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

    return TOPIC_KEYS.map((topic) => {
      const findings = topicMap[topic]!;
      findings.sort((a, b) => a.streamRawDate.localeCompare(b.streamRawDate));

      const label = formatTopicLabel(topic);
      const uniqueStreams = new Set(
        findings.map((finding) => finding.streamId),
      );

      const byStream: Record<
        string,
        { date: string; id: string; findings: TopicFinding[] }
      > = {};
      for (const finding of findings) {
        byStream[finding.streamId] ??= {
          date: finding.streamDate,
          id: finding.streamId,
          findings: [],
        };
        byStream[finding.streamId].findings.push(finding);
      }

      const streamGroups = Object.values(byStream).sort((a, b) =>
        a.findings[0].streamRawDate.localeCompare(b.findings[0].streamRawDate),
      );

      const markdownContent = `# ${label} Findings

All **${label.toLowerCase()}** findings from stream analyses, listed by stream date.

[← All Topics](/topics/index.md) · [Team Profiles](/team/index.md) · [Quotes](/quotes/index.md)

::: tip Summary
**Total Findings:** ${findings.length}

**Streams:** ${uniqueStreams.size}
:::

${streamGroups
  .map(
    (group) => `
## [${group.date}](/streams/${group.id})

${group.findings
  .map(
    (finding) =>
      `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`,
  )
  .join("\n\n")}
`,
  )
  .join("")}
`;

      return {
        params: { id: topic },
        content: markdownContent,
      };
    });
  },
};
