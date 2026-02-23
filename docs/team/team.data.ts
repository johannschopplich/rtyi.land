import type { FindingTopic, TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { capitalizeInitialLetter } from "../.vitepress/shared";
import { loadStreamAnalyses } from "../.vitepress/utils";

export interface TeamFinding {
  summary: string;
  quote: string | null;
  topic?: FindingTopic;
}

export interface TeamQuote {
  speaker: string;
  quote: string;
  context: string;
  streamDate: string;
  streamId: string;
}

export interface TeamStory {
  title: string;
  summary: string;
  challenge: string;
  process: string;
  outcome: string;
  keyQuote: string | null;
  streamDate: string;
  streamId: string;
}

export interface TeamStreamEntry {
  date: string;
  rawDate: string;
  id: string;
  findings: TeamFinding[];
  stories: TeamStory[];
  quotes: TeamQuote[];
}

export interface TeamMemberData {
  name: TeamMember;
  label: string;
  streams: TeamStreamEntry[];
  totalFindings: number;
  totalStories: number;
  totalQuotes: number;
}

const CORE_MEMBERS: TeamMember[] = ["kaze", "biobak", "badub", "zeina"];

export default defineLoader({
  async load() {
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
          member !== "kaze"
            ? analysis.contributor_findings?.[member]
            : undefined;
        if (Array.isArray(contributorFindings)) {
          for (const finding of contributorFindings) {
            findings.push({
              summary: finding.summary,
              quote: finding.quote,
              topic: finding.topic,
            });
          }
        }

        for (const story of analysis.key_stories ?? []) {
          if (story.related_to?.includes(member)) {
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

        for (const memorableQuote of analysis.memorable_quotes ?? []) {
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

    const result: Record<TeamMember, TeamMemberData> = {} as Record<
      TeamMember,
      TeamMemberData
    >;
    for (const member of CORE_MEMBERS) {
      const streams = memberMap[member].sort((a, b) =>
        a.rawDate.localeCompare(b.rawDate),
      );

      result[member] = {
        name: member,
        label: capitalizeInitialLetter(member),
        streams,
        totalFindings: streams.reduce(
          (sum, stream) => sum + stream.findings.length,
          0,
        ),
        totalStories: streams.reduce(
          (sum, stream) => sum + stream.stories.length,
          0,
        ),
        totalQuotes: streams.reduce(
          (sum, stream) => sum + stream.quotes.length,
          0,
        ),
      };
    }

    return result;
  },
});
