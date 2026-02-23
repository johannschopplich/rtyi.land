import { z } from "zod";
import { FindingTopicSchema, TeamMemberSchema } from "../analysis/schemas";

const QUOTE_INSTRUCTIONS =
  "Minor grammatical errors should be corrected and surrounding quotation marks must be omitted.";

// #region interview-questions

const InterviewQuestionSchema = z.object({
  question: z.string().describe("A clear, open-ended interview question"),
  context: z
    .string()
    .describe(
      "Why this question matters for the documentary – what it could reveal",
    ),
  evidence: z
    .array(z.string())
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
    .max(50)
    .describe(
      "Questions for Kaze Emanuar's solo interview – covering vision, technical mastery, creative process, and personal journey",
    ),
  biobak: z
    .array(InterviewQuestionSchema)
    .max(40)
    .describe(
      "Questions for Biobak's solo interview – covering visual identity, level design, collaboration with Kaze",
    ),
  badub: z
    .array(InterviewQuestionSchema)
    .max(40)
    .describe(
      "Questions for Badub's solo interview – covering musical identity, N64 audio constraints, creative process",
    ),
  kaze_zeina: z
    .array(InterviewQuestionSchema)
    .max(40)
    .describe(
      "Questions for the joint Kaze & Zeina interview – covering their creative/personal partnership, animation work, life/art balance",
    ),
});

// #endregion interview-questions

// #region curated-quotes

const CuratedQuoteSchema = z.object({
  speaker: z.string().describe("Who said this"),
  quote: z.string().describe(`The quote itself. ${QUOTE_INSTRUCTIONS}`),
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
    .max(80)
    .describe(
      "The absolute best quotes across all streams, ranked by documentary impact",
    ),
});

// #endregion curated-quotes

// #region story-highlights

const RankedStorySchema = z.object({
  title: z.string().describe("A short, descriptive title for the story"),
  summary: z.string().describe("A 2–4 sentence overview of the narrative arc"),
  narrative_value: z
    .string()
    .describe("Why this story matters for the documentary"),
  challenge: z.string().describe("The problem or tension that initiated this"),
  process: z
    .string()
    .describe("How Kaze or the team worked through the challenge"),
  outcome: z.string().describe("The resolution, learning, or current state"),
  key_quote: z
    .string()
    .nullable()
    .describe(
      `The most revealing quote from this story. ${QUOTE_INSTRUCTIONS}`,
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
    .max(50)
    .describe(
      "The strongest narrative arcs across all streams, ranked by documentary potential",
    ),
});

// #endregion story-highlights

// #region topic-arcs

const TopicArcSchema = z.object({
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
        importance: z.enum(["high", "medium"]),
      }),
    )
    .max(20)
    .describe(
      "The most important findings for this topic across all streams – the essential reference for interview prep",
    ),
  interview_angles: z
    .array(z.string())
    .max(5)
    .describe(
      "Best angles to explore this topic in interviews – framed as conversation starters, not questions",
    ),
});

export const TopicArcsSchema = z.object({
  arcs: z
    .array(TopicArcSchema)
    .describe("One narrative arc per topic category"),
});

// #endregion topic-arcs

// #region project-timeline

const TimelinePhaseSchema = z.object({
  title: z.string().describe("A short name for this development phase"),
  date_range: z
    .string()
    .describe("Human-readable range, e.g. 'April–August 2023'"),
  summary: z
    .string()
    .describe(
      "A 2–4 sentence summary of what happened during this phase of development",
    ),
  key_milestones: z
    .array(
      z.object({
        date: z.string().describe("YYYYMMDD format"),
        event: z.string().describe("What happened"),
      }),
    )
    .describe("Specific dated milestones within this phase"),
  mood: z.string().describe("The emotional tone of this phase"),
});

export const ProjectTimelineSchema = z.object({
  overview: z
    .string()
    .describe(
      "A 200–400 word overview of the project's evolution, written as a documentary researcher's summary",
    ),
  phases: z.array(TimelinePhaseSchema).describe("Chronological project phases"),
});

// #endregion project-timeline
