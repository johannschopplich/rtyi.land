import * as fsp from "node:fs/promises";
import * as path from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import ansis from "ansis";
import PQueue from "p-queue";
import { DEFAULT_GOOGLE_PRO_MODEL, STREAMS_DIR } from "../src/constants";
import { generateQuestions } from "../src/context/questions";

clack.intro("Interview Questions Generator");

const streamExtractsDir = path.join(
  STREAMS_DIR,
  DEFAULT_GOOGLE_PRO_MODEL.replaceAll(".", "-"),
);

const files = (await fsp.readdir(streamExtractsDir))
  .filter((file) => file.endsWith(".txt"))
  .map((file) => path.join(streamExtractsDir, file));

if (files.length === 0) {
  clack.cancel(`No files found in ${ansis.bold(streamExtractsDir)}.`);
  process.exit(1);
}

clack.note(
  `Found ${ansis.bold(files.length)} stream extracts to use for question generation`,
);

const queue = new PQueue({ concurrency: 1 });

for (const file of files) {
  queue.add(() => generateQuestions(file));
}

// Add event listeners to show queue progress
let completed = 0;
queue.on("completed", () => {
  completed++;
  clack.log.info(`Progress: ${completed}/${files.length} files processed`);
});

// Wait for all tasks to complete
await queue.onIdle();

// Success message
clack.outro("All stream extracts processed successfully!");
