import type { FindingTopic, TeamMember } from "../../src/analysis/schemas";
import {
  capitalizeInitialLetter,
  formatTopicLabel,
} from "../.vitepress/shared";
import { loadStreamAnalyses } from "../.vitepress/utils";

interface TeamFinding {
  summary: string;
  quote: string | null;
  topic?: FindingTopic;
}

interface TeamStory {
  title: string;
  summary: string;
  challenge: string;
  process: string;
  outcome: string;
  keyQuote: string | null;
  streamDate: string;
  streamId: string;
}

interface TeamQuote {
  speaker: string;
  quote: string;
  context: string;
  streamDate: string;
  streamId: string;
}

interface TeamStreamEntry {
  date: string;
  rawDate: string;
  id: string;
  findings: TeamFinding[];
  stories: TeamStory[];
  quotes: TeamQuote[];
}

const CORE_MEMBERS: TeamMember[] = ["kaze", "biobak", "badub", "zeina"];

const MEMBER_ROLES: Record<TeamMember, string> = {
  kaze: "Lead Developer & Project Creator",
  biobak: "Graphics Artist & Level Designer",
  badub: "Composer & Audio Engineer",
  zeina: "Animator & Character Artist",
};

export default {
  async paths() {
    const memberMap: Record<TeamMember, TeamStreamEntry[]> = {
      kaze: [],
      biobak: [],
      badub: [],
      zeina: [],
    };

    const entries = await loadStreamAnalyses();

    for (const { analysis, rawDate, date, streamId } of entries) {
      for (const member of CORE_MEMBERS) {
        const findings: TeamFinding[] = [];
        const stories: TeamStory[] = [];
        const quotes: TeamQuote[] = [];

        const contributorFindings =
          member !== "kaze" ? analysis.contributor_findings[member] : undefined;
        if (Array.isArray(contributorFindings)) {
          for (const finding of contributorFindings) {
            findings.push({
              summary: finding.summary,
              quote: finding.quote,
              topic: finding.topic,
            });
          }
        }

        for (const story of analysis.key_stories) {
          if (story.related_to.includes(member)) {
            stories.push({
              title: story.title,
              summary: story.summary,
              challenge: story.challenge,
              process: story.process,
              outcome: story.outcome,
              keyQuote: story.key_quote,
              streamDate: date,
              streamId,
            });
          }
        }

        for (const memorableQuote of analysis.memorable_quotes) {
          if (memorableQuote.speaker.toLowerCase() === member) {
            quotes.push({
              speaker: memorableQuote.speaker,
              quote: memorableQuote.quote,
              context: memorableQuote.context,
              streamDate: date,
              streamId,
            });
          }
        }

        if (findings.length || stories.length || quotes.length) {
          memberMap[member].push({
            date,
            rawDate,
            id: streamId,
            findings,
            stories,
            quotes,
          });
        }
      }
    }

    return CORE_MEMBERS.map((member) => {
      const streams = memberMap[member].sort((a, b) =>
        a.rawDate.localeCompare(b.rawDate),
      );

      const totalFindings = streams.reduce(
        (sum, stream) => sum + stream.findings.length,
        0,
      );
      const totalStories = streams.reduce(
        (sum, stream) => sum + stream.stories.length,
        0,
      );
      const totalQuotes = streams.reduce(
        (sum, stream) => sum + stream.quotes.length,
        0,
      );

      const label = capitalizeInitialLetter(member);
      const role = MEMBER_ROLES[member];

      const allQuotes = streams.flatMap((stream) => stream.quotes);
      const allStories = streams.flatMap((stream) => stream.stories);

      const markdownContent = `# ${label} – Stream Profile

**Role:** ${role}

[← All Team Profiles](/team/index.md) · [Interview Prep](/synthesis/interview-prep)

::: tip Summary
**Streams with Mentions:** ${streams.length}

**Findings:** ${totalFindings} · **Stories:** ${totalStories} · **Quotes:** ${totalQuotes}
:::

${
  allQuotes.length
    ? `## Memorable Quotes

${allQuotes
  .map(
    (q) =>
      `> ${q.quote}\n>\n> — **${q.speaker}**, [${q.streamDate}](/streams/${q.streamId})${q.context ? ` · _${q.context}_` : ""}`,
  )
  .join("\n\n")}
`
    : ""
}
${
  allStories.length
    ? `## Key Stories

${allStories
  .map(
    (story) => `
::: info ${story.title}
_[${story.streamDate}](/streams/${story.streamId})_

**Summary:** ${story.summary}

**Challenge:** ${story.challenge}

**Process:** ${story.process}

**Outcome:** ${story.outcome}

${story.keyQuote ? `**Key Quote:**\n> ${story.keyQuote}\n` : ""}
:::
`,
  )
  .join("")}
`
    : ""
}
## Findings by Stream

${streams
  .map(
    (stream) => `
### [${stream.date}](/streams/${stream.id})

${stream.findings
  .map(
    (finding) =>
      `- ${finding.topic ? `**[${formatTopicLabel(finding.topic)}]** ` : ""}${finding.summary}${finding.quote ? `\n  > ${finding.quote}` : ""}`,
  )
  .join("\n\n")}
`,
  )
  .join("")}
`;

      return {
        params: { id: member },
        content: markdownContent,
      };
    });
  },
};
