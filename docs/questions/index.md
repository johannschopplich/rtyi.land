<script setup>
import { data as teamMemberQuestions } from "./questions.data.ts";

const teamMembers = Object.values(teamMemberQuestions);
const totalQuestions = teamMembers.reduce(
  (sum, member) => sum + member.totalQuestions,
  0,
);
const totalStreams = teamMembers.reduce(
  (sum, member) => sum + member.streams.length,
  0,
);

function formatMemberName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
</script>

# Open Questions Overview

These questions are generated along the [development streams analysis](/streams/), focusing on insights that would be valuable for documentary purposes. Each stream analysis identifies key contributors and generates thoughtful questions based on the context of their work and contributions to the project.

::: tip Summary
**Total Contributors with Questions:** {{ teamMembers.length }}

**Total Questions:** {{ totalQuestions }}

**Total Streams with Questions:** {{ totalStreams }}
:::

## Team Members and Questions

The questions are organized by team member according to their level of involvement in the topics discussed:

- **Kaze** - Lead developer and project creator
- **Biobak** - Visual artist and designer
- **Badub** - Composer and audio engineer
- **Zeina** - Animator and character artist

<table>
  <thead>
    <tr>
      <th>Team Member</th>
      <th>Streams</th>
      <th>Total Questions</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="member in teamMembers" :key="member.name">
      <td>
        <strong>{{ formatMemberName(member.name) }}</strong>
      </td>
      <td style="text-align: center;">
        <strong>{{ member.streams.length }}</strong>
      </td>
      <td style="text-align: center;">
        <strong>{{ member.totalQuestions }}</strong>
      </td>
      <td style="white-space: nowrap;">
        <a :href="`/questions/${member.name}`">View Questions →</a>
      </td>
    </tr>
  </tbody>
</table>
