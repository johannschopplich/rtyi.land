---
title: Gemini 2.5 Pro – Stream Analysis
description: Comprehensive analysis of all streams processed by Gemini 2.5 Pro.
---

<script setup>
import { data as modelStreams } from "./model-streams.data.ts";

const MODEL_NAME = "gemini-2-5-pro";
const streams = modelStreams[MODEL_NAME] ?? [];
const modelLabel = "Gemini 2.5 Pro";
</script>

# {{ modelLabel }} – Stream Analysis

This page presents a systematic analysis of [Kaze's development streams](https://www.youtube.com/@KazeClips/streams) processed by Google's **{{ modelLabel }}** model after they were transcribed with Whisper.

Each analysis results page provides key findings regarding development, context, and contributors. It also identifies key stories and open questions.

::: tip Summary
**Total Streams:** {{ streams.length }}

**Date Range:** {{ streams.at(-1)?.date }} – {{ streams[0]?.date }}
:::

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Summary</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in streams" :key="stream.id">
      <td>
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td>{{ stream.excerpt }}</td>
    </tr>
  </tbody>
</table>
