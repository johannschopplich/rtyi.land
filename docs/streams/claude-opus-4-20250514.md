---
title: Claude Opus 4 – Stream Analysis
description: Comprehensive analysis of all streams processed by Claude Opus 4
---

<script setup>
import { data as modelStreams } from './model-streams.data.ts'

const MODEL_NAME = 'claude-opus-4-20250514'
const streams = modelStreams[MODEL_NAME] || []
const modelLabel = 'Claude Opus 4'
</script>

# {{ modelLabel }} – Stream Analysis

This page contains all stream analyses processed by {{ modelLabel }}.

::: tip Summary
**Total Streams:** {{ streams.length }}

**Date Range:** {{ streams[streams.length - 1]?.date }} – {{ streams[0]?.date }}
:::

## All Streams

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
