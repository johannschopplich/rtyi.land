---
title: Story Highlights
description: Top narrative arcs ranked by documentary potential, synthesized from all streams.
---

<script setup>
import { ref, computed } from "vue";
import { data as storiesData } from "./stories.data";
import {
  capitalizeInitialLetter,
  formatDateFromYYYYMMDD,
} from "../.vitepress/shared";

const selectedPerson = ref("all");

const stories = computed(() => {
  if (!storiesData?.stories) return [];
  if (selectedPerson.value === "all") return storiesData.stories;
  return storiesData.stories.filter((s) =>
    s.related_to.includes(selectedPerson.value),
  );
});

const relatedPeople = computed(() => {
  if (!storiesData?.stories) return [];
  const people = new Set();
  for (const story of storiesData.stories) {
    for (const person of story.related_to) {
      people.add(person);
    }
  }
  return [...people].sort();
});
</script>

# Story Highlights

The strongest narrative arcs across all development streams, ranked by documentary potential. Each story captures a challenge, the process of working through it, and the outcome – ready-made material for documentary segments.

<template v-if="!storiesData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate story highlights from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Top Stories:** {{ storiesData.stories.length }}
:::

**Filter by person:**

<div class="filter-bar">
  <select v-model="selectedPerson" class="filter-select">
    <option value="all">All ({{ storiesData.stories.length }})</option>
    <option v-for="person in relatedPeople" :key="person" :value="person">
      {{ capitalizeInitialLetter(person) }}
    </option>
  </select>
  <span class="filter-count">Showing {{ stories.length }} stories</span>
</div>

<div v-for="(story, index) in stories" :key="index" class="story-card">

<h3 class="story-title">{{ index + 1 }}. {{ story.title }}</h3>

<p class="story-summary">{{ story.summary }}</p>

<p class="story-value">
  <strong>Why it matters:</strong> {{ story.narrative_value }}
</p>

<details class="story-details">
<summary>Full arc details</summary>

<p><strong>Challenge:</strong> {{ story.challenge }}</p>
<p><strong>Process:</strong> {{ story.process }}</p>
<p><strong>Outcome:</strong> {{ story.outcome }}</p>

<blockquote v-if="story.key_quote" class="story-quote">
  {{ story.key_quote }}
</blockquote>

</details>

<div class="story-meta">
  <span v-if="story.related_to?.length" class="meta-people">
    {{ story.related_to.map(capitalizeInitialLetter).join(", ") }}
  </span>
  <span v-if="story.source_streams?.length" class="meta-streams">
    {{ story.source_streams.length }} source stream{{
      story.source_streams.length !== 1 ? "s" : ""
    }}
  </span>
</div>

</div>

</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-select {
  padding: 4px 8px;
  border: 1px solid var(--vp-input-border-color);
  border-radius: 4px;
  background: var(--vp-input-bg-color);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition:
    border-color 0.25s,
    background-color 0.25s;
}

.filter-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.story-card {
  margin-bottom: 24px;
  padding: 16px 16px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: background-color 0.5s;
}

.story-card > :first-child {
  margin-top: 0;
}

.story-card > :last-child {
  margin-bottom: 0;
}

.story-title {
  margin-top: 0;
  color: var(--vp-c-brand-1);
  border: none;
  padding: 0;
}

.story-summary {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.story-value {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.story-details {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.story-details summary {
  cursor: pointer;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin-bottom: 8px;
}

.story-quote {
  font-style: italic;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 16px;
  margin: 12px 0;
  color: var(--vp-c-text-2);
  transition: border-color 0.5s;
}

.story-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.meta-people::before {
  content: "👥 ";
}

.meta-streams::before {
  content: "📺 ";
}
</style>
