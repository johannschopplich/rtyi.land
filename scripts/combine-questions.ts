#!/usr/bin/env node
import * as clack from "@clack/prompts";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import ansis from "ansis";
import { z } from "zod";
import { getQuestionStorage } from "../src/utils";
import { DOCS_DIR } from "../src/constants";
import { INTERVIEW_QUESTIONS_SCHEMA } from "../src/prompts";

type StorageValue = z.infer<typeof INTERVIEW_QUESTIONS_SCHEMA>;

clack.intro("Interview Questions Combiner");

const storage = getQuestionStorage<StorageValue>();

clack.note(
  `Found ${ansis.bold((await storage.getKeys()).length)} streams with generated questions`,
);

const keys = await storage.getKeys();
const allQuestions: StorageValue = {
  kaze: [],
  biobak: [],
  badub: [],
  zeina: [],
};

// Iterate through each key and combine questions
for (const key of keys) {
  const questions = await storage.getItem<StorageValue>(key);
  if (!questions) {
    clack.log.warn(`No questions found for key: ${key}`);
    continue;
  }

  // Validate the questions against the schema
  const parsed = INTERVIEW_QUESTIONS_SCHEMA.safeParse(questions);
  if (!parsed.success) {
    clack.log.error(`Invalid questions found for key: ${key}`);
    continue;
  }

  // Combine the questions into the allQuestions object
  allQuestions.kaze.push(...parsed.data.kaze);
  allQuestions.biobak.push(...parsed.data.biobak);
  allQuestions.badub.push(...parsed.data.badub);
  allQuestions.zeina.push(...parsed.data.zeina);
}

const markdown = `
# All Interview Questions

This document combines all interview questions from various streams.

## Kaze Questions

${allQuestions.kaze.map((q) => `- **Question**: ${q.question}\n  **Context**: ${q.context}`).join("\n")}

## Biobak Questions

${allQuestions.biobak.map((q) => `- **Question**: ${q.question}\n  **Context**: ${q.context}`).join("\n")}

## Badub Questions

${allQuestions.badub.map((q) => `- **Question**: ${q.question}\n  **Context**: ${q.context}`).join("\n")}

## Zeina Questions

${allQuestions.zeina.map((q) => `- **Question**: ${q.question}\n  **Context**: ${q.context}`).join("\n")}
`.trimStart();

await fsp.writeFile(
  path.join(DOCS_DIR, "questions/_all-questions.md"),
  markdown,
);

clack.outro("All questions processed successfully!");
