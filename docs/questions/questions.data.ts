import * as path from "node:path";
import { tryParseJSON } from "utilful";
import { defineLoader } from "vitepress";
import { STREAMS_DIR } from "../../src/constants";
import {
  formatDateFromYYYYMMDD,
  globAndProcessFiles,
} from "../.vitepress/utils";

export interface OpenQuestion {
  topic: string;
  context: string;
  questions: string[];
  related_to: string[];
  priority: string;
}

export interface QuestionStreamData {
  id: string;
  date: string;
  rawDate: string;
  model: string;
  openQuestions: OpenQuestion[];
}

export interface TeamMemberQuestions {
  name: string;
  streams: QuestionStreamData[];
  totalQuestions: number;
}

export default defineLoader({
  async load() {
    const streamData = await globAndProcessFiles(
      "**/*.json",
      STREAMS_DIR,
      ({ filePath, fileName, fileContent }) => {
        const modelDir = path.basename(path.dirname(filePath));
        if (modelDir !== "o3") return;

        const streamData = tryParseJSON<Record<string, any>>(fileContent);

        if (!streamData) return;

        const [rawDate] = fileName.split("-");
        const formattedDate = formatDateFromYYYYMMDD(rawDate);
        const openQuestions = streamData.open_questions ?? [];

        // Only include streams that have open questions
        if (openQuestions.length === 0) return;

        const streamInfo: QuestionStreamData = {
          id: `${modelDir}-${rawDate}`,
          date: formattedDate,
          rawDate,
          model: modelDir,
          openQuestions,
        };

        return streamInfo;
      },
    );

    // Group questions by team member
    const teamMemberQuestions: Record<string, TeamMemberQuestions> = {};

    for (const stream of streamData) {
      for (const question of stream.openQuestions) {
        for (const member of question.related_to) {
          if (!teamMemberQuestions[member]) {
            teamMemberQuestions[member] = {
              name: member,
              streams: [],
              totalQuestions: 0,
            };
          }

          // Check if this stream is already added for this member
          const existingStream = teamMemberQuestions[member].streams.find(
            (s) => s.id === stream.id,
          );

          if (!existingStream) {
            // Filter questions for this specific member
            const memberQuestions = stream.openQuestions.filter((q) =>
              q.related_to.includes(member),
            );

            teamMemberQuestions[member].streams.push({
              ...stream,
              openQuestions: memberQuestions,
            });
          }

          // Count questions for this member
          teamMemberQuestions[member].totalQuestions +=
            question.questions.length;
        }
      }
    }

    // Sort streams within each member by date (newest first)
    for (const member of Object.values(teamMemberQuestions)) {
      member.streams.sort((a, b) => b.rawDate.localeCompare(a.rawDate));
    }

    return teamMemberQuestions;
  },
});
