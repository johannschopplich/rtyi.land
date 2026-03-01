import type { SpinnerResult } from "@clack/prompts";
import type { StreamAnalysis } from "../src/analysis/schemas";
import type { ParsedStream, SynthesisTask } from "../src/synthesis/shared";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import * as ansis from "ansis";
import { STREAM_ANALYSIS_DIR, SYNTHESIS_DIR } from "../src/constants";
import { clearTaskCache } from "../src/synthesis/cache";
import { runSynthesisTask } from "../src/synthesis/runner";
import { ensureDirectoryExists, resolveLanguageModel } from "../src/utils";

clack.intro("Stream Synthesis");

const files = (await fsp.readdir(STREAM_ANALYSIS_DIR))
  .filter((file) => file.endsWith(".json"))
  .map((file) => join(STREAM_ANALYSIS_DIR, file));

if (files.length === 0) {
  clack.cancel(
    `No stream analysis files found in ${ansis.bold(STREAM_ANALYSIS_DIR)}`,
  );
  process.exit(1);
}

clack.log.info(`Loading ${ansis.bold(files.length)} stream analyses`);

const streams: ParsedStream[] = [];

for (const file of files.sort()) {
  try {
    const content = await fsp.readFile(file, "utf-8");
    const analysis = JSON.parse(content) as StreamAnalysis;
    const fileName = basename(file, extname(file));
    const rawDate = fileName.slice(0, 8);
    streams.push({ rawDate, fileName, analysis });
  } catch {
    clack.log.warn(`Skipping invalid file: ${basename(file)}`);
  }
}

clack.log.info(`Parsed ${ansis.bold(streams.length)} streams`);

// Compute date range
const dates = streams.map((stream) => stream.rawDate).sort();
const firstDate = formatDate(dates[0]!);
const lastDate = formatDate(dates[dates.length - 1]!);
const dateRange = `${firstDate} to ${lastDate}`;

// Prepare synthesis output directory
await ensureDirectoryExists(SYNTHESIS_DIR);

// Define synthesis tasks
interface SynthesisTaskConfig {
  name: string;
  outputFile: string;
  promptKey: SynthesisTask;
}

const tasks: SynthesisTaskConfig[] = [
  {
    name: "Story Threads",
    outputFile: "story-threads.json",
    promptKey: "story-threads",
  },
  {
    name: "Narrative Arcs",
    outputFile: "narrative-arcs.json",
    promptKey: "narrative-arcs",
  },
  {
    name: "Topic Arcs",
    outputFile: "topic-arcs.json",
    promptKey: "topic-arcs",
  },
];

// Check which tasks need running
const tasksToRun: SynthesisTaskConfig[] = [];

for (const task of tasks) {
  const outputPath = join(SYNTHESIS_DIR, task.outputFile);
  const exists = await fileExists(outputPath);

  if (exists) {
    clack.log.info(
      `Skipping ${ansis.bold(task.name)} ${ansis.dim("(already exists, delete file to re-run)")}`,
    );
  } else {
    tasksToRun.push(task);
  }
}

if (tasksToRun.length === 0) {
  clack.log.info(
    "All synthesis files already exist. Delete a file to trigger re-generation.",
  );
  clack.outro("Nothing to do.");
  process.exit(0);
}

clack.log.info(
  `Running ${ansis.bold(tasksToRun.length)} synthesis tasks: ${tasksToRun.map((task) => task.name).join(", ")}`,
);

const languageModel = resolveLanguageModel();

// Run tasks sequentially to manage API load and provide clear progress
for (let ti = 0; ti < tasksToRun.length; ti++) {
  const task = tasksToRun[ti]!;
  clack.log.step(
    `Task ${ti + 1}/${tasksToRun.length} — ${ansis.bold(task.name)}`,
  );

  let s: SpinnerResult | undefined;
  let totalStreams = 0;

  try {
    // Purge stale intermediate cache entries for this task before re-running.
    // Keys are content-hashed, so changed inputs would miss anyway, but this
    // prevents orphaned entries from accumulating on disk.
    await clearTaskCache(task.promptKey);

    const result = await runSynthesisTask({
      task: task.promptKey,
      model: languageModel,
      streams,
      dateRange,
      onProgress: (event) => {
        switch (event.phase) {
          case "map-start":
            totalStreams = event.streamCounts.reduce((a, b) => a + b, 0);
            s = clack.spinner();
            if (event.total === 1) {
              s.start(`Processing ${ansis.dim(`(${totalStreams} streams)`)}`);
            } else {
              s.start(
                `Mapping ${task.name.toLowerCase()} ${ansis.dim(`(${event.total} chunks · ${totalStreams} streams)`)}`,
              );
            }
            break;
          case "map-chunk-done":
            if (event.total === 1) {
              // Single-chunk: spinner stops on its own after task completes
            } else {
              s?.message(
                `Mapping ${task.name.toLowerCase()} · chunk ${event.index}/${event.total} ${ansis.dim(`(${event.chunkStreams} streams)`)}`,
              );
              // If all chunks mapped, stop the map spinner
              if (event.index === event.total) {
                s?.stop(
                  `Mapped ${event.total} chunks ${ansis.dim(`(${totalStreams} streams)`)}`,
                );
              }
            }
            break;
          case "reduce-start":
            // Start a new spinner for the reduce phase
            s = clack.spinner();
            s.start(
              `Reducing ${event.batches} partial results ${ansis.dim("(→ final arcs)")}`,
            );
            break;
          case "single-prompt-start":
            s = clack.spinner();
            s.start(
              `Synthesizing filming roadmap ${ansis.dim(`(~${Math.round(event.tokens / 1000)}K tokens · tier ${event.tier}/3 · ${event.selectedFindings}/${event.totalFindings} findings · ${streams.length} streams)`)}`,
            );
            break;
          case "topic-start":
            s = clack.spinner();
            s.start(
              `Synthesizing topic arcs ${ansis.dim(`(${event.total} topics)`)}`,
            );
            break;
          case "topic-done":
            s?.message(
              `${toTitleCase(event.name)} ${ansis.dim(`(${event.index}/${event.total} topics)`)}`,
            );
            break;
        }
      },
    });

    const outputPath = join(SYNTHESIS_DIR, task.outputFile);
    await fsp.writeFile(
      outputPath,
      JSON.stringify(result, undefined, 2),
      "utf-8",
    );

    s?.stop(`${task.name} ${ansis.green("done")}`);
  } catch (error) {
    if (s) {
      s.error(`${task.name} ${ansis.red("failed")}`);
    }

    const message =
      error instanceof Error ? error.stack || error.message : String(error);
    clack.log.error(message);
    clack.outro(ansis.red("Aborted due to error."));
    process.exit(1);
  }
}

clack.outro(
  `Done — ${tasksToRun.length} tasks completed. Results in ${ansis.cyan(SYNTHESIS_DIR)}`,
);

function formatDate(yyyymmdd: string) {
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);

  return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function fileExists(filePath: string) {
  return fsp.stat(filePath).then(
    () => true,
    () => false,
  );
}

function toTitleCase(input: string) {
  return input.replace(/\b\w/g, (character) => character.toUpperCase());
}
