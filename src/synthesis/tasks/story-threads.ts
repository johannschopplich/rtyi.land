import type { StoryThreads } from "../schemas";
import type { ParsedStream, ProgressEvent, SynthesisOptions } from "../shared";
import { hash } from "ohash";
import { createCSV, template } from "utilful";
import { cachedGenerate } from "../cache";
import {
  DOCUMENTARY_CONTEXT,
  STORY_THREADS_PROMPT,
  STORY_THREADS_REDUCE_PROMPT,
} from "../prompts";
import { StoryThreadsSchema } from "../schemas";
import { generateObject } from "../shared";

const CHUNK_CHAR_BUDGET = 300_000;

export async function runStoryThreads(options: SynthesisOptions) {
  const { model, streams, dateRange, onProgress } = options;

  return mapReduce<StoryThreads>({
    taskName: "story-threads",
    streams,
    payloadSizeFn: storyThreadsPayloadSize,
    onProgress,
    mapFn: (chunk) => {
      const { stories, quotes, openQuestions, findings } =
        extractPayload(chunk);

      const prompt = template(STORY_THREADS_PROMPT, {
        date_range: dateRange,
        stories: createCSV(stories),
        quotes: createCSV(quotes),
        open_questions: createCSV(openQuestions),
        findings: createCSV(findings),
      });

      return generateObject(
        model,
        StoryThreadsSchema,
        prompt,
        DOCUMENTARY_CONTEXT,
      );
    },
    reduceFn: (batchResults) => {
      const allArcs = batchResults.flatMap((batch) => batch.arcs);

      const prompt = template(STORY_THREADS_REDUCE_PROMPT, {
        date_range: dateRange,
        candidate_arcs: JSON.stringify(allArcs),
      });

      return generateObject(
        model,
        StoryThreadsSchema,
        prompt,
        DOCUMENTARY_CONTEXT,
      );
    },
  });
}

function extractPayload(streams: ParsedStream[]) {
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

function storyThreadsPayloadSize(streams: ParsedStream[]) {
  const { stories, quotes, openQuestions, findings } = extractPayload(streams);
  return (
    createCSV(stories).length +
    createCSV(quotes).length +
    createCSV(openQuestions).length +
    createCSV(findings).length
  );
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
}: {
  taskName: string;
  streams: ParsedStream[];
  payloadSizeFn: (streams: ParsedStream[]) => number;
  mapFn: (chunk: ParsedStream[]) => Promise<T | undefined>;
  reduceFn: (results: T[]) => Promise<T | undefined>;
  onProgress?: (event: ProgressEvent) => void;
}): Promise<T | undefined> {
  const chunks = chunkByBudget(streams, payloadSizeFn);
  const streamCounts = chunks.map((chunk) => chunk.length);

  onProgress?.({ phase: "map-start", total: chunks.length, streamCounts });

  const cachedMapFn = (chunk: ParsedStream[], index: number) => {
    const key = `${taskName}:map:${index}:${hash(chunk.map((stream) => stream.fileName))}`;
    return cachedGenerate(key, () => mapFn(chunk));
  };

  const chunkResults: T[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const result = await cachedMapFn(chunks[i]!, i);
    if (result) chunkResults.push(result);
    onProgress?.({
      phase: "map-chunk-done",
      index: i + 1,
      total: chunks.length,
      chunkStreams: chunks[i]!.length,
    });
  }

  if (chunkResults.length === 0) return undefined;
  if (chunkResults.length === 1) return chunkResults[0];

  onProgress?.({ phase: "reduce-start", batches: chunkResults.length });

  const reduceKey = `${taskName}:reduce:${hash(chunkResults)}`;
  return cachedGenerate(reduceKey, () => reduceFn(chunkResults));
}
