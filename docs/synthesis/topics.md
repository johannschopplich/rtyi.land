---
title: Topic Narratives
description: Narrative summaries per topic with key findings.
---

<script setup>
import { data as topicArcsData } from "./topics.data";
import { formatTopicLabel, formatDateFromYYYYMMDD } from "../.vitepress/shared";

const arcs = topicArcsData?.arcs ?? [];

function splitParagraphs(text) {
  return text.split(/\n{2,}/).filter(Boolean);
}
</script>

# Topic Narratives

Each documentary topic summarized as a narrative arc – how it evolved across 3+ years of development streams. Includes key findings for quick reference.

For the full per-stream findings drill-down, see [Raw Findings by Topic](/topics/).

<template v-if="!topicArcsData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate topic narratives from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Topics:** {{ arcs.length }} · Each with narrative summary, key themes, and top findings.
:::

<div v-for="arc in arcs" :key="arc.topic" class="vp-card">

<h2 :id="arc.topic">{{ formatTopicLabel(arc.topic) }}</h2>

<div class="vp-tags">
  <span v-for="theme in arc.key_themes" :key="theme" class="vp-pill tip">{{
    theme
  }}</span>
</div>

<p v-for="(paragraph, i) in splitParagraphs(arc.narrative_summary)" :key="i">
  {{ paragraph }}
</p>

<details class="vp-details">
<summary>Top Findings ({{ arc.top_findings.length }})</summary>

<table>
  <thead>
    <tr>
      <th></th>
      <th>Finding</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(finding, i) in arc.top_findings" :key="i">
      <td>
        <span :class="['importance-dot', finding.importance]"></span>
      </td>
      <td>{{ finding.summary }}</td>
      <td style="white-space: nowrap;">
        <a :href="`/streams/${finding.stream_date}`">{{
          formatDateFromYYYYMMDD(finding.stream_date)
        }}</a>
      </td>
    </tr>
  </tbody>
</table>

</details>

<p>
  <a :href="`/topics/${arc.topic}`">View all raw findings →</a>
</p>

</div>

</template>

<style scoped>
.importance-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.importance-dot.high {
  background: var(--vp-c-danger-1);
}

.importance-dot.medium {
  background: var(--vp-c-warning-1);
}
</style>
