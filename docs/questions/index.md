<script setup>
import { data as teamMemberQuestions } from "./questions.data.ts";
import { capitalizeInitialLetter } from "../.vitepress/shared.ts";

const teamMembers = Object.values(teamMemberQuestions);
const totalQuestions = teamMembers.reduce(
  (sum, member) => sum + member.totalQuestions,
  0,
);
const totalStreams = teamMembers.reduce(
  (sum, member) => sum + member.streams.length,
  0,
);

function getMemberRole(name) {
  const roles = {
    kaze: "Lead Developer and Project Creator",
    biobak: "Visual Artist and Designer",
    badub: "Composer and Audio Engineer",
    zeina: "Animator and Character Artist",
  };

  return roles[name.toLowerCase()] || "Team Member";
}
</script>

# Open Questions

Generated from [stream analyses](/streams/) – each analysis identifies the people involved and produces follow-up questions based on what was discussed. Questions are grouped by team member, sorted by involvement.

See also: [Interview Questions](/interviews/index.md) for the hand-crafted variants, or [Team Profiles](/team/index.md) for full per-person context.

::: tip Summary
**Total Contributors with Questions:** {{ teamMembers.length }}

**Total Questions:** {{ totalQuestions }}

**Total Streams with Questions:** {{ totalStreams }}
:::

## Team Members and Questions

<table>
  <thead>
    <tr>
      <th>Team Member</th>
      <th>Role</th>
      <th>Streams</th>
      <th>Total Questions</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="member in teamMembers" :key="member.name">
      <td>
        <strong>{{ capitalizeInitialLetter(member.name) }}</strong>
      </td>
      <td>{{ getMemberRole(member.name) }}</td>
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
