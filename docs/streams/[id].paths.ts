import type {
  Finding,
  FindingTopic,
  Significance,
  StreamAnalysis,
} from "../../src/analysis/schemas";
import { CORE_CONTRIBUTORS } from "../../src/constants";
import {
  capitalizeInitialLetter,
  formatTopicLabel,
} from "../.vitepress/shared";
import { loadStreamAnalyses } from "../.vitepress/utils";

function renderFindingsByTopic(findings: Finding[]): string {
  if (!findings.length) return "_No findings._";

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
  contributorFindings: StreamAnalysis["contributor_findings"],
): string {
  const sections: string[] = [];

  for (const member of CORE_CONTRIBUTORS) {
    const findings = contributorFindings[member];
    if (!findings.length) continue;
    sections.push(`
### ${capitalizeInitialLetter(member)}

${findings.map((finding) => `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`).join("\n\n")}
`);
  }

  const others = contributorFindings.others;
  if (others.length) {
    for (const other of others) {
      if (!other.findings.length) continue;
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
    const entries = await loadStreamAnalyses();

    const results = entries.map(({ analysis, rawDate, date, streamId }) => {
      const significance = analysis.stream_context.significance;
      const significanceBadge = SIGNIFICANCE_BADGES[significance];
      const significanceReason = analysis.stream_context.significance_reason;

      const level = analysis.stream_context.level;
      const levelDisplay = level.join(", ") || "Unknown";

      const markdownContent = `# Development Stream Analysis

::: tip Summary
**Date:** ${date}

**Level(s):** ${levelDisplay}

**Significance:** ${significanceBadge}${significanceReason ? ` — ${significanceReason}` : ""}
:::

## Stream Context

${analysis.stream_context.summary}

${
  analysis.memorable_quotes.length
    ? `## Memorable Quotes

${analysis.memorable_quotes
  .map(
    (memorableQuote) =>
      `> ${memorableQuote.quote}\n>\n> — **${memorableQuote.speaker}**${memorableQuote.context ? ` · _${memorableQuote.context}_` : ""}`,
  )
  .join("\n\n")}
`
    : ""
}
## Findings

${renderFindingsByTopic(analysis.findings)}

## Contributor Findings

${renderContributorFindings(analysis.contributor_findings)}

## Key Stories

${
  analysis.key_stories.length
    ? analysis.key_stories
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
  analysis.open_questions.length
    ? analysis.open_questions
        .map(
          (item) => `
### ${item.topic}

**Context:** ${item.context}

**Relevant to:** ${item.related_to.map(capitalizeInitialLetter).join(", ")}

**Questions:**

${item.questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}
`,
        )
        .join("")
    : "_No open questions._"
}`;

      return {
        params: {
          id: streamId,
          rawDate,
        },
        content: markdownContent,
      };
    });

    return results.sort((a, b) =>
      a.params.rawDate.localeCompare(b.params.rawDate),
    );
  },
};
