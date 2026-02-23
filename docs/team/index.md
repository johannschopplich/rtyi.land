---
title: Team Profiles
description: Stream findings, stories, and quotes per team member.
---

<script setup>
import { data as teamData } from "./team.data";

const members = Object.values(teamData).sort(
  (a, b) => b.totalFindings - a.totalFindings,
);

const totalFindings = members.reduce(
  (sum, member) => sum + member.totalFindings,
  0,
);
const totalStories = members.reduce(
  (sum, member) => sum + member.totalStories,
  0,
);
const totalQuotes = members.reduce(
  (sum, member) => sum + member.totalQuotes,
  0,
);

const ROLES = {
  kaze: "Lead Developer & Project Creator",
  biobak: "Graphics Artist & Level Designer",
  badub: "Composer & Audio Engineer",
  zeina: "Animator & Character Artist",
};
</script>

# Team Profiles

Each profile collects everything said about or by a team member across all streams – contributor findings, key stories they were part of, and their memorable quotes. Useful for preparing individual interviews.

See also: [By Topic](/topics/index.md) for a thematic view, or [Open Questions](/questions/index.md) for interview follow-ups.

::: tip Summary
**Total Findings:** {{ totalFindings }} ·
**Total Stories:** {{ totalStories }} ·
**Total Quotes:** {{ totalQuotes }}
:::

<table>
  <thead>
    <tr>
      <th>Member</th>
      <th>Role</th>
      <th>Streams</th>
      <th>Findings</th>
      <th>Stories</th>
      <th>Quotes</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="member in members" :key="member.name">
      <td>
        <strong>{{ member.label }}</strong>
      </td>
      <td style="font-size: 0.85em;">
        {{ ROLES[member.name] || "Team Member" }}
      </td>
      <td style="text-align: center;">{{ member.streams.length }}</td>
      <td style="text-align: center;">{{ member.totalFindings }}</td>
      <td style="text-align: center;">{{ member.totalStories }}</td>
      <td style="text-align: center;">{{ member.totalQuotes }}</td>
      <td style="white-space: nowrap;">
        <a :href="`/team/${member.name}`">Profile →</a>
      </td>
    </tr>
  </tbody>
</table>

### Quick Links

For each team member, you can also view:

- **[Interview Questions](/interviews/index.md)** – hand-crafted questions for each interview
- **[Open Questions](/questions/index.md)** – automatically generated follow-up questions from stream analysis
