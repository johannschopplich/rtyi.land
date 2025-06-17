import * as fsp from "node:fs/promises";
import * as path from "node:path";
import process from "node:process";
import * as clack from "@clack/prompts";
import ansis from "ansis";
import {
  DEFAULT_GOOGLE_PRO_MODEL,
  DOCS_DIR,
  STREAMS_DIR,
} from "../src/constants";

clack.intro("Stream Extracts Combiner");

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

clack.note(`Found ${ansis.bold(files.length)} stream extracts`);

const allExtracts: string[] = [];

for (const file of files) {
  let fileContent = await fsp.readFile(file, "utf8");
  const fileName = path.basename(file, ".txt");
  const [date] = fileName.split("-");
  fileContent = fileContent.replace(
    "<extracted_information>",
    `<extracted_information>\n*Extracted on: ${date}*\n`,
  );

  allExtracts.push(fileContent);
}

await fsp.writeFile(
  path.join(DOCS_DIR, "_all-extracts.md"),
  allExtracts.join("\n\n"),
);

clack.outro("All stream extracts processed successfully!");
