import { z } from "zod";

const SummaryPointSchema = z.object({
  point: z
    .string()
    .describe(
      "An interpretive summary of a key finding, decision, or fact from the stream.",
    ),
  supporting_quote: z
    .string()
    .nullable()
    .describe(
      "An optional, direct quote from the transcript that serves as powerful evidence for the point.",
    ),
});

const KeyFindingsSchema = z.object({
  development_and_design: z
    .array(SummaryPointSchema)
    .describe(
      'The "What": Key points about game status, design decisions, creative iteration, technical challenges, and specific feature implementation.',
    ),
  creator_and_collaboration: z
    .array(SummaryPointSchema)
    .describe(
      'The "Who": Key points about Kaze\'s personal philosophies, emotional journey, and information on collaborator contributions and team dynamics.',
    ),
  strategy_and_context: z
    .array(SummaryPointSchema)
    .describe(
      'The "How": Key points about funding, release strategy, legal concerns, community interaction, and personal life context.',
    ),
});

const DocumentarySceneSchema = z.object({
  scene_description: z
    .string()
    .describe(
      "A description of a concrete moment from the stream that would work well as a visual or narrative scene in the documentary.",
    ),
  supporting_quote: z
    .string()
    .describe("The key quote that anchors this potential scene."),
});

const InterviewTopicsSchema = z.object({
  kaze: z
    .array(z.string())
    .describe("Actionable interview topics specifically for Kaze Emanuar."),
  biobak: z
    .array(z.string())
    .describe(
      "Actionable interview topics specifically for Biobak, based on information from the stream.",
    ),
  badub: z
    .array(z.string())
    .describe(
      "Actionable interview topics specifically for Badub, based on information from the stream.",
    ),
  zeina: z
    .array(z.string())
    .describe(
      "Actionable interview topics specifically for Zeina, based on information from the stream.",
    ),
  general_team: z
    .array(z.string())
    .describe("High-level topics that could be asked of any team member."),
});

// Part 1: The Director's Briefing Schema
const NarrativeBriefingSchema = z.object({
  stream_synopsis: z
    .string()
    .describe(
      "A single paragraph summarizing the stream's overall focus, key activities, and general tone.",
    ),
  key_findings: KeyFindingsSchema.describe(
    "A comprehensive, categorized collection of the most important information from the stream.",
  ),
  potential_documentary_scenes: z
    .array(DocumentarySceneSchema)
    .describe(
      "A curated list of 3-5 concrete moments ideal for inclusion in the documentary.",
    ),
  potential_interview_topics: InterviewTopicsSchema.describe(
    "A list of targeted, actionable interview topics for each team member.",
  ),
});

// Part 2: The Research Log Schema
const EventSchema = z.object({
  time_marker: z
    .string()
    .describe(
      'A descriptive string indicating when in the stream this happened (e.g., "Start of stream", "During Overworld blockout").',
    ),
  summary: z
    .string()
    .describe(
      "A concise, one-sentence summary of what is happening or being discussed in this moment.",
    ),
  quote: z
    .string()
    .describe(
      "The single most representative raw quote from the transcript for this moment.",
    ),
  type: z
    .enum([
      "Technical",
      "Design",
      "Collaboration",
      "Philosophy",
      "Community",
      "Personal",
    ])
    .describe("The primary category of the moment."),
  people_involved: z
    .array(z.enum(["Kaze", "Biobak", "Badub", "Zeina", "Chat", "Other"]))
    .describe(
      "An array of names of the people or roles actively mentioned or involved.",
    ),
  connections: z
    .object({
      level: z
        .string()
        .nullable()
        .describe(
          'The specific game level being discussed, if any (e.g., "Overworld", "Course 2").',
        ),
      feature: z
        .string()
        .nullable()
        .describe("The specific game feature or character being discussed."),
    })
    .describe("Links this event to specific in-game elements."),
  significance: z
    .string()
    .describe(
      "Brief analysis (1-2 sentences) of why this moment is valuable for the documentary; what it reveals.",
    ),
  potential_narrative_arc: z
    .string()
    .nullable()
    .describe("If this moment suggests a narrative arc, describe it here."),
});

// The final, top-level schema for the entire JSON output
export const TranscriptAnalysisSchema = z.object({
  narrative_briefing: NarrativeBriefingSchema.describe(
    "The Director's Briefing: A comprehensive, high-level summary for quick orientation and targeted interview topic generation.",
  ),
  timeline_of_events: z
    .array(EventSchema)
    .describe(
      "The Research Log: A detailed, chronological log of specific moments for deep research and contextual analysis.",
    ),
});
