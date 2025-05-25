import fsp from "fs/promises";
import path from "path";
import { glob } from "tinyglobby";
import { DATA_DIR } from "../../src/constants";
import { extractContent, formatDateFromYYYYMMDD } from "../.vitepress/utils";

export default {
  async paths() {
    const files = await glob(`**/*.txt`, { cwd: DATA_DIR, absolute: true });

    const results = await Promise.all(
      files.map(async (filePath) => {
        const fileContent = await fsp.readFile(filePath, "utf8");
        const fileName = path.basename(filePath);
        const modelDir = path.basename(path.dirname(filePath));
        let content = extractContent(fileContent);

        if (!content) {
          throw new Error(
            `No extracted information available for ${fileName}. Check again!`
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
      })
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
