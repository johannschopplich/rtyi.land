import * as path from "node:path";
import { tryParseJSON } from "utilful";
import {
  STREAM_ANALYSIS_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

function formatMemberName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default {
  async paths() {
    const results = await globAndProcessFiles(
      "**/*.json",
      TRANSCRIPTS_OUTPUT_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== STREAM_ANALYSIS_DIR) return;

        const streamData = tryParseJSON<Record<string, any>>(fileContent);

        if (!streamData) {
          throw new Error(
            `Failed to parse JSON for ${fileName}. Check the file format!`,
          );
        }

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        // Generate markdown content
        const markdownContent = `# Development Stream Analysis

::: tip Summary
**Date:** ${formattedDate}

**Model:** ${modelDir}

**Level(s):** ${streamData.stream_context?.level?.join(", ") || "Unknown"}
:::

## Stream Context

${streamData.stream_context?.summary || "No summary available."}

## Development Findings

${streamData.development_findings
  .map(
    (finding: any) =>
      `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`,
  )
  .join("\n\n")}

## Context Findings

${streamData.context_findings
  .map(
    (finding: any) =>
      `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`,
  )
  .join("\n\n")}

## Contributor Findings

${Object.entries(streamData.contributor_findings)
  .filter(([_, findings]: [string, any]) => findings.length > 0)
  .map(
    ([member, findings]: [string, any]) => `
### ${formatMemberName(member)}

${findings.map((finding: any) => `- ${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`).join("\n\n")}
`,
  )
  .join("")}

## Key Stories

${
  streamData.key_stories?.length
    ? streamData.key_stories
        .map(
          (story: any) => `
::: info ${story.title}

**Summary:** ${story.summary}

**Challenge:** ${story.challenge}

**Process:** ${story.process}

**Outcome:** ${story.outcome}

${story.key_quote ? `**Key Quote:**\n> ${story.key_quote}\n` : ""}
${story.related_to?.length ? `**Related to:** ${story.related_to.map(formatMemberName).join(", ")}` : ""}

:::
`,
        )
        .join("")
    : "No key stories available."
}

## Open Questions

${
  streamData.open_questions?.length
    ? streamData.open_questions
        .map(
          (item: any) => `
### ${item.topic}

**Context:** ${item.context}

**Relevant to:** ${item.related_to.map(formatMemberName).join(", ")}

**Questions:**

${item.questions.map((question: string, index: number) => `${index + 1}. ${question}`).join("\n")}
`,
        )
        .join("")
    : "No open questions available."
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
