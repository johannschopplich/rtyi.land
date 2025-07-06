---
title: Stream Analysis
description: Overview of all stream analyses processed by different AI models.
---

<script setup>
import { data as modelStreams } from "./model-streams.data";

const MODEL_LABELS = {
  "claude-opus-4-20250514": "Claude Opus 4",
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
    oldestDate: streams[streams.length - 1]?.date,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const totalStreams = groupedStreams.length;
const dateRange =
  totalStreams > 0
    ? `${groupedStreams[groupedStreams.length - 1].date} – ${groupedStreams[0].date}`
    : "No streams available";
</script>

# Stream Analysis Overview

Most of [Kaze's development streams](https://www.youtube.com/@KazeClips/streams) have been transcribed with Whisper and afterwards analyzed by various AI models. This page provides an overview of all stream analyses.

These summaries save me hours of watching and allow me to prepare for the interviews and discussions with Kaze and the team.

The [comprehensive prompt](/prompts/2.stream-extraction) I wrote guarantees the consistent extraction of key insights, collaborator information, game design decisions and challenges, and business aspects discussions from the stream content.

::: tip Summary
**Total Streams:** {{ totalStreams }}

**Date Range:** {{ dateRange }}

**Models:** {{ modelStats.length }}
:::

## Models Overview

Google's Gemini provides more detailed summaries, while Claude Opus is more concise. I prefer Gemini for its depth, but Claude Opus is great for quick overviews.

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

::: info Note
Some names may be incorrect due to transcription errors. Furthermore, the summaries are not perfect and may contain inaccuracies.
:::

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
