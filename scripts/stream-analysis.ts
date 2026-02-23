import type { TranscriptResult } from "../src/context/transcripts";
import * as fsp from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import * as ansis from "ansis";
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

const { modelName, concurrency } = await clack.group(
  {
    modelName: () =>
      clack.select({
        message: "Select AI model:",
        options: Object.entries(MODEL_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      }),
    concurrency: () =>
      clack.text({
        message: "Enter maximum concurrent processes (recommended: 3-5):",
        defaultValue: "1",
        placeholder: "1",
        validate(value) {
          const parsedValue = value ? Number.parseInt(value) : undefined;
          if (
            parsedValue != null &&
            (Number.isNaN(parsedValue) || parsedValue < 1)
          ) {
            return "Please enter a valid positive number";
          }
        },
      }),
  },
  {
    onCancel: () => {
      clack.cancel("Operation cancelled");
      process.exit(0);
    },
  },
);

const concurrencyLimit = Number.parseInt(concurrency);

// Get list of transcript files
const files = (await fsp.readdir(TRANSCRIPTS_INPUT_DIR))
  .filter((file) => file.endsWith(".txt"))
  .map((file) => join(TRANSCRIPTS_INPUT_DIR, file));

if (files.length === 0) {
  clack.cancel(`No transcript files found in ${ansis.bold("./transcripts")}`);
  process.exit(1);
}

clack.log.info(`Found ${ansis.bold(files.length)} transcript files to process`);

// Create a queue with concurrency limit
const queue = new PQueue({ concurrency: concurrencyLimit });
const processFile = createTranscriptProcessor(modelName);

const bar = clack.progress({ max: files.length });
bar.start("Processing transcripts");

// Track results for post-run summary
let completed = 0;
let processed = 0;
let skipped = 0;
let failures = 0;

// Update progress bar as files complete
queue.on("completed", (result: TranscriptResult) => {
  completed++;

  if (result.status === "processed") {
    processed++;
  } else if (result.status === "skipped") {
    skipped++;
  } else {
    failures++;
    bar.stop(`Error processing ${result.fileName}`);
    clack.log.error(
      result.error instanceof Error
        ? result.error.message
        : String(result.error),
    );
    bar.start(
      `Processing (${completed}/${files.length}) \u2013 ${result.fileName}`,
    );
  }

  bar.advance(
    completed,
    `Processing (${completed}/${files.length}) \u2013 ${result.fileName}`,
  );
});

for (const file of files) {
  queue.add(() => processFile(file));
}

// Wait for all tasks to complete
await queue.onIdle();

// Build a summary line for the stop message
const parts: string[] = [`${processed} processed`];
if (skipped > 0) parts.push(`${skipped} skipped`);
if (failures > 0) parts.push(`${failures} failed`);
bar.stop(`Done \u2014 ${parts.join(", ")} (${files.length} total)`);

clack.outro(
  `Check the ${ansis.cyan(TRANSCRIPTS_OUTPUT_DIR)} directory for results.`,
);
