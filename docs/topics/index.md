---
title: Topics
description: Stream findings grouped by topic.
---

<script setup>
import { data as topicsData } from "./topics.data";

const TOPIC_DESCRIPTIONS = {
  design: "Design decisions, creative process, rationale, influences",
  technical:
    "Technical challenges, solutions, performance work, engine improvements",
  milestone: "Project milestones, level completions, major features finished",
  philosophy: "Game design philosophy, creative principles, worldview",
  personal: "Life events, emotions, health, finances, work-life balance",
  team: "Team dynamics, collaboration, dependencies, working relationships",
  "legal-nintendo": "Nintendo takedowns, DMCA, legal strategy, copyright",
  community: "Viewer feedback, community involvement, chat-driven decisions",
  business: "Release strategy, monetization, Kickstarter, physical cartridge",
};

const topics = Object.values(topicsData).sort(
  (a, b) => b.findings.length - a.findings.length,
);

const totalFindings = topics.reduce(
  (sum, topic) => sum + topic.findings.length,
  0,
);
</script>

# Browse by Topic

Every finding from stream analyses is tagged with a topic. Pick a topic to see everything the AI extracted about it, across all streams – useful for building thematic interview blocks.

See also: [Team Profiles](/team/index.md) for a per-person view, or [Highlights](/streams/highlights) for the most important streams.

::: tip Summary
**Total Topics:** {{ topics.length }}

**Total Findings:** {{ totalFindings }}
:::

<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>Findings</th>
      <th>Streams</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="topic in topics" :key="topic.topic">
      <td>
        <a :href="`/topics/${topic.topic}`">
          <strong>{{ topic.label }}</strong>
        </a>
      </td>
      <td style="text-align: center;">{{ topic.findings.length }}</td>
      <td style="text-align: center;">{{ topic.streamCount }}</td>
      <td style="font-size: 0.85em; color: var(--vp-c-text-2);">
        {{ TOPIC_DESCRIPTIONS[topic.topic] || "" }}
      </td>
    </tr>
  </tbody>
</table>
