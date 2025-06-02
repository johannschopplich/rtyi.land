import * as path from "path";
import { STREAMS_DIR } from "../../src/constants";
import {
  extractContent,
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export default {
  async paths() {
    const results = await globAndProcessFiles(
      "**/*.txt",
      STREAMS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        let content = extractContent(fileContent);

        if (!content) {
          throw new Error(
            `No extracted information available for ${fileName}. Check again!`,
          );
        }

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);

        return {
          params: {
            id: `${modelDir}-${rawDate}`,
            date: formattedDate,
            rawDate,
            model: modelDir,
          },
          content,
        };
      },
    );

    // Sort by model directory first, then by date
    return results.sort((a, b) => {
      if (a.params.model !== b.params.model) {
        return a.params.model.localeCompare(b.params.model);
      }

      return a.params.rawDate.localeCompare(b.params.rawDate);
    });
  },
};
