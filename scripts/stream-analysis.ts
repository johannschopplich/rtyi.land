import type { TranscriptResult } from "../src/analysis/runner";
import * as fsp from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import * as ansis from "ansis";
import PQueue from "p-queue";
import { analyzeTranscript } from "../src/analysis/runner";
import { STREAM_ANALYSIS_DIR, TRANSCRIPTS_INPUT_DIR } from "../src/constants";
import { ensureDirectoryExists } from "../src/utils";

clack.intro("Transcript Extractor");

await ensureDirectoryExists(STREAM_ANALYSIS_DIR);

const { concurrency } = await clack.group(
  {
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
    1,
    `Processing (${completed}/${files.length}) \u2013 ${result.fileName}`,
  );
});

for (const file of files) {
  queue.add(() => analyzeTranscript(file));
}

await queue.onIdle();

// Build a summary line for the stop message
const parts: string[] = [`${processed} processed`];
if (skipped > 0) parts.push(`${skipped} skipped`);
if (failures > 0) parts.push(`${failures} failed`);
bar.stop(`Done \u2014 ${parts.join(", ")} (${files.length} total)`);

clack.outro(
  `Check the ${ansis.cyan(STREAM_ANALYSIS_DIR)} directory for results.`,
);
