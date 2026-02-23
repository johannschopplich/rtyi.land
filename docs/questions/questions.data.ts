import type { TeamMember } from "../../src/analysis/schemas";
import { defineLoader } from "vitepress";
import { loadStreamAnalyses } from "../.vitepress/utils";

export interface OpenQuestion {
  topic: string;
  context: string;
  questions: string[];
  related_to: TeamMember[];
}

export interface QuestionStreamData {
  id: string;
  date: string;
  rawDate: string;
  openQuestions: OpenQuestion[];
}

export interface TeamMemberQuestions {
  name: TeamMember;
  streams: QuestionStreamData[];
  totalQuestions: number;
}

export default defineLoader({
  async load() {
    const entries = await loadStreamAnalyses();

    const streamData: QuestionStreamData[] = entries
      .filter(({ analysis }) => (analysis.open_questions ?? []).length > 0)
      .map(({ analysis, rawDate, date, streamId }) => ({
        id: streamId,
        date,
        rawDate,
        openQuestions: analysis.open_questions ?? [],
      }));

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
