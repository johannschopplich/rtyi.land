---
title: Stream Analysis Overview
description: Comprehensive overview of all stream analyses across all AI models
---

<script setup>
import { data as modelStreams } from "./model-streams.data";

const MODEL_LABELS = {
  "claude-opus-4-20250514": "Claude Opus 4",
  "claude-sonnet-4-20250514": "Claude Sonnet 4",
  "gemini-2-5-pro-preview-05-06": "Gemini 2.5 Pro",
};

const streamsByDate = {};
let totalAnalyses = 0;

for (const [modelName, streams] of Object.entries(modelStreams)) {
  totalAnalyses += streams.length;

  for (const stream of streams) {
    streamsByDate[stream.rawDate] ??= {
      date: stream.date,
      rawDate: stream.rawDate,
      models: [],
      excerpt: stream.excerpt, // Use excerpt from first model
    };

    streamsByDate[stream.rawDate].models.push({
      name: stream.model,
      label: MODEL_LABELS[modelName],
      id: stream.id,
    });
  }
}

// Convert to array and sort by date (newest first)
const groupedStreams = Object.values(streamsByDate).sort((a, b) =>
  b.rawDate.localeCompare(a.rawDate)
);

// Get model statistics
const modelStats = Object.entries(modelStreams)
  .map(([modelName, streams]) => ({
    name: modelName,
    label: MODEL_LABELS[modelName],
    count: streams.length,
    latestDate: streams[0]?.date,
    oldestDate: streams[streams.length - 1]?.date,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const totalDates = groupedStreams.length;
const dateRange =
  totalDates > 0
    ? `${groupedStreams[groupedStreams.length - 1].date} – ${groupedStreams[0].date}`
    : "No streams available";
</script>

# Stream Analysis Overview

This page provides a comprehensive overview of all stream analyses processed by different AI models.

::: tip Summary
**Total Analyses:** {{ totalAnalyses }}

**Unique Dates:** {{ totalDates }}

**Date Range:** {{ dateRange }}

**Models:** {{ modelStats.length }}
:::

## Models Overview

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
      <td><strong>{{ model.label }}</strong></td>
      <td>{{ model.count }}</td>
      <td>
        <span v-if="model.count > 0">
          {{ model.oldestDate }} – {{ model.latestDate }}
        </span>
        <span v-else>No streams</span>
      </td>
      <td style="white-space: nowrap;">
        <a :href="`/streams/${model.name}`" v-if="model.count > 0">Details →</a>
      </td>
    </tr>
  </tbody>
</table>

## All Streams

::: info Grouping by Date
{{ totalDates }} unique stream dates with analyses from different models. Each row shows all available model analyses for that date.
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
      <div
          v-for="model in streamGroup.models" 
          :key="model.id"
      >
        <a :href="`/streams/${model.id}`" style="white-space: nowrap;">
          {{ model.label }}
        </a>
      </div>
      </td>
      <td>{{ streamGroup.excerpt }}</td>
    </tr>
  </tbody>
</table>
