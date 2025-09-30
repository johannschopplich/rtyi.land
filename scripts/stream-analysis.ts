import * as fsp from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import ansis from "ansis";
import PQueue from "p-queue";
import {
  MODEL_LABELS,
  TRANSCRIPTS_INPUT_DIR,
  TRANSCRIPTS_OUTPUT_DIR,
} from "../src/constants";
import { createTranscriptProcessor } from "../src/context/transcripts";
import { ensureDirectoryExists } from "../src/utils";

clack.intro("Transcript Extractor");

await ensureDirectoryExists(TRANSCRIPTS_OUTPUT_DIR);

const modelName = await clack.select({
  message: "Enter AI model name:",
  options: Object.entries(MODEL_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

if (clack.isCancel(modelName)) {
  clack.cancel("Operation cancelled");
  process.exit(0);
}

// Get concurrency limit from user
const concurrency = await clack.text({
  message: "Enter maximum concurrent processes (recommended: 3-5):",
  defaultValue: "1",
  placeholder: "1",
  validate(value) {
    const num = Number.parseInt(value);
    if (value && (Number.isNaN(num) || num < 1)) {
      return "Please enter a valid positive number";
    }
  },
});

if (clack.isCancel(concurrency)) {
  clack.cancel("Operation cancelled");
  process.exit(0);
}

const concurrencyLimit = Number.parseInt(concurrency);

// Get list of transcript files
const files = (await fsp.readdir(TRANSCRIPTS_INPUT_DIR))
  .filter((file) => file.endsWith(".txt"))
  .map((file) => join(TRANSCRIPTS_INPUT_DIR, file));

if (files.length === 0) {
  clack.cancel(`No transcript files found in ${ansis.bold("./transcripts")}`);
  process.exit(1);
}

clack.note(`Found ${ansis.bold(files.length)} transcript files to process`);

// Create a queue with concurrency limit
const queue = new PQueue({ concurrency: concurrencyLimit });
const processFile = createTranscriptProcessor(modelName);

for (const file of files) {
  queue.add(() => processFile(file));
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
clack.outro(
  `All transcripts processed successfully! Check the ${ansis.cyan(TRANSCRIPTS_OUTPUT_DIR)} directory for results.`,
);
