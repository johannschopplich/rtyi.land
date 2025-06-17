import * as path from "node:path";
import { defineLoader } from "vitepress";
import { KV_QUESTIONS_DIR } from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export interface QuestionStreamData {
  id: string;
  date: string;
  rawDate: string;
  contributors: string[];
  totalQuestions: number;
}

export default defineLoader({
  async load() {
    const questionStreams = await globAndProcessFiles(
      "**/*.txt",
      KV_QUESTIONS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const fileNameWithoutExt = path.basename(fileName, ".txt");

        let questionsData: Record<string, string[]>;

        try {
          questionsData = JSON.parse(fileContent);
        } catch {
          throw new Error(`Invalid JSON in ${filePath}`);
        }

        const [rawDate] = fileNameWithoutExt.split("-");
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
          id: fileNameWithoutExt,
          date: formattedDate,
          rawDate,
          contributors,
          totalQuestions,
        };

        return streamData;
      },
    );

    // Sort by date (newest first)
    return questionStreams.sort((a, b) => b.rawDate.localeCompare(a.rawDate));
  },
});
