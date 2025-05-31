import fsp from "fs/promises";
import path from "path";
import { glob } from "tinyglobby";
import { KV_QUESTIONS_DIR } from "../../src/constants";
import { formatDateFromYYYYMMDD } from "../.vitepress/utils";

export default {
  async paths() {
    const files = await glob("*.txt", {
      cwd: KV_QUESTIONS_DIR,
      absolute: true,
    });

    const results = await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fsp.readFile(filePath, "utf8");
        const fileName = path.basename(filePath, ".txt");

        let questionsData: Record<
          string,
          { context: string; question: string }[]
        >;

        try {
          questionsData = JSON.parse(fileContent);
        } catch (error) {
          throw new Error(`Invalid JSON in ${fileName}: ${error}`);
        }

        // Extract date from filename (format: YYYYMMDD-title)
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

        let markdownContent = `# Stream Questions Analysis

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
            id: fileName,
            date: formattedDate,
            rawDate,
            contributors: contributors.length,
            totalQuestions,
          },
          content: markdownContent,
        };
      }),
    );

    // Sort by date (newest first)
    return results.sort((a, b) =>
      b.params.rawDate.localeCompare(a.params.rawDate),
    );
  },
};
