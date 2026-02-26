import { z } from "zod";
import { FindingTopicSchema, TeamMemberSchema } from "../analysis/schemas";
import { QUOTE_FORMATTING_INSTRUCTIONS } from "../constants";

// #region questions

const InterviewQuestionSchema = z.object({
  question: z.string().describe("A clear, open-ended interview question"),
  context: z
    .string()
    .describe(
      "Why this question matters for the documentary – what it could reveal",
    ),
  evidence: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "Brief references to specific stream evidence (e.g. 'June 2024: Kaze mentioned…')",
    ),
  priority: z
    .enum(["essential", "important", "nice-to-have"])
    .describe(
      "How critical this question is: essential = must-ask in a 1–2 hour interview, important = strong value, nice-to-have = ask if time permits",
    ),
});

export const InterviewQuestionsSchema = z.object({
  kaze: z
    .array(InterviewQuestionSchema)
    .max(35)
    .describe(
      "Questions for Kaze Emanuar's solo interview – covering vision, technical mastery, creative process, and personal journey",
    ),
  biobak: z
    .array(InterviewQuestionSchema)
    .max(25)
    .describe(
      "Questions for Biobak's solo interview – covering visual identity, level design, collaboration with Kaze",
    ),
  badub: z
    .array(InterviewQuestionSchema)
    .max(25)
    .describe(
      "Questions for Badub's solo interview – covering musical identity, N64 audio constraints, creative process",
    ),
  kaze_zeina: z
    .array(InterviewQuestionSchema)
    .max(25)
    .describe(
      "Questions for the joint Kaze & Zeina interview – covering their creative/personal partnership, animation work, life/art balance",
    ),
});

// #endregion questions

// #region quotes

const CuratedQuoteSchema = z.object({
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
    .describe("Brief context for why this quote matters or what prompted it"),
  stream_date: z.string().describe("YYYYMMDD format of the source stream"),
  use_case: z
    .enum([
      "narration",
      "trailer",
      "chapter-title",
      "character-moment",
      "emotional-beat",
    ])
    .describe("The documentary use case this quote is best suited for"),
});

export const CuratedQuotesSchema = z.object({
  quotes: z
    .array(CuratedQuoteSchema)
    .min(30)
    .max(80)
    .describe(
      "A generous selection pool of the strongest quotes across all streams, ranked by documentary impact – surface enough variety for the filmmaker to choose from",
    ),
});

// #endregion quotes

// #region stories

const RankedStorySchema = z.object({
  title: z.string().describe("A short, descriptive title for the story"),
  summary: z
    .string()
    .describe("A 2–4 sentence factual overview of what happened in this arc"),
  narrative_value: z
    .string()
    .describe(
      "Why this story matters for the documentary – what it reveals about the creator, the process, or the project",
    ),
  challenge: z.string().describe("The problem or tension that initiated this"),
  process: z
    .string()
    .describe("How Kaze or the team worked through the challenge"),
  outcome: z.string().describe("The resolution, learning, or current state"),
  key_quote: z
    .string()
    .nullable()
    .describe(
      `The most revealing quote from this story. ${QUOTE_FORMATTING_INSTRUCTIONS}`,
    ),
  related_to: z
    .array(TeamMemberSchema)
    .describe("Team members involved in or relevant to this story"),
  source_streams: z
    .array(z.string())
    .describe("YYYYMMDD dates of streams that contain this story"),
});

export const StoryHighlightsSchema = z.object({
  stories: z
    .array(RankedStorySchema)
    .min(15)
    .max(50)
    .describe(
      "A broad selection of narrative arcs across all streams, ranked by documentary potential – surface enough for the filmmaker to choose which stories to pursue",
    ),
});

// #endregion stories

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

export type InterviewQuestions = z.output<typeof InterviewQuestionsSchema>;
export type CuratedQuotes = z.output<typeof CuratedQuotesSchema>;
export type StoryHighlights = z.output<typeof StoryHighlightsSchema>;
export type TopicArcs = z.output<typeof TopicArcsSchema>;
export type TopicArc = z.output<typeof TopicArcSchema>;

// #endregion types
