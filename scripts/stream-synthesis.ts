import type { ProgressResult } from "@clack/prompts";
import type { StreamAnalysis } from "../src/analysis/schemas";
import type { ParsedStream, SynthesisTask } from "../src/synthesis/runner";
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
    name: "Story Arcs",
    outputFile: "story-arcs.json",
    promptKey: "story-arcs",
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
  `Running ${ansis.bold(tasksToRun.length)} synthesis tasks: ${tasksToRun.map((t) => t.name).join(", ")}`,
);

const languageModel = resolveLanguageModel();

// Run tasks sequentially to manage API load and provide clear progress
for (let ti = 0; ti < tasksToRun.length; ti++) {
  const task = tasksToRun[ti]!;
  clack.log.step(
    `Task ${ti + 1}/${tasksToRun.length} — ${ansis.bold(task.name)}`,
  );

  let p: ProgressResult | undefined;

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
            p = clack.progress({ max: event.total });
            p.start(event.total === 1 ? "Processing" : "Mapping");
            break;
          case "map-chunk-done":
            p?.advance(1, `Mapped ${event.index} of ${event.total}`);
            break;
          case "reduce-start":
            p?.message(`Reducing ${event.batches} batches`);
            break;
          case "single-prompt-start":
            p = clack.progress({ max: 1 });
            p.start(
              `Single-prompt synthesis (~${Math.round(event.tokens / 1000)}K tokens)`,
            );
            break;
          case "topic-start":
            p = clack.progress({ max: event.total });
            p.start("Processing topics");
            break;
          case "topic-done":
            p?.advance(
              1,
              `${toTitleCase(event.name)} (${event.index}/${event.total})`,
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

    p?.stop(`${task.name} ${ansis.green("done")}`);
  } catch (error) {
    if (p) {
      p.error(`${task.name} ${ansis.red("failed")}`);
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
