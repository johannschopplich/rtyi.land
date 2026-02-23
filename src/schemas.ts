import { z } from "zod";

const QUOTE_INSTRUCTIONS =
  "Minor grammatical errors should be corrected and surrounding quotation marks must be omitted.";

const TeamMemberSchema = z
  .enum(["kaze", "biobak", "badub", "zeina"])
  .describe("Name of the team member");

const FindingTopicSchema = z
  .enum([
    "design-decision",
    "technical-breakthrough",
    "creative-process",
    "milestone",
    "philosophy",
    "influence",
    "personal",
    "team-dynamics",
    "legal-nintendo",
    "community",
    "business",
  ])
  .describe("Primary topic category for filtering");

const FindingSchema = z.object({
  topic: FindingTopicSchema,
  summary: z
    .string()
    .describe("A concise, factual statement of what was discussed or revealed"),
  quote: z
    .string()
    .nullable()
    .describe(
      `An optional, supporting quote if particularly insightful. ${QUOTE_INSTRUCTIONS}`,
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
      `The quote itself, verbatim or lightly cleaned up. ${QUOTE_INSTRUCTIONS}`,
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
    .describe(
      `The most revealing quote from this story. ${QUOTE_INSTRUCTIONS}`,
    ),
  related_to: z
    .array(TeamMemberSchema)
    .describe("Team members involved or relevant to this story"),
});

const OpenQuestionSchema = z.object({
  topic: z
    .string()
    .describe("The subject that was mentioned but not fully explained"),
  context: z
    .string()
    .describe(
      "A brief summary of the information that was provided in the stream",
    ),
  questions: z
    .array(z.string())
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
        'Specific game level(s) or area(s) being worked on (e.g. "Course 1", "Overworld")',
      ),
    significance: z
      .enum(["routine", "notable", "milestone", "pivotal"])
      .describe("How significant this stream is for the documentary narrative"),
    significance_reason: z
      .string()
      .nullable()
      .describe("Why this stream is notable, if not routine"),
  }),

  development_findings: z
    .array(FindingSchema)
    .describe(
      "Key findings about the game's development, design decisions, technical aspects, and creative process",
    ),

  context_findings: z
    .array(FindingSchema)
    .describe(
      "Findings about Kaze's personal context, emotions, philosophy, or external factors (community, legal, business)",
    ),

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
        .describe(
          "Notable contributions from other community members (e.g. Lilaa, Sauraen, ZeroVolt)",
        ),
    })
    .describe("Findings about the core contributors or team dynamics"),

  memorable_quotes: z
    .array(MemorableQuoteSchema)
    .max(3)
    .describe(
      "The most character-defining, emotional, or insightful standalone quotes from this stream – quotes that could serve as documentary narration or chapter titles",
    ),

  key_stories: z
    .array(StorySchema)
    .max(5)
    .describe("Self-contained narrative arcs to reference in interviews"),

  open_questions: z
    .array(OpenQuestionSchema)
    .describe(
      "Unresolved topics or knowledge gaps that translate directly into interview questions",
    ),
});
