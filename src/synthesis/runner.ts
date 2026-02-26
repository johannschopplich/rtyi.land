import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { z } from "zod";
import type { StreamAnalysis } from "../analysis/schemas";
import type { NarrativeArcs, StoryArcs, TopicArc, TopicArcs } from "./schemas";
import { generateText, Output } from "ai";
import pMap from "p-map";
import { estimateTokenCount } from "tokenx";
import { template } from "utilful";
import { CORE_CONTRIBUTORS } from "../constants";
import {
  DOCUMENTARY_CONTEXT,
  NARRATIVE_ARCS_PROMPT,
  STORY_ARCS_PROMPT,
  STORY_ARCS_REDUCE_PROMPT,
  TOPIC_ARC_REDUCE_PROMPT,
  TOPIC_ARC_SINGLE_PROMPT,
} from "./prompts";
import {
  NarrativeArcsSchema,
  StoryArcsSchema,
  TopicArcSchema,
} from "./schemas";

// #region config

const OPENAI_PROVIDER_OPTIONS = {
  openai: {
    reasoningEffort: "high",
  } satisfies OpenAILanguageModelChatOptions,
};
const CHUNK_CHAR_BUDGET = 300_000;
const DEFAULT_CONCURRENCY = 1;

/**
 * Token budget for the narrative arcs single-prompt path.
 * GPT-5.2 supports ~400K tokens; leave headroom for output + system.
 */
const NARRATIVE_ARCS_TOKEN_BUDGET = 300_000;

// #endregion config

// #region api

export type SynthesisTask = "story-arcs" | "narrative-arcs" | "topic-arcs";

export type ProgressEvent =
  | { phase: "map-start"; total: number }
  | { phase: "map-chunk-done"; index: number; total: number }
  | { phase: "reduce-start"; batches: number }
  | { phase: "single-prompt-start"; tokens: number }
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
  dateRange: string;
  concurrency?: number;
  onProgress?: (event: ProgressEvent) => void;
}

export async function runSynthesisTask(options: SynthesisOptions) {
  const { task } = options;

  switch (task) {
    case "story-arcs":
      return runStoryArcs(options);
    case "narrative-arcs":
      return runNarrativeArcs(options);
    case "topic-arcs":
      return runTopicArcs(options);
  }
}

// #endregion api

// #region story-arcs

async function runStoryArcs(options: SynthesisOptions) {
  const { model, streams, dateRange, concurrency, onProgress } = options;

  return mapReduce<StoryArcs>({
    streams,
    payloadSizeFn: storyArcsPayloadSize,
    concurrency,
    onProgress,
    mapFn: (chunk) => {
      const { stories, quotes, openQuestions, findings } =
        extractStoryArcsPayload(chunk);

      const prompt = template(STORY_ARCS_PROMPT, {
        date_range: dateRange,
        stories: JSON.stringify(stories),
        quotes: JSON.stringify(quotes),
        open_questions: JSON.stringify(openQuestions),
        findings: JSON.stringify(findings),
      });

      return generateObject(
        model,
        StoryArcsSchema,
        prompt,
        DOCUMENTARY_CONTEXT,
      );
    },
    reduceFn: (batchResults) => {
      const allArcs = batchResults.flatMap((batch) => batch.arcs);

      const prompt = template(STORY_ARCS_REDUCE_PROMPT, {
        date_range: dateRange,
        candidate_arcs: JSON.stringify(allArcs),
      });

      return generateObject(
        model,
        StoryArcsSchema,
        prompt,
        DOCUMENTARY_CONTEXT,
      );
    },
  });
}

// #endregion story-arcs

// #region narrative-arcs

async function runNarrativeArcs(
  options: SynthesisOptions,
): Promise<NarrativeArcs | undefined> {
  const { model, streams, dateRange, onProgress } = options;

  // Collect all data for a single holistic prompt
  const streamSummaries = streams.map((stream) => ({
    stream_date: stream.rawDate,
    summary: stream.analysis.stream_context.summary,
    significance: stream.analysis.stream_context.significance,
    significance_reason: stream.analysis.stream_context.significance_reason,
  }));

  const findings = streams.flatMap((stream) =>
    stream.analysis.findings
      .filter((finding) => finding.importance !== "low")
      .map((finding) => ({
        stream_date: stream.rawDate,
        topic: finding.topic,
        summary: finding.summary,
      })),
  );

  const stories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      title: story.title,
      summary: story.summary,
      related_to: story.related_to,
    })),
  );

  const quotes = streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      speaker: quote.speaker,
      quote: quote.quote,
      context: quote.context,
    })),
  );

  let promptData = {
    stream_summaries: JSON.stringify(streamSummaries),
    findings: JSON.stringify(findings),
    stories: JSON.stringify(stories),
    quotes: JSON.stringify(quotes),
  };

  // Check token count; if too large, pre-summarize
  let fullPrompt = template(NARRATIVE_ARCS_PROMPT, {
    date_range: dateRange,
    ...promptData,
  });

  const tokenCount = estimateTokenCount(fullPrompt);

  if (tokenCount > NARRATIVE_ARCS_TOKEN_BUDGET) {
    // Pre-summarize: drop low-importance findings, trim quotes
    const condensedFindings = findings.filter((finding) =>
      // Keep only high-importance when over budget
      streams.some(
        (stream) =>
          stream.rawDate === finding.stream_date &&
          stream.analysis.findings.some(
            (streamFinding) =>
              streamFinding.summary === finding.summary &&
              streamFinding.importance === "high",
          ),
      ),
    );

    promptData = {
      stream_summaries: JSON.stringify(streamSummaries),
      findings: JSON.stringify(condensedFindings),
      stories: JSON.stringify(stories),
      quotes: JSON.stringify(quotes),
    };

    fullPrompt = template(NARRATIVE_ARCS_PROMPT, {
      date_range: dateRange,
      ...promptData,
    });
  }

  const finalTokenCount = estimateTokenCount(fullPrompt);
  onProgress?.({ phase: "single-prompt-start", tokens: finalTokenCount });

  return generateObject(
    model,
    NarrativeArcsSchema,
    fullPrompt,
    DOCUMENTARY_CONTEXT,
  );
}

// #endregion narrative-arcs

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
        arc = await generateObject(
          model,
          TopicArcSchema,
          prompt,
          DOCUMENTARY_CONTEXT,
        );
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
          const result = await generateObject(
            model,
            TopicArcSchema,
            prompt,
            DOCUMENTARY_CONTEXT,
          );
          if (result) chunkResults.push(result);
        }

        if (chunkResults.length === 1) {
          arc = chunkResults[0];
        } else if (chunkResults.length > 1) {
          const reducePrompt = template(TOPIC_ARC_REDUCE_PROMPT, {
            topic,
            candidate_arcs: JSON.stringify(chunkResults),
          });
          arc = await generateObject(
            model,
            TopicArcSchema,
            reducePrompt,
            DOCUMENTARY_CONTEXT,
          );
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

function extractStoryArcsPayload(streams: ParsedStream[]) {
  const stories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      ...story,
    })),
  );

  const quotes = streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      ...quote,
    })),
  );

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

  return { stories, quotes, openQuestions, findings };
}

function storyArcsPayloadSize(streams: ParsedStream[]) {
  const { stories, quotes, openQuestions, findings } =
    extractStoryArcsPayload(streams);
  return (
    JSON.stringify(stories).length +
    JSON.stringify(quotes).length +
    JSON.stringify(openQuestions).length +
    JSON.stringify(findings).length
  );
}

// #endregion extractors

// #region utils

async function generateObject<T extends z.ZodType>(
  model: LanguageModelV3,
  schema: T,
  prompt: string,
  system?: string,
): Promise<z.output<T> | undefined> {
  const { output } = await generateText({
    model,
    output: Output.object({ schema }),
    ...(system ? { system } : {}),
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
