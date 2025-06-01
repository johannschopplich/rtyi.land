import { defineLoader } from "vitepress";
import fsp from "fs/promises";
import path from "path";
import { glob } from "tinyglobby";
import { KV_QUESTIONS_DIR } from "../../src/constants";
import { formatDateFromYYYYMMDD } from "../.vitepress/utils";

export interface QuestionStreamData {
  id: string;
  date: string;
  rawDate: string;
  contributors: string[];
  totalQuestions: number;
}

export default defineLoader({
  async load() {
    const files = await glob(`**/*.txt`, {
      cwd: KV_QUESTIONS_DIR,
      absolute: true,
    });

    const questionStreams: QuestionStreamData[] = [];

    await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fsp.readFile(filePath, "utf8");
        const fileName = path.basename(filePath, ".txt");

        let questionsData: Record<string, string[]>;

        try {
          questionsData = JSON.parse(fileContent);
        } catch (error) {
          console.warn(`Invalid JSON in ${fileName}:`, error);
          return;
        }

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        // Filter out contributors with empty question arrays
        const contributors = Object.keys(questionsData).filter(
          (contributor) => questionsData[contributor].length > 0,
        );
        const totalQuestions = contributors.reduce(
          (sum, contributor) => sum + questionsData[contributor].length,
          0,
        );

        const streamData: QuestionStreamData = {
          id: fileName,
          date: formattedDate,
          rawDate,
          contributors,
          totalQuestions,
        };

        questionStreams.push(streamData);
      }),
    );

    // Sort by date (newest first)
    return questionStreams.sort((a, b) => b.rawDate.localeCompare(a.rawDate));
  },
});
