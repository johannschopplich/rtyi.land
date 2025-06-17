import * as fsp from "node:fs/promises";
import { basename } from "node:path";
import * as clack from "@clack/prompts";
import { generateObject } from "ai";
import { template } from "utilful";
import { DEFAULT_GOOGLE_PRO_MODEL } from "../constants";
import {
  INTERVIEW_QUESTIONS_PROMPT,
  INTERVIEW_QUESTIONS_SCHEMA,
} from "../prompts";
import { getQuestionStorage, resolveProviderLanguageModel } from "../utils";

export async function generateQuestions(filePath: string) {
  const storage = getQuestionStorage();
  const fileName = basename(filePath);
  const [date] = fileName.split("-");

  if (await storage.hasItem(fileName)) {
    clack.note(`${fileName} is already processed. Skipping…`);
    return;
  }

  try {
    const extractedInformation = await fsp.readFile(filePath, "utf-8");
    const languageModel = resolveProviderLanguageModel(
      DEFAULT_GOOGLE_PRO_MODEL,
    );

    const { object } = await generateObject({
      model: languageModel,
      temperature: 1,
      schema: INTERVIEW_QUESTIONS_SCHEMA,
      prompt: template(INTERVIEW_QUESTIONS_PROMPT, {
        streamInfo: extractedInformation,
        streamDate: date,
      }),
    });

    await storage.setItem(fileName, object);
    clack.note(`Processed ${fileName}`);
  } catch (error) {
    clack.cancel(`Error processing ${fileName}`);
    console.error(error);
  }
}
