import type { StreamAnalysis } from "../src/analysis/schemas";
import type { ParsedStream } from "../src/synthesis/runner";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import * as ansis from "ansis";
import { glob } from "tinyglobby";
import { ROOT_DIR, STREAM_ANALYSIS_DIR, SYNTHESIS_DIR } from "../src/constants";
import { runSynthesisTask } from "../src/synthesis/runner";
import { ensureDirectoryExists, resolveLanguageModel } from "../src/utils";

clack.intro("Stream Synthesis");

const { force } = await clack.group(
  {
    force: () =>
      clack.confirm({
        message: "Overwrite existing synthesis files?",
        initialValue: false,
      }),
  },
  {
    onCancel: () => {
      clack.cancel("Operation cancelled");
      process.exit(0);
    },
  },
);

// Load all stream analysis JSONs
const files = await glob("*.json", {
  cwd: STREAM_ANALYSIS_DIR,
  absolute: true,
});

if (files.length === 0) {
  clack.cancel(
    `No stream analysis files found in ${ansis.bold(STREAM_ANALYSIS_DIR)}`,
  );
  process.exit(1);
}

clack.log.info(`Loading ${ansis.bold(files.length)} stream analyses`);

// Parse all stream JSONs
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

// Load existing interview questions for context
const interviewDir = join(ROOT_DIR, "docs", "interviews");
let existingQuestions = "";

try {
  const interviewFiles = (await fsp.readdir(interviewDir))
    .filter((f) => f.endsWith(".md"))
    .sort();

  for (const file of interviewFiles) {
    const content = await fsp.readFile(join(interviewDir, file), "utf-8");
    existingQuestions += `\n### ${file}\n\n${content}\n`;
  }
} catch {
  clack.log.warn("Could not load existing interview questions");
}

// Compute date range
const dates = streams.map((s) => s.rawDate).sort();
const firstDate = formatDate(dates[0]!);
const lastDate = formatDate(dates[dates.length - 1]!);
const dateRange = `${firstDate} to ${lastDate}`;

// Prepare synthesis output directory
await ensureDirectoryExists(SYNTHESIS_DIR);

// Define synthesis tasks
const tasks = [
  {
    name: "Interview Questions",
    outputFile: "interview-questions.json",
    promptKey: "interview-questions" as const,
  },
  {
    name: "Curated Quotes",
    outputFile: "curated-quotes.json",
    promptKey: "curated-quotes" as const,
  },
  {
    name: "Story Highlights",
    outputFile: "story-highlights.json",
    promptKey: "story-highlights" as const,
  },
  {
    name: "Topic Arcs",
    outputFile: "topic-arcs.json",
    promptKey: "topic-arcs" as const,
  },
  {
    name: "Project Timeline",
    outputFile: "project-timeline.json",
    promptKey: "project-timeline" as const,
  },
];

// Check which tasks need running
const tasksToRun = [];

for (const task of tasks) {
  const outputPath = join(SYNTHESIS_DIR, task.outputFile);
  const exists = await fileExists(outputPath);

  if (exists && !force) {
    clack.log.info(`Skipping ${ansis.bold(task.name)} (already exists)`);
  } else {
    tasksToRun.push(task);
  }
}

if (tasksToRun.length === 0) {
  clack.log.info(
    "All synthesis files already exist. Use --force to overwrite.",
  );
  clack.outro("Nothing to do.");
  process.exit(0);
}

clack.log.info(
  `Running ${ansis.bold(tasksToRun.length)} synthesis tasks: ${tasksToRun.map((t) => t.name).join(", ")}`,
);

const languageModel = resolveLanguageModel();

// Run tasks sequentially to manage API load and provide clear progress
const bar = clack.progress({ max: tasksToRun.length });
bar.start("Running synthesis tasks");

let completed = 0;
let failures = 0;

for (const task of tasksToRun) {
  try {
    const result = await runSynthesisTask({
      task: task.promptKey,
      model: languageModel,
      streams,
      existingQuestions,
      dateRange,
    });

    const outputPath = join(SYNTHESIS_DIR, task.outputFile);
    await fsp.writeFile(
      outputPath,
      JSON.stringify(result, undefined, 2),
      "utf-8",
    );

    completed++;
    bar.advance(1, `Completed: ${task.name}`);
  } catch (error) {
    failures++;
    bar.stop(`Error: ${task.name}`);
    clack.log.error(error instanceof Error ? error.message : String(error));
    bar.start(`Continuing (${completed + failures}/${tasksToRun.length})`);
    bar.advance(1, `Failed: ${task.name}`);
  }
}

// Summary
const parts: string[] = [`${completed} completed`];
if (failures > 0) parts.push(`${failures} failed`);
bar.stop(`Done — ${parts.join(", ")}`);

clack.outro(`Results written to ${ansis.cyan(SYNTHESIS_DIR)}`);

// Utilities
function formatDate(yyyymmdd: string): string {
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
