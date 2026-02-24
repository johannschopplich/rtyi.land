---
title: Stream Highlights
description: Milestone and pivotal streams – the most significant moments in RTYI development.
---

<script setup>
import { data as allStreams } from "./model-streams.data";

const pivotalStreams = allStreams.filter((s) => s.significance === "pivotal");
const milestoneStreams = allStreams.filter(
  (s) => s.significance === "milestone",
);
const notableStreams = allStreams.filter((s) => s.significance === "notable");
</script>

# Stream Highlights

The most significant streams for the documentary, filtered from {{ allStreams.length }} total. These are the streams where something important happened – project-defining decisions, breakthroughs, and emotional beats.

[← Back to Dashboard](/streams/index.md)

::: tip Summary
**Pivotal:** {{ pivotalStreams.length }} ·
**Milestone:** {{ milestoneStreams.length }} ·
**Notable:** {{ notableStreams.length }} ·
**Routine (not shown):** {{
  allStreams.length -
  pivotalStreams.length -
  milestoneStreams.length -
  notableStreams.length
}}
:::

<template v-if="pivotalStreams.length">

## 🟠 Pivotal Streams

Project-defining decisions, major emotional moments, or creative breakthroughs.

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Summary</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in pivotalStreams" :key="stream.id">
      <td style="white-space: nowrap;">
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td>{{ stream.excerpt }}</td>
      <td class="reason">{{ stream.significanceReason || "—" }}</td>
    </tr>
  </tbody>
</table>

</template>

## 🟢 Milestone Streams

Major features completed, levels finished, or significant project phases.

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Summary</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in milestoneStreams" :key="stream.id">
      <td style="white-space: nowrap;">
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td>{{ stream.excerpt }}</td>
      <td class="reason">{{ stream.significanceReason || "—" }}</td>
    </tr>
  </tbody>
</table>

<template v-if="notableStreams.length">

## 🔵 Notable Streams

Interesting insights, good quotes, or minor revelations worth exploring.

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Summary</th>
      <th>Why</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="stream in notableStreams" :key="stream.id">
      <td style="white-space: nowrap;">
        <a :href="`/streams/${stream.id}`">{{ stream.date }}</a>
      </td>
      <td>{{ stream.excerpt }}</td>
      <td class="reason">{{ stream.significanceReason || "—" }}</td>
    </tr>
  </tbody>
</table>

</template>

<style scoped>
.reason {
  color: var(--vp-c-text-2);
}
</style>
