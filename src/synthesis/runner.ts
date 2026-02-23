import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { StreamAnalysis } from "../analysis/schemas";
import { generateText, Output } from "ai";
import { template } from "utilful";
import {
  CURATED_QUOTES_PROMPT,
  INTERVIEW_QUESTIONS_PROMPT,
  PROJECT_TIMELINE_PROMPT,
  STORY_HIGHLIGHTS_PROMPT,
  TOPIC_ARCS_PROMPT,
} from "./prompts";
import {
  CuratedQuotesSchema,
  InterviewQuestionsSchema,
  ProjectTimelineSchema,
  StoryHighlightsSchema,
  TopicArcsSchema,
} from "./schemas";

const OPENAI_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high",
  } satisfies OpenAILanguageModelChatOptions,
};

const CORE_CONTRIBUTORS = ["biobak", "badub", "zeina"] as const;

export type SynthesisTask =
  | "interview-questions"
  | "curated-quotes"
  | "story-highlights"
  | "topic-arcs"
  | "project-timeline";

export interface ParsedStream {
  rawDate: string;
  fileName: string;
  analysis: StreamAnalysis;
}

interface SynthesisOptions {
  task: SynthesisTask;
  model: LanguageModelV3;
  streams: ParsedStream[];
  existingQuestions: string;
  dateRange: string;
}

export async function runSynthesisTask(options: SynthesisOptions) {
  const { task, model, streams, existingQuestions, dateRange } = options;

  switch (task) {
    case "interview-questions":
      return runInterviewQuestions(
        model,
        streams,
        existingQuestions,
        dateRange,
      );
    case "curated-quotes":
      return runCuratedQuotes(model, streams);
    case "story-highlights":
      return runStoryHighlights(model, streams);
    case "topic-arcs":
      return runTopicArcs(model, streams);
    case "project-timeline":
      return runProjectTimeline(model, streams, dateRange);
  }
}

// #region interview-questions
async function runInterviewQuestions(
  model: LanguageModelV3,
  streams: ParsedStream[],
  existingQuestions: string,
  dateRange: string,
) {
  // Collect all open questions with stream dates
  const openQuestions = streams.flatMap((stream) =>
    stream.analysis.open_questions.map((question) => ({
      stream_date: stream.rawDate,
      ...question,
    })),
  );

  // Collect all findings with stream dates (summary + topic only, for efficiency)
  const findings = streams.flatMap((stream) =>
    stream.analysis.findings.map((finding) => ({
      stream_date: stream.rawDate,
      topic: finding.topic,
      summary: finding.summary,
    })),
  );

  // Collect key stories with stream dates
  const keyStories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      title: story.title,
      summary: story.summary,
      related_to: story.related_to,
    })),
  );

  const prompt = template(INTERVIEW_QUESTIONS_PROMPT, {
    stream_count: String(streams.length),
    date_range: dateRange,
    existing_questions: existingQuestions || "(No existing questions provided)",
    open_questions: JSON.stringify(openQuestions),
    findings: JSON.stringify(findings),
    key_stories: JSON.stringify(keyStories),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: InterviewQuestionsSchema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output;
}
// #endregion interview-questions

// #region curated-quotes
async function runCuratedQuotes(
  model: LanguageModelV3,
  streams: ParsedStream[],
) {
  // Collect all memorable quotes with stream dates
  const quotes = streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      ...quote,
    })),
  );

  const prompt = template(CURATED_QUOTES_PROMPT, {
    quote_count: String(quotes.length),
    stream_count: String(streams.length),
    quotes: JSON.stringify(quotes),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: CuratedQuotesSchema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output;
}
// #endregion curated-quotes

// #region story-highlights
async function runStoryHighlights(
  model: LanguageModelV3,
  streams: ParsedStream[],
) {
  // Collect all key stories with stream dates
  const stories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      ...story,
    })),
  );

  const prompt = template(STORY_HIGHLIGHTS_PROMPT, {
    story_count: String(stories.length),
    stream_count: String(streams.length),
    stories: JSON.stringify(stories),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: StoryHighlightsSchema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output;
}
// #endregion story-highlights

// #region topic-arcs
async function runTopicArcs(model: LanguageModelV3, streams: ParsedStream[]) {
  // Group all findings by topic, including stream date
  const findingsByTopic: Record<
    string,
    Array<{ stream_date: string; summary: string; quote: string | null }>
  > = {};

  for (const stream of streams) {
    for (const finding of stream.analysis.findings) {
      if (!findingsByTopic[finding.topic]) {
        findingsByTopic[finding.topic] = [];
      }

      findingsByTopic[finding.topic].push({
        stream_date: stream.rawDate,
        summary: finding.summary,
        quote: finding.quote,
      });
    }

    // Also include contributor findings
    for (const member of CORE_CONTRIBUTORS) {
      for (const finding of stream.analysis.contributor_findings[member]) {
        if (!findingsByTopic[finding.topic]) {
          findingsByTopic[finding.topic] = [];
        }

        findingsByTopic[finding.topic].push({
          stream_date: stream.rawDate,
          summary: `[${member}] ${finding.summary}`,
          quote: finding.quote,
        });
      }
    }
  }

  const prompt = template(TOPIC_ARCS_PROMPT, {
    stream_count: String(streams.length),
    findings_by_topic: JSON.stringify(findingsByTopic),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: TopicArcsSchema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output;
}
// #endregion topic-arcs

// #region project-timeline
async function runProjectTimeline(
  model: LanguageModelV3,
  streams: ParsedStream[],
  dateRange: string,
) {
  // Collect stream contexts (lightweight)
  const streamContexts = streams.map((stream) => ({
    date: stream.rawDate,
    ...stream.analysis.stream_context,
  }));

  // Collect milestone-tagged findings
  const milestoneFindings = streams.flatMap((stream) =>
    stream.analysis.findings
      .filter((finding) => finding.topic === "milestone")
      .map((finding) => ({
        stream_date: stream.rawDate,
        summary: finding.summary,
      })),
  );

  const prompt = template(PROJECT_TIMELINE_PROMPT, {
    stream_count: String(streams.length),
    date_range: dateRange,
    stream_contexts: JSON.stringify(streamContexts),
    milestone_findings: JSON.stringify(milestoneFindings),
  });

  const { output } = await generateText({
    model,
    output: Output.object({ schema: ProjectTimelineSchema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output;
}
// #endregion project-timeline
