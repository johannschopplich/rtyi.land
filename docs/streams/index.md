---
title: Stream Analysis
description: All analyzed development streams at a glance.
---

<script setup>
import { data as modelStreams } from "./model-streams.data";
import { STREAM_ANALYSIS_DIR } from "../../src/constants";
import { formatTopicLabel } from "../.vitepress/shared";

const allStreams = modelStreams[STREAM_ANALYSIS_DIR] ?? [];

// Sort newest first (already sorted from data loader)
const recentStreams = allStreams.slice(0, 10);

const dateRange =
  allStreams.length > 0
    ? `${allStreams.at(-1).date} – ${allStreams[0].date}`
    : "No streams available";

// Significance breakdown
const significanceCounts = allStreams.reduce((acc, stream) => {
  acc[stream.significance] = (acc[stream.significance] || 0) + 1;
  return acc;
}, {});

const topicTotals = allStreams.reduce((acc, stream) => {
  for (const [topic, count] of Object.entries(stream.topicCounts || {})) {
    acc[topic] = (acc[topic] || 0) + count;
  }
  return acc;
}, {});

const topTopics = Object.entries(topicTotals)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const SIGNIFICANCE_BADGES = {
  pivotal: "🟠 Pivotal",
  milestone: "🟢 Milestone",
  notable: "🔵 Notable",
  routine: "⚪ Routine",
};
</script>

# Stream Analysis Dashboard

Most of [Kaze's development streams](https://www.youtube.com/@KazeClips/streams) have been transcribed with Whisper and analyzed by AI. Each stream is broken down into findings, stories, quotes, and open questions – the raw material for interview prep.

::: tip Summary
**Total Streams:** {{ allStreams.length }} ·
**Date Range:** {{ dateRange }}

**Significance:** {{ significanceCounts.pivotal || 0 }} pivotal · {{ significanceCounts.milestone || 0 }} milestone · {{ significanceCounts.notable || 0 }} notable · {{ significanceCounts.routine || 0 }} routine
:::

## Quick Navigation

| Page                                      | Description                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| [**Highlights**](/streams/highlights)     | Milestone & pivotal streams only – start here                          |
| [**By Topic**](/topics/index.md)          | Findings grouped by theme (design, technical, philosophy, etc.)        |
| [**Team Profiles**](/team/index.md)       | What each team member did, said, and experienced across streams        |
| [**Quotes**](/quotes/index.md)            | Standout quotes – good for narration, chapter titles, or trailer lines |
| [**Open Questions**](/questions/index.md) | Follow-up questions for each person, sorted by involvement             |

## Top Topics

<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>Findings</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="[topic, count] in topTopics" :key="topic">
      <td>
        <a :href="`/topics/${topic}`">{{ formatTopicLabel(topic) }}</a>
      </td>
      <td>{{ count }}</td>
    </tr>
  </tbody>
</table>

[View all topics →](/topics/index.md)

## Recent Streams

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th></th>
      <th>Summary</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in recentStreams" :key="stream.id">
      <td style="white-space: nowrap;">
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td style="white-space: nowrap; font-size: 0.8em;">
        {{ SIGNIFICANCE_BADGES[stream.significance] || "" }}
      </td>
      <td>{{ stream.excerpt }}</td>
    </tr>
  </tbody>
</table>

## All Streams

<details>
<summary><strong>Browse all {{ allStreams.length }} streams</strong></summary>

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th></th>
      <th>Level(s)</th>
      <th>Summary</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in allStreams" :key="stream.id">
      <td style="white-space: nowrap;">
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td style="white-space: nowrap; font-size: 0.8em;">
        {{ SIGNIFICANCE_BADGES[stream.significance] || "" }}
      </td>
      <td style="white-space: nowrap; font-size: 0.85em;">
        {{ stream.level.join(", ") || "—" }}
      </td>
      <td>{{ stream.excerpt }}</td>
    </tr>
  </tbody>
</table>

</details>
