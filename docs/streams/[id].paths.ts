import type {
  Finding,
  FindingTopic,
  Significance,
  StreamAnalysis,
} from "../../src/schemas";
import * as path from "node:path";
import { tryParseJSON } from "utilful";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import {
  capitalizeInitialLetter,
  formatDateFromYYYYMMDD,
  formatTopicLabel,
} from "../.vitepress/shared";
import { globAndProcessFiles } from "../.vitepress/utils";

function renderFindingsByTopic(findings: Finding[]): string {
  if (!findings?.length) return "_No findings._";

  const byTopic: Partial<Record<FindingTopic, Finding[]>> = {};
  for (const finding of findings) {
    byTopic[finding.topic] ??= [];
    byTopic[finding.topic]!.push(finding);
  }

  return Object.entries(byTopic)
    .map(
      ([topic, topicFindings]) => `
### ${formatTopicLabel(topic as FindingTopic)}

${topicFindings!
  .map(
    (finding) =>
      `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`,
  )
  .join("\n\n")}`,
    )
    .join("\n");
}

function renderContributorFindings(
  contributorFindings: StreamAnalysis["contributor_findings"] | undefined,
): string {
  if (!contributorFindings) return "_No contributor findings._";

  const sections: string[] = [];

  for (const member of ["biobak", "badub", "zeina"] as const) {
    const findings = contributorFindings[member];
    if (!findings?.length) continue;
    sections.push(`
### ${capitalizeInitialLetter(member)}

${findings.map((finding) => `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`).join("\n\n")}
`);
  }

  const others = contributorFindings.others;
  if (others?.length) {
    for (const other of others) {
      if (!other.findings?.length) continue;
      sections.push(`
### ${other.name}

${other.findings.map((finding) => `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`).join("\n\n")}
`);
    }
  }

  return sections.length > 0 ? sections.join("") : "_No contributor findings._";
}

const SIGNIFICANCE_BADGES: Record<Significance, string> = {
  routine: "⚪ Routine",
  notable: "🔵 Notable",
  milestone: "🟢 Milestone",
  pivotal: "🟠 Pivotal",
};

export default {
  async paths() {
    const results = await globAndProcessFiles(
      "**/*.json",
      TRANSCRIPTS_OUTPUT_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== STREAM_ANALYSIS_DIR) return;

        const streamData = tryParseJSON<StreamAnalysis>(fileContent);

        if (!streamData) {
          throw new Error(
            `Failed to parse JSON for ${fileName}. Check the file format!`,
          );
        }

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        const significance = streamData.stream_context?.significance;
        const significanceBadge =
          SIGNIFICANCE_BADGES[significance] || significance || "Unknown";
        const significanceReason =
          streamData.stream_context?.significance_reason;

        const level = streamData.stream_context?.level ?? [];
        const levelDisplay = level.join(", ") || "Unknown";

        const markdownContent = `# Development Stream Analysis

::: tip Summary
**Date:** ${formattedDate}

**Model:** ${modelDir}

**Level(s):** ${levelDisplay}

**Significance:** ${significanceBadge}${significanceReason ? ` — ${significanceReason}` : ""}
:::

## Stream Context

${streamData.stream_context?.summary || "No summary available."}

${
  streamData.memorable_quotes?.length
    ? `## Memorable Quotes

${streamData.memorable_quotes
  .map(
    (memorableQuote) =>
      `> ${memorableQuote.quote}\n>\n> — **${memorableQuote.speaker}**${memorableQuote.context ? ` · _${memorableQuote.context}_` : ""}`,
  )
  .join("\n\n")}
`
    : ""
}
## Findings

${renderFindingsByTopic(streamData.findings)}

## Contributor Findings

${renderContributorFindings(streamData.contributor_findings)}

## Key Stories

${
  streamData.key_stories?.length
    ? streamData.key_stories
        .map(
          (story) => `
::: info ${story.title}

**Summary:** ${story.summary}

**Challenge:** ${story.challenge}

**Process:** ${story.process}

**Outcome:** ${story.outcome}

${story.key_quote ? `**Key Quote:**\n> ${story.key_quote}\n` : ""}
${story.related_to.length ? `**Related to:** ${story.related_to.map(capitalizeInitialLetter).join(", ")}` : ""}

:::
`,
        )
        .join("")
    : "_No key stories._"
}

## Open Questions

${
  streamData.open_questions?.length
    ? streamData.open_questions
        .map(
          (item) => `
### ${item.topic}

**Context:** ${item.context}

**Relevant to:** ${item.related_to.map(capitalizeInitialLetter).join(", ")}

**Questions:**

${item.questions.map((question: string, index: number) => `${index + 1}. ${question}`).join("\n")}
`,
        )
        .join("")
    : "_No open questions._"
}`;

        return {
          params: {
            id: `${modelDir}-${rawDate}`,
            rawDate,
            model: modelDir,
          },
          content: markdownContent,
        };
      },
    );

    // Sort by model directory first, then by date
    return results.sort((a, b) => {
      if (a.params.model !== b.params.model) {
        return a.params.model.localeCompare(b.params.model);
      }

      return a.params.rawDate.localeCompare(b.params.rawDate);
    });
  },
};
