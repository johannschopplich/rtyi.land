---
title: Stream Analysis
description: Overview of all stream analyses processed by different AI models.
---

<script setup>
import { data as modelStreams } from "./model-streams.data";

/// keep-sorted
const MODEL_LABELS = {
  "claude-opus-4-20250514": "Claude Opus 4",
  o3: "o3",
  "gemini-2-5-pro": "Gemini 2.5 Pro",
};

const streamMap = Object.entries(modelStreams).reduce(
  (map, [modelName, streams]) => {
    for (const stream of streams) {
      const currentStream = map.get(stream.rawDate);
      if (currentStream) {
        currentStream.models.push({
          name: stream.model,
          label: MODEL_LABELS[modelName],
          id: stream.id,
        });
      } else {
        map.set(stream.rawDate, {
          date: stream.date,
          rawDate: stream.rawDate,
          models: [
            {
              name: stream.model,
              label: MODEL_LABELS[modelName],
              id: stream.id,
            },
          ],
          excerpt: stream.excerpt,
        });
      }
    }

    return map;
  },
  new Map(),
);

// Convert to array and sort by date (newest first)
const groupedStreams = [...streamMap.values()].sort((a, b) =>
  b.rawDate.localeCompare(a.rawDate),
);

const modelStats = Object.entries(modelStreams)
  .map(([modelName, streams]) => ({
    name: modelName,
    label: MODEL_LABELS[modelName],
    count: streams.length,
    latestDate: streams[0]?.date,
    oldestDate: streams.at(-1)?.date,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const dateRange =
  groupedStreams.length > 0
    ? `${groupedStreams.at(-1).date} – ${groupedStreams[0].date}`
    : "No streams available";
</script>

# Stream Analysis Overview

Most of [Kaze's development streams](https://www.youtube.com/@KazeClips/streams) have been transcribed with Whisper and afterwards analyzed by various AI models. This page provides an overview of all stream analyses.

These summaries save me hours of watching and allow me to prepare for the interviews and discussions with Kaze and the team.

The [prompt for stream analysis](/prompts/2.stream-analysis) guarantees the consistent extraction of key findings on development, context, and contributors. It also identifies key stories and open questions.

::: tip Summary
**Total Streams:** {{ groupedStreams.length }}

**Date Range:** {{ dateRange }}

**Models:** {{ modelStats.length }}
:::

## Models Overview

Google's Gemini model generates detailed summaries, while OpenAI's o3 model is notably more concise. My personal preference is o3 for its predictable clarity and brevity.

<table>
  <thead>
    <tr>
      <th>Model</th>
      <th>Streams</th>
      <th>Date Range</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="model in modelStats" :key="model.name">
      <td>
        <strong>{{ model.label }}</strong>
      </td>
      <td>{{ model.count }}</td>
      <td>
        <span v-if="model.count > 0">
          {{ model.oldestDate }} – {{ model.latestDate }}
        </span>
        <span v-else>No streams</span>
      </td>
      <td style="white-space: nowrap;">
        <a :href="`/streams/${model.name}`" v-if="model.count > 0">
          Details →
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Stream Overview

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Models</th>
      <th>Summary</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="streamGroup in groupedStreams" :key="streamGroup.rawDate">
      <td>
        <strong>{{ streamGroup.date }}</strong>
      </td>
      <td>
        <div v-for="model in streamGroup.models" :key="model.id">
          <a :href="`/streams/${model.id}`" style="white-space: nowrap;">
            {{ model.label }} →
          </a>
        </div>
      </td>
      <td>{{ streamGroup.excerpt }}</td>
    </tr>
  </tbody>
</table>
