import { z } from "zod";
import { FindingTopicSchema, TeamMemberSchema } from "../analysis/schemas";
import { QUOTE_FORMATTING_INSTRUCTIONS } from "../constants";

// #region story-threads

const StoryThreadQuoteSchema = z.object({
  speaker: z
    .string()
    .describe(
      'Who said this (usually "Kaze", but could be Zeina or a chat participant)',
    ),
  quote: z
    .string()
    .describe(`The quote itself. ${QUOTE_FORMATTING_INSTRUCTIONS}`),
  context: z
    .string()
    .describe(
      "Brief context for why this quote matters within this arc – what it reveals or illustrates",
    ),
  stream_date: z.string().describe("YYYYMMDD format of the source stream"),
});

const StoryThreadQuestionSchema = z.object({
  question: z
    .string()
    .describe(
      "An open-ended, storytelling-oriented interview question about this arc",
    ),
  target: z
    .enum(["kaze", "biobak", "badub", "kaze_zeina"])
    .describe("Who to ask this question"),
  rationale: z
    .string()
    .describe(
      "Why this question matters for the documentary – what it could reveal, referencing specific stream moments by describing what happened",
    ),
  source_streams: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "YYYYMMDD dates of streams that provide evidence for this question",
    ),
});

const StoryThreadSchema = z.object({
  title: z
    .string()
    .describe(
      'A vivid, narrative title for this arc (e.g. "The Zoo Catalyst: From Lag to Engine Rewrite")',
    ),
  summary: z.string().describe("A 2–3 sentence narrative summary of this arc"),
  narrative_value: z
    .string()
    .describe(
      "Why this arc matters for the documentary – what it reveals about the creator, the process, or the project",
    ),
  challenge: z.string().describe("The problem or tension that initiated this"),
  process: z
    .string()
    .describe("How Kaze or the team worked through the challenge"),
  outcome: z.string().describe("The resolution, learning, or current state"),
  key_quotes: z
    .array(StoryThreadQuoteSchema)
    .min(1)
    .max(5)
    .describe(
      "The strongest verbatim quotes that bring this arc to life – evidence, not decoration",
    ),
  interview_questions: z
    .array(StoryThreadQuestionSchema)
    .min(2)
    .max(7)
    .describe(
      "The best interview questions to ask about this arc – designed to elicit storytelling, not yes/no answers",
    ),
  related_to: z
    .array(TeamMemberSchema)
    .describe("Team members involved in or relevant to this arc"),
  source_streams: z
    .array(z.string())
    .describe("YYYYMMDD dates of streams that contain this arc"),
});

export const StoryThreadsSchema = z.object({
  arcs: z
    .array(StoryThreadSchema)
    .min(10)
    .max(25)
    .describe(
      "Story threads ranked by documentary potential – each thread is a self-contained narrative unit with embedded questions and quotes",
    ),
});

// #endregion story-threads

// #region narrative-arcs

const NarrativeArcSchema = z.object({
  title: z
    .string()
    .describe(
      'A vivid title for this narrative arc (e.g. "The Zoo Catalyst: The Real Origin Story")',
    ),
  narrative_goal: z
    .string()
    .describe(
      "What this arc achieves in the documentary – the emotional or thematic payoff",
    ),
  topics_to_cover: z
    .array(z.string())
    .min(3)
    .max(8)
    .describe(
      "Specific topics, moments, or questions to address when filming this arc",
    ),
  b_roll: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe(
      "Visual storytelling suggestions – concrete B-roll ideas to make this arc cinematic",
    ),
  team_members: z
    .array(TeamMemberSchema)
    .describe("Team members central to this arc"),
  source_streams: z
    .array(z.string())
    .min(1)
    .max(10)
    .describe(
      "YYYYMMDD dates of the most relevant source streams for this arc",
    ),
});

export const NarrativeArcsSchema = z.object({
  arcs: z
    .array(NarrativeArcSchema)
    .min(10)
    .max(20)
    .describe(
      "Thematic arcs that together form the documentary's filming roadmap – ordered to tell a coherent story",
    ),
});

// #endregion narrative-arcs

// #region topics

export const TopicArcSchema = z.object({
  topic: FindingTopicSchema,
  narrative_summary: z
    .string()
    .describe(
      "A 300–500 word narrative summary of how this topic evolved across the project timeline",
    ),
  key_themes: z
    .array(z.string())
    .max(5)
    .describe("Major recurring themes within this topic"),
  top_findings: z
    .array(
      z.object({
        summary: z.string().describe("The finding itself"),
        stream_date: z.string().describe("YYYYMMDD format"),
        // Intentionally excludes "low" – only high/medium findings are worth
        // surfacing in the curated synthesis layer.
        importance: z.enum(["high", "medium"]),
      }),
    )
    .max(20)
    .describe(
      "The most important findings for this topic across all streams – the essential reference for interview prep",
    ),
});

export const TopicArcsSchema = z.object({
  arcs: z
    .array(TopicArcSchema)
    .describe("One narrative arc per topic category"),
});

// #endregion topics

// #region types

export type StoryThreads = z.output<typeof StoryThreadsSchema>;
export type NarrativeArcs = z.output<typeof NarrativeArcsSchema>;
export type TopicArcs = z.output<typeof TopicArcsSchema>;
export type TopicArc = z.output<typeof TopicArcSchema>;

// #endregion types
