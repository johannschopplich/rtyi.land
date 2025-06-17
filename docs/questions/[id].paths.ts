import * as path from "node:path";
import { KV_QUESTIONS_DIR } from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export interface QuestionData {
  context: string;
  question: string;
}

export default {
  async paths() {
    const results = await globAndProcessFiles(
      "*.txt",
      KV_QUESTIONS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const fileNameWithoutExt = path.basename(filePath, ".txt");

        let questionsData: Record<string, QuestionData[]>;

        try {
          questionsData = JSON.parse(fileContent);
        } catch (error) {
          throw new Error(`Invalid JSON in ${fileName}: ${error}`);
        }

        // Extract date from filename (format: YYYYMMDD-title)
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

        const markdownContent = `# Stream Questions Analysis

::: tip Summary
**Date:** ${formattedDate}

**Contributors:** ${contributors.length}

**Total Questions:** ${totalQuestions}
:::

${contributors
  .map((contributor) => {
    return `
## ${contributor.charAt(0).toUpperCase() + contributor.slice(1)}

${questionsData[contributor]
  .map(
    (item, index) => `
### Question ${index + 1}

**Context:** ${item.context}

**Question:** ${item.question}

`,
  )
  .join("")}`;
  })
  .join("")}
`;

        return {
          params: {
            id: fileNameWithoutExt,
            date: formattedDate,
            rawDate,
            contributors: contributors.length,
            totalQuestions,
          },
          content: markdownContent,
        };
      },
    );

    // Sort by date (newest first)
    return results.sort((a, b) =>
      b.params.rawDate.localeCompare(a.params.rawDate),
    );
  },
};
