import type { TeamMember } from "../../src/analysis/schemas";
import { capitalizeInitialLetter } from "../.vitepress/shared";
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

export default {
  async paths() {
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

    // Generate paths for each team member
    return Object.values(teamMemberQuestions).map((member) => {
      const totalTopics = member.streams.reduce(
        (sum, stream) => sum + stream.openQuestions.length,
        0,
      );

      const markdownContent = `# Questions for ${capitalizeInitialLetter(member.name)}

This page contains all open questions related to ${capitalizeInitialLetter(member.name)}'s work and contributions across development streams. Questions are organized by stream date and grouped by topic.

::: tip Summary
**Team Member:** ${capitalizeInitialLetter(member.name)}

**Streams:** ${member.streams.length}

**Total Topics:** ${totalTopics}

**Total Questions:** ${member.totalQuestions}
:::

${member.streams
  .map((stream) => {
    return `
## ${stream.date}

[Stream Analysis →](/streams/${stream.id})

${stream.openQuestions
  .map((question) => {
    return `
### ${question.topic}

**Context:** ${question.context}

${
  question.related_to.length > 1
    ? `**Also related to:** ${question.related_to
        .filter((name) => name !== member.name)
        .map(capitalizeInitialLetter)
        .join(", ")}`
    : ""
}

**Questions:**

${question.questions.map((q, index) => `${index + 1}. ${q}`).join("\n")}

`;
  })
  .join("")}`;
  })
  .join("")}
`;

      return {
        params: {
          id: member.name,
        },
        content: markdownContent,
      };
    });
  },
};
