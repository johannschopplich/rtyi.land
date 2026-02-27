import type { OpenAILanguageModelChatOptions } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import type { z } from "zod";
import type { StreamAnalysis } from "../analysis/schemas";
import type { NarrativeArcs, StoryArcs, TopicArc, TopicArcs } from "./schemas";
import { generateText, Output } from "ai";
import { hash } from "ohash";
import pMap from "p-map";
import { estimateTokenCount } from "tokenx";
import { template } from "utilful";
import { CORE_CONTRIBUTORS } from "../constants";
import { cachedGenerate } from "./cache";
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

/**
 * Omitted input fields (token budget optimizations):
 *
 * All tasks:
 * - `related_to` on stories/questions — 81-83% redundant with text content
 *
 * Narrative arcs:
 * - `significance_reason` on summaries — tier label sufficient (~17K saved)
 * - `context` on quotes — recoverable via stream_date cross-ref (~19K saved)
 *
 * Story arcs:
 * - `questions` on open questions — model generates its own (~93K saved)
 *
 * Topic arcs:
 * - `quote` on findings — absent from output schema, 81% null (~29K saved)
 */

// #endregion config

// #region api

export type SynthesisTask = "story-arcs" | "narrative-arcs" | "topic-arcs";

export type ProgressEvent =
  | { phase: "map-start"; total: number; streamCounts: number[] }
  | {
      phase: "map-chunk-done";
      index: number;
      total: number;
      chunkStreams: number;
    }
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
    taskName: "story-arcs",
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
    })),
  );

  const quotes = streams.flatMap((stream) =>
    stream.analysis.memorable_quotes.map((quote) => ({
      stream_date: stream.rawDate,
      speaker: quote.speaker,
      quote: quote.quote,
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

  const cacheKey = `narrative-arcs:${hash(fullPrompt)}`;
  return cachedGenerate(cacheKey, () =>
    generateObject(model, NarrativeArcsSchema, fullPrompt, DOCUMENTARY_CONTEXT),
  );
}

// #endregion narrative-arcs

// #region topics

interface TopicFinding {
  stream_date: string;
  summary: string;
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
      });
    }

    for (const member of CORE_CONTRIBUTORS) {
      for (const finding of stream.analysis.contributor_findings[member]) {
        if (!findingsByTopic.has(finding.topic))
          findingsByTopic.set(finding.topic, []);
        findingsByTopic.get(finding.topic)!.push({
          stream_date: stream.rawDate,
          summary: `[${member}] ${finding.summary}`,
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

      const topicKey = `topic-arcs:${hash({ topic, findings })}`;

      if (findings.length <= TOPIC_FINDINGS_CHUNK_THRESHOLD) {
        arc = await cachedGenerate(topicKey, () => {
          const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
            topic,
            findings: JSON.stringify(findings),
          });
          return generateObject(
            model,
            TopicArcSchema,
            prompt,
            DOCUMENTARY_CONTEXT,
          );
        });
      } else {
        // Chunk large topics and merge via reduce
        const chunkCount = Math.ceil(
          findings.length / TOPIC_FINDINGS_CHUNK_THRESHOLD,
        );
        const chunkSize = Math.ceil(findings.length / chunkCount);

        const chunkResults: TopicArc[] = [];
        for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
          const chunk = findings.slice(
            chunkIndex * chunkSize,
            (chunkIndex + 1) * chunkSize,
          );
          const chunkKey = `topic-arcs:map:${hash({ topic, chunkIndex, chunk })}`;
          const result = await cachedGenerate(chunkKey, () => {
            const prompt = template(TOPIC_ARC_SINGLE_PROMPT, {
              topic,
              findings: JSON.stringify(chunk),
            });
            return generateObject(
              model,
              TopicArcSchema,
              prompt,
              DOCUMENTARY_CONTEXT,
            );
          });
          if (result) chunkResults.push(result);
        }

        if (chunkResults.length === 1) {
          arc = chunkResults[0];
        } else if (chunkResults.length > 1) {
          arc = await cachedGenerate(topicKey, () => {
            const reducePrompt = template(TOPIC_ARC_REDUCE_PROMPT, {
              topic,
              candidate_arcs: JSON.stringify(chunkResults),
            });
            return generateObject(
              model,
              TopicArcSchema,
              reducePrompt,
              DOCUMENTARY_CONTEXT,
            );
          });
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

  return { arcs: results.filter((arc): arc is TopicArc => arc !== undefined) };
}

// #endregion topics

// #region extractors

function extractStoryArcsPayload(streams: ParsedStream[]) {
  const stories = streams.flatMap((stream) =>
    stream.analysis.key_stories.map((story) => ({
      stream_date: stream.rawDate,
      title: story.title,
      summary: story.summary,
      challenge: story.challenge,
      process: story.process,
      outcome: story.outcome,
      key_quote: story.key_quote,
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
      topic: question.topic,
      context: question.context,
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

async function mapReduce<T>({
  taskName,
  streams,
  payloadSizeFn,
  mapFn,
  reduceFn,
  onProgress,
  concurrency = DEFAULT_CONCURRENCY,
}: {
  taskName: string;
  streams: ParsedStream[];
  payloadSizeFn: (streams: ParsedStream[]) => number;
  mapFn: (chunk: ParsedStream[]) => Promise<T | undefined>;
  reduceFn: (results: T[]) => Promise<T | undefined>;
  onProgress?: (event: ProgressEvent) => void;
  concurrency?: number;
}): Promise<T | undefined> {
  const chunks = chunkByBudget(streams, payloadSizeFn);
  const streamCounts = chunks.map((chunk) => chunk.length);

  onProgress?.({ phase: "map-start", total: chunks.length, streamCounts });

  const cachedMapFn = (chunk: ParsedStream[], index: number) => {
    const key = `${taskName}:map:${index}:${hash(chunk.map((stream) => stream.fileName))}`;
    return cachedGenerate(key, () => mapFn(chunk));
  };

  // Single pass – everything fits in one call
  if (chunks.length === 1) {
    const result = await cachedMapFn(chunks[0]!, 0);
    onProgress?.({
      phase: "map-chunk-done",
      index: 1,
      total: 1,
      chunkStreams: streamCounts[0]!,
    });
    return result;
  }

  let completed = 0;
  const chunkResults: T[] = [];
  await pMap(
    chunks,
    async (chunk, index) => {
      const result = await cachedMapFn(chunk, index);
      if (result) chunkResults.push(result);
      completed++;
      onProgress?.({
        phase: "map-chunk-done",
        index: completed,
        total: chunks.length,
        chunkStreams: chunk.length,
      });
    },
    { concurrency },
  );

  if (chunkResults.length === 0) return undefined;
  if (chunkResults.length === 1) return chunkResults[0];

  onProgress?.({ phase: "reduce-start", batches: chunkResults.length });

  const reduceKey = `${taskName}:reduce:${hash(chunkResults)}`;
  return cachedGenerate(reduceKey, () => reduceFn(chunkResults));
}

// #endregion utils
