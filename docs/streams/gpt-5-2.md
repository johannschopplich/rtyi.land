---
title: GPT-5.2 – Stream Analysis
description: Comprehensive analysis of all streams processed by GPT-5.2.
---

<script setup>
import { data as modelStreams } from "./model-streams.data.ts";
import { STREAM_ANALYSIS_DIR } from "../../src/constants";

const streams = modelStreams[STREAM_ANALYSIS_DIR] ?? [];
</script>

# GPT-5.2 – Stream Analysis

This page presents a systematic analysis of [Kaze's development streams](https://www.youtube.com/@KazeClips/streams) processed by OpenAI's **GPT-5.2** model after they were transcribed with Whisper.

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
