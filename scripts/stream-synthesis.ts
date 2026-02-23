import type { StreamAnalysis } from "../src/analysis/schemas";
import type { ParsedStream, SynthesisTask } from "../src/synthesis/runner";
import * as fsp from "node:fs/promises";
import { basename, extname, join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import * as ansis from "ansis";
import { ROOT_DIR, STREAM_ANALYSIS_DIR, SYNTHESIS_DIR } from "../src/constants";
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
const tasks: {
  name: string;
  outputFile: string;
  promptKey: SynthesisTask;
}[] = [
  {
    name: "Interview Questions",
    outputFile: "interview-questions.json",
    promptKey: "interview-questions",
  },
  {
    name: "Curated Quotes",
    outputFile: "curated-quotes.json",
    promptKey: "curated-quotes",
  },
  {
    name: "Story Highlights",
    outputFile: "story-highlights.json",
    promptKey: "story-highlights",
  },
  {
    name: "Topic Arcs",
    outputFile: "topic-arcs.json",
    promptKey: "topic-arcs",
  },
];

// Check which tasks need running
const tasksToRun: typeof tasks = [];

for (const task of tasks) {
  const outputPath = join(SYNTHESIS_DIR, task.outputFile);
  const exists = await fileExists(outputPath);

  if (exists) {
    clack.log.info(
      `Skipping ${ansis.bold(task.name)} (already exists, delete file to re-run)`,
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
let completed = 0;
let failures = 0;

for (const task of tasksToRun) {
  const s = clack.spinner();

  try {
    s.start(task.name);

    const result = await runSynthesisTask({
      task: task.promptKey,
      model: languageModel,
      streams,
      existingQuestions,
      dateRange,
      onProgress: (msg) => s.message(`${task.name}: ${msg}`),
    });

    const outputPath = join(SYNTHESIS_DIR, task.outputFile);
    await fsp.writeFile(
      outputPath,
      JSON.stringify(result, undefined, 2),
      "utf-8",
    );

    completed++;
    s.stop(`${task.name} ${ansis.green("✓")}`);
  } catch (error) {
    failures++;
    s.stop(`${task.name} ${ansis.red("✗")}`);
    clack.log.error(error instanceof Error ? error.message : String(error));
  }
}

// Summary
const parts: string[] = [`${completed} completed`];
if (failures > 0) parts.push(`${failures} failed`);

clack.outro(
  `Done — ${parts.join(", ")}. Results in ${ansis.cyan(SYNTHESIS_DIR)}`,
);

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
