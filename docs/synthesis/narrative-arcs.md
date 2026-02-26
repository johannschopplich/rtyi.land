---
title: Narrative Arcs
description: Thematic filming roadmap – the documentary's high-level structure.
---

<script setup>
import { data as narrativeArcsData } from "./narrative-arcs.data";
import { capitalizeInitialLetter } from "../.vitepress/shared";

const arcs = narrativeArcsData?.arcs ?? [];
</script>

# Narrative Arcs

A thematic filming roadmap synthesized from all development streams. Each arc represents a major documentary thread – with narrative goals, specific topics to explore on camera, and B-roll suggestions to make each thread cinematic.

<template v-if="!narrativeArcsData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate narrative arcs from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Narrative Arcs:** {{ arcs.length }} · Together these form the documentary's filming structure.
:::

<div v-for="(arc, index) in arcs" :key="arc.title" class="narrative-arc">

<h2 :id="arc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')">{{ index + 1 }}. {{ arc.title }}</h2>

<div v-if="arc.team_members.length" class="team-tags">
  <span
    v-for="member in arc.team_members"
    :key="member"
    class="vp-pill team-tag"
  >{{ capitalizeInitialLetter(member) }}</span>
</div>

<div class="narrative-goal">
  <strong>Narrative Goal:</strong> {{ arc.narrative_goal }}
</div>

<details class="vp-details topics-details">
<summary>Topics to Cover ({{ arc.topics_to_cover.length }})</summary>

<ul class="topics-list">
  <li v-for="topic in arc.topics_to_cover" :key="topic">{{ topic }}</li>
</ul>

</details>

<details class="vp-details broll-details">
<summary>B-Roll Suggestions ({{ arc.b_roll.length }})</summary>

<ul class="broll-list">
  <li v-for="item in arc.b_roll" :key="item">{{ item }}</li>
</ul>

</details>

</div>

</template>

<style scoped>
.narrative-arc {
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-color 0.5s;
}

.narrative-arc:last-child {
  border-bottom: none;
}

.team-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.team-tag {
  border-color: var(--vp-badge-tip-border);
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.narrative-goal {
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.topics-details,
.broll-details {
  margin-bottom: 12px;
}

.topics-list,
.broll-list {
  font-size: 14px;
  line-height: 1.7;
  padding-left: 20px;
}

.topics-list li,
.broll-list li {
  margin-bottom: 4px;
}
</style>
