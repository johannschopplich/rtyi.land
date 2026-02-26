import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { z } from "zod";
import type { StreamAnalysis } from "../analysis/schemas";
import type {
  CuratedQuotes,
  InterviewQuestions,
  StoryHighlights,
  TopicArc,
  TopicArcs,
} from "./schemas";
import { generateText, Output } from "ai";
import pMap from "p-map";
import { template } from "utilful";
import { CORE_CONTRIBUTORS } from "../constants";
import {
  CURATED_QUOTES_PROMPT,
  CURATED_QUOTES_REDUCE_PROMPT,
  INTERVIEW_QUESTIONS_PROMPT,
  INTERVIEW_QUESTIONS_REDUCE_PROMPT,
  STORY_HIGHLIGHTS_PROMPT,
  STORY_HIGHLIGHTS_REDUCE_PROMPT,
  TOPIC_ARC_REDUCE_PROMPT,
  TOPIC_ARC_SINGLE_PROMPT,
} from "./prompts";
import {
  CuratedQuotesSchema,
  InterviewQuestionsSchema,
  StoryHighlightsSchema,
  TopicArcSchema,
} from "./schemas";

// #region config

const OPENAI_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high",
  } satisfies OpenAILanguageModelChatOptions,
};
const CHUNK_CHAR_BUDGET = 300_000;
const MAX_QUOTES_PER_CHUNK = 150;
const DEFAULT_CONCURRENCY = 1;

// #endregion config

// #region api

export type SynthesisTask =
  | "interview-questions"
  | "curated-quotes"
  | "story-highlights"
  | "topic-arcs";

export type ProgressEvent =
  | { phase: "map-start"; total: number }
  | { phase: "map-chunk-done"; index: number; total: number }
  | { phase: "reduce-start"; batches: number }
  | { phase: "topic-start"; total: number }
  | { phase: "topic-done"; index: number; total: number; name: string };

export interface ParsedStream {
  rawDate: string;
  fileName: string;
  analysis: StreamAnalysis;
}

export interface SynthesisOptions {
  task: SynthesisTask;
  model: LanguageModelV3;
  streams: ParsedStream[];
  existingQuestions: string;
  dateRange: string;
  concurrency?: number;
  onProgress?: (event: ProgressEvent) => void;
}

export async function runSynthesisTask(options: SynthesisOptions) {
  const { task } = options;

  switch (task) {
    case "interview-questions":
      return runInterviewQuestions(options);
    case "curated-quotes":
      return runCuratedQuotes(options);
    case "story-highlights":
      return runStoryHighlights(options);
    case "topic-arcs":
      return runTopicArcs(options);
  }
}

// #endregion api

// #region questions

async function runInterviewQuestions(options: SynthesisOptions) {
  const {
    model,
    streams,
    existingQuestions,
    dateRange,
    concurrency,
    onProgress,
  } = options;
  const existingOrDefault =
    existingQuestions || "(No existing questions provided)";

  return mapReduce<InterviewQuestions>({
    streams,
    payloadSizeFn: interviewPayloadSize,
    concurrency,
    onProgress,
    mapFn: (chunk) => {
      const { openQuestions, findings, keyStories } =
        extractInterviewPayload(chunk);

      const prompt = template(INTERVIEW_QUESTIONS_PROMPT, {
        date_range: dateRange,
        existing_questions: existingOrDefault,
        open_questions: JSON.stringify(openQuestions),
        findings: JSON.stringify(findings),
        key_stories: JSON.stringify(keyStories),
      });

      return generateObject(model, InterviewQuestionsSchema, prompt);
    },
    reduceFn: (batchResults) => {
      const prompt = template(INTERVIEW_QUESTIONS_REDUCE_PROMPT, {
        date_range: dateRange,
        existing_questions: existingOrDefault,
        candidate_questions: JSON.stringify(batchResults),
      });

      return generateObject(model, InterviewQuestionsSchema, prompt);
    },
  });
}

// #endregion questions

// #region quotes

async function runCuratedQuotes(options: SynthesisOptions) {
  const { model, streams, concurrency, onProgress } = options;

  // Keep chunks at ~300 quotes max to avoid context dilution.
  // At 150 streams (~450 quotes) → 2 chunks. At 250 → 3. At 500 → 5.
  const totalQuotes = streams.reduce(
    (sum, s) => sum + s.analysis.memorable_quotes.length,
    0,
  );
  const minChunks = Math.max(2, Math.ceil(totalQuotes / MAX_QUOTES_PER_CHUNK));

  return mapReduce<CuratedQuotes>({
    streams,
    payloadSizeFn: quotePayloadSize,
    concurrency,
    onProgress,
    minChunks,
    mapFn: (chunk) => {
      const quotes = extractQuotePayload(chunk);

      const prompt = template(CURATED_QUOTES_PROMPT, {
        quotes: JSON.stringify(quotes),
      });

      return generateObject(model, CuratedQuotesSchema, prompt);
    },
    reduceFn: (batchResults) => {
      const allQuotes = batchResults.flatMap((batch) => batch.quotes);

      const prompt = template(CURATED_QUOTES_REDUCE_PROMPT, {
        candidate_quotes: JSON.stringify(allQuotes),
      });

      return generateObject(model, CuratedQuotesSchema, prompt);
    },
  });
}

// #endregion quotes

// #region stories

async function runStoryHighlights(options: SynthesisOptions) {
  const { model, streams, concurrency, onProgress } = options;

  return mapReduce<StoryHighlights>({
    streams,
    payloadSizeFn: storyPayloadSize,
    concurrency,
    onProgress,
    mapFn: (chunk) => {
      const stories = extractStoryPayload(chunk);

      const prompt = template(STORY_HIGHLIGHTS_PROMPT, {
        stories: JSON.stringify(stories),
      });

      return generateObject(model, StoryHighlightsSchema, prompt);
    },
    reduceFn: (batchResults) => {
      const allStories = batchResults.flatMap((batch) => batch.stories);

      const prompt = template(STORY_HIGHLIGHTS_REDUCE_PROMPT, {
        candidate_stories: JSON.stringify(allStories),
      });

      return generateObject(model, StoryHighlightsSchema, prompt);
    },
  });
}

// #endregion stories

// #region topics

interface TopicFinding {
  stream_date: string;
  summary: string;
  quote: string | null;
}

const TOPIC_FINDINGS_CHUNK_THRESHOLD = 500;

async function runTopicArcs(options: SynthesisOptions): Promise<TopicArcs> {
  const {
    model,
    streams,
    concurrency = DEFAULT_CONCURRENCY,
    onProgress,
  } = options;

  // Group all findings by topic (main + contributor findings)
  const findingsByTopic = new Map<string, TopicFinding[]>();

  for (const stream of streams) {
    for (const finding of stream.analysis.findings) {
      if (!findingsByTopic.has(finding.topic))
        findingsByTopic.set(finding.topic, []);
      findingsByTopic.get(finding.topic)!.push({
        stream_date: stream.rawDate,
        summary: finding.summary,
        quote: finding.quote,
      });
    }

    for (const member of CORE_CONTRIBUTORS) {
      for (const finding of stream.analysis.contributor_findings[member]) {
        if (!findingsByTopic.has(finding.topic))
          findingsByTopic.set(finding.topic, []);
        findingsByTopic.get(finding.topic)!.push({
          stream_date: stream.rawDate,
          summary: `[${member}] ${finding.summary}`,
          quote: finding.quote,
        });
      }
    }
  }

  const topics = [...findingsByTopic.keys()].sort();
  onProgress?.({ phase: "topic-start", total: topics.length });

  let completed = 0;
  const results = await pMap(
    topics,
    async (topic) => {
      const findings = findingsByTopic.get(topic)!;
      let arc: TopicArc | undefined;

      if (findings.length <= TOPIC_FINDINGS_CHUNK_THRESHOLD) {
        const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
          topic,
          findings: JSON.stringify(findings),
        });
        arc = await generateObject(model, TopicArcSchema, prompt);
      } else {
        // Chunk large topics and merge via reduce
        const chunkCount = Math.ceil(
          findings.length / TOPIC_FINDINGS_CHUNK_THRESHOLD,
        );
        const chunkSize = Math.ceil(findings.length / chunkCount);

        const chunkResults: TopicArc[] = [];
        for (let c = 0; c < chunkCount; c++) {
          const chunk = findings.slice(c * chunkSize, (c + 1) * chunkSize);
          const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
            topic,
            findings: JSON.stringify(chunk),
          });
          const result = await generateObject(model, TopicArcSchema, prompt);
          if (result) chunkResults.push(result);
        }

        if (chunkResults.length === 1) {
          arc = chunkResults[0];
        } else if (chunkResults.length > 1) {
          const reducePrompt = template(TOPIC_ARC_REDUCE_PROMPT, {
            topic,
            candidate_arcs: JSON.stringify(chunkResults),
          });
          arc = await generateObject(model, TopicArcSchema, reducePrompt);
        }
      }

      completed++;
      onProgress?.({
        phase: "topic-done",
        index: completed,
        total: topics.length,
        name: topic,
      });
      return arc;
    },
    { concurrency },
  );

  return { arcs: results.filter((a): a is TopicArc => a !== undefined) };
}

// #endregion topics

// #region extractors

function extractInterviewPayload(streams: ParsedStream[]) {
  const openQuestions = streams.flatMap((stream) =>
    stream.analysis.open_questions.map((question) => ({
      stream_date: stream.rawDate,
      ...question,
    })),
  );

  const findings = streams.flatMap((stream) =>
    stream.analysis.findings.map((finding) => ({
      stream_date: stream.rawDate,
      topic: finding.topic,
      summary: finding.summary,
    })),
  );

  const keyStories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      title: story.title,
      summary: story.summary,
      related_to: story.related_to,
    })),
  );

  return { openQuestions, findings, keyStories };
}

function interviewPayloadSize(streams: ParsedStream[]) {
  const { openQuestions, findings, keyStories } =
    extractInterviewPayload(streams);
  return (
    JSON.stringify(openQuestions).length +
    JSON.stringify(findings).length +
    JSON.stringify(keyStories).length
  );
}

function extractQuotePayload(streams: ParsedStream[]) {
  return streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      ...quote,
    })),
  );
}

function quotePayloadSize(streams: ParsedStream[]) {
  return JSON.stringify(extractQuotePayload(streams)).length;
}

function extractStoryPayload(streams: ParsedStream[]) {
  return streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      ...story,
    })),
  );
}

function storyPayloadSize(streams: ParsedStream[]) {
  return JSON.stringify(extractStoryPayload(streams)).length;
}

// #endregion extractors

// #region utils

async function generateObject<T extends z.ZodType>(
  model: LanguageModelV3,
  schema: T,
  prompt: string,
): Promise<z.output<T> | undefined> {
  const { output } = await generateText({
    model,
    output: Output.object({ schema }),
    prompt,
    providerOptions: OPENAI_PROVIDER_OPTIONS,
  });

  return output as z.output<T> | undefined;
}

function chunkByBudget(
  streams: ParsedStream[],
  payloadSizeFn: (streams: ParsedStream[]) => number,
): ParsedStream[][] {
  if (payloadSizeFn(streams) <= CHUNK_CHAR_BUDGET) return [streams];

  const streamSizes = streams.map((stream) => payloadSizeFn([stream]));
  const chunks: ParsedStream[][] = [];
  let current: ParsedStream[] = [];
  let currentSize = 0;

  for (let i = 0; i < streams.length; i++) {
    if (
      currentSize + streamSizes[i]! > CHUNK_CHAR_BUDGET &&
      current.length > 0
    ) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(streams[i]!);
    currentSize += streamSizes[i]!;
  }
  if (current.length > 0) chunks.push(current);

  return chunks;
}

interface MapReduceConfig<T> {
  streams: ParsedStream[];
  payloadSizeFn: (streams: ParsedStream[]) => number;
  mapFn: (chunk: ParsedStream[]) => Promise<T | undefined>;
  reduceFn: (results: T[]) => Promise<T | undefined>;
  onProgress?: (event: ProgressEvent) => void;
  concurrency?: number;
  /**
   * Force at least this many chunks even if the data fits in one call.
   * Useful when context dilution hurts curation quality (e.g. quotes).
   */
  minChunks?: number;
}

/**
 * Generic map-reduce orchestration for synthesis tasks.
 * Splits streams into budget-aware chunks, runs the map function on each
 * with configurable concurrency, then merges results with the reduce function.
 */
async function mapReduce<T>({
  streams,
  payloadSizeFn,
  mapFn,
  reduceFn,
  onProgress,
  concurrency = DEFAULT_CONCURRENCY,
  minChunks = 1,
}: MapReduceConfig<T>): Promise<T | undefined> {
  let chunks = chunkByBudget(streams, payloadSizeFn);

  // Force minimum chunk count if quality requires it
  if (chunks.length < minChunks) {
    const streamsPerChunk = Math.ceil(streams.length / minChunks);
    chunks = [];
    for (let i = 0; i < streams.length; i += streamsPerChunk) {
      chunks.push(streams.slice(i, i + streamsPerChunk));
    }
  }

  onProgress?.({ phase: "map-start", total: chunks.length });

  // Single pass – everything fits in one call
  if (chunks.length === 1) {
    const result = await mapFn(chunks[0]!);
    onProgress?.({ phase: "map-chunk-done", index: 1, total: 1 });
    return result;
  }

  let completed = 0;
  const chunkResults: T[] = [];
  await pMap(
    chunks,
    async (chunk) => {
      const result = await mapFn(chunk);
      if (result) chunkResults.push(result);
      completed++;
      onProgress?.({
        phase: "map-chunk-done",
        index: completed,
        total: chunks.length,
      });
    },
    { concurrency },
  );

  if (chunkResults.length === 0) return undefined;
  if (chunkResults.length === 1) return chunkResults[0];

  onProgress?.({ phase: "reduce-start", batches: chunkResults.length });
  return reduceFn(chunkResults);
}

// #endregion utils
