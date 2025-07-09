import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { STREAMS_DIR } from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export default {
  async paths() {
    const results = await globAndProcessFiles(
      "**/*.json",
      STREAMS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        const streamData = tryParseJSON<Record<string, any>>(fileContent);

        if (!streamData) {
          throw new Error(
            `Failed to parse JSON for ${fileName}. Check the file format!`,
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
            streamData,
          },
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
