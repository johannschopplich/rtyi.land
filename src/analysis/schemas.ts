import { z } from "zod";
import { QUOTE_FORMATTING_INSTRUCTIONS, TEAM_MEMBERS } from "../constants";

export const TeamMemberSchema = z
  .enum(TEAM_MEMBERS)
  .describe("Name of the team member");

export const FindingTopicSchema = z
  .enum([
    "design",
    "technical",
    "milestone",
    "philosophy",
    "personal",
    "team",
    "legal-nintendo",
    "community",
    "business",
  ])
  .describe("Primary topic category for filtering");

export const FindingImportanceSchema = z
  .enum(["high", "medium", "low"])
  .describe(
    "How important this finding is for the documentary narrative. High: project-defining decisions, emotional turning points, major revelations. Medium: meaningful context or insight. Low: minor or routine details included for completeness.",
  );

const FindingSchema = z.object({
  topic: FindingTopicSchema,
  importance: FindingImportanceSchema,
  summary: z
    .string()
    .describe("A concise, factual statement of what was discussed or revealed"),
  quote: z
    .string()
    .nullable()
    .describe(
      `A supporting quote, if particularly insightful. ${QUOTE_FORMATTING_INSTRUCTIONS}`,
    ),
});

const MemorableQuoteSchema = z.object({
  speaker: z
    .string()
    .describe(
      'Who said this (usually "Kaze", but could be Zeina or a chat participant)',
    ),
  quote: z
    .string()
    .describe(
      `The quote itself, verbatim or lightly cleaned up. ${QUOTE_FORMATTING_INSTRUCTIONS}`,
    ),
  context: z
    .string()
    .describe("Brief context for why this quote matters or what prompted it"),
});

const OtherContributorSchema = z.object({
  name: z.string().describe("Name or username of the contributor"),
  findings: z
    .array(FindingSchema)
    .describe("Notable contributions or insights from this person"),
});

const StorySchema = z.object({
  title: z
    .string()
    .describe("A short, non-catchy title for this story or incident"),
  summary: z.string().describe("A 2-3 sentence overview of the story"),
  challenge: z
    .string()
    .describe("The problem or challenge that initiated the story"),
  process: z
    .string()
    .describe("Steps taken by Kaze or the team to address the challenge"),
  outcome: z
    .string()
    .describe("The resolution, learning, or current state of the situation"),
  key_quote: z
    .string()
    .nullable()
    .describe(
      `The most revealing quote from this story. ${QUOTE_FORMATTING_INSTRUCTIONS}`,
    ),
  related_to: z
    .array(TeamMemberSchema)
    .describe("Team members involved or relevant to this story"),
});

const OpenQuestionSchema = z.object({
  topic: z
    .string()
    .describe("The subject that was mentioned but not fully explained"),
  context: z.string().describe("A brief summary of the information provided"),
  questions: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Follow-up questions to ask in the interview"),
  related_to: z
    .array(TeamMemberSchema)
    .describe("Team members who can provide more information on this topic"),
});

export const StreamAnalysisSchema = z.object({
  stream_context: z.object({
    summary: z
      .string()
      .describe(
        "A concise summary of the stream's main activity and key themes",
      ),
    level: z
      .array(z.string())
      .describe(
        'Specific game level(s) or area(s) being worked on. Use the format "Course N" or "Overworld". Add a short name only if clearly established (e.g. "Course 11 – Power Plant")',
      ),
    significance: z
      .enum(["routine", "notable", "milestone", "pivotal"])
      .describe("How significant this stream is for the documentary narrative"),
    significance_reason: z
      .string()
      .nullable()
      .describe("Why this stream is notable, if not routine"),
  }),

  findings: z
    .array(FindingSchema)
    .max(15)
    .describe("Key findings from the stream, tagged by topic and importance"),

  contributor_findings: z
    .object({
      biobak: z
        .array(FindingSchema)
        .describe("Contributions and insights from Biobak"),
      badub: z
        .array(FindingSchema)
        .describe("Contributions and insights from Badub"),
      zeina: z
        .array(FindingSchema)
        .describe("Contributions and insights from Zeina"),
      others: z
        .array(OtherContributorSchema)
        .max(2)
        .describe(
          "Only community members who directly influenced a design decision, contributed a concrete asset, or revealed information not available from the core team (e.g. Sauraen, ZeroVolt, Diablox)",
        ),
    })
    .describe("Findings about the core contributors or team dynamics"),

  memorable_quotes: z
    .array(MemorableQuoteSchema)
    .max(3)
    .describe(
      "The most character-defining, emotional, or insightful standalone quotes – ones that could serve as documentary narration or chapter titles",
    ),

  key_stories: z
    .array(StorySchema)
    .max(5)
    .describe("Self-contained narrative arcs to reference in interviews"),

  open_questions: z
    .array(OpenQuestionSchema)
    .max(5)
    .describe(
      "Newly introduced, surprising, or decision-driven topics that warrant interview follow-up. Skip generic questions. Depth over breadth.",
    ),
});

export type TeamMember = z.output<typeof TeamMemberSchema>;
export type FindingTopic = z.output<typeof FindingTopicSchema>;
export type FindingImportance = z.output<typeof FindingImportanceSchema>;
export type Finding = z.output<typeof FindingSchema>;
export type MemorableQuote = z.output<typeof MemorableQuoteSchema>;
export type Story = z.output<typeof StorySchema>;
export type OpenQuestion = z.output<typeof OpenQuestionSchema>;
export type StreamAnalysis = z.output<typeof StreamAnalysisSchema>;
export type Significance = StreamAnalysis["stream_context"]["significance"];
