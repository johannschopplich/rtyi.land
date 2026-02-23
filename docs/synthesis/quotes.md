---
title: Curated Quotes
description: Top documentary quotes tagged by use case, synthesized from all streams.
---

<script setup>
import { ref, computed } from "vue";
import { data as quotesData } from "./quotes.data";
import { formatDateFromYYYYMMDD } from "../.vitepress/shared";

const selectedUseCase = ref("all");
const selectedSpeaker = ref("all");

const USE_CASE_LABELS = {
  narration: "🎬 Narration",
  trailer: "🎞️ Trailer",
  "chapter-title": "📖 Chapter Title",
  "character-moment": "🎭 Character Moment",
  "emotional-beat": "💔 Emotional Beat",
};

const quotes = computed(() => {
  if (!quotesData?.quotes) return [];
  return quotesData.quotes.filter((q) => {
    if (selectedUseCase.value !== "all" && q.use_case !== selectedUseCase.value)
      return false;
    if (selectedSpeaker.value !== "all" && q.speaker !== selectedSpeaker.value)
      return false;
    return true;
  });
});

const useCaseCounts = computed(() => {
  if (!quotesData?.quotes) return {};
  const counts = {};
  for (const q of quotesData.quotes) {
    counts[q.use_case] = (counts[q.use_case] || 0) + 1;
  }
  return counts;
});

const speakers = computed(() => {
  if (!quotesData?.quotes) return [];
  const counts = {};
  for (const q of quotesData.quotes) {
    counts[q.speaker] = (counts[q.speaker] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
});
</script>

# Curated Quotes

The strongest quotes across all streams, selected for documentary impact. Each quote is tagged with its best use case – narration, trailer, chapter title, character moment, or emotional beat.

For the full unfiltered collection, see [All Quotes](/quotes/).

<template v-if="!quotesData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate curated quotes from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Curated Quotes:** {{ quotesData.quotes.length }} ·
**Speakers:** {{ speakers.length }}
:::

<div class="filter-row">
  <div>
    <label class="filter-label">Use case:</label>
    <select v-model="selectedUseCase" class="filter-select">
      <option value="all">All ({{ quotesData.quotes.length }})</option>
      <option v-for="(label, key) in USE_CASE_LABELS" :key="key" :value="key">
        {{ label }} ({{ useCaseCounts[key] || 0 }})
      </option>
    </select>
  </div>
  <div>
    <label class="filter-label">Speaker:</label>
    <select v-model="selectedSpeaker" class="filter-select">
      <option value="all">All</option>
      <option v-for="s in speakers" :key="s.name" :value="s.name">
        {{ s.name }} ({{ s.count }})
      </option>
    </select>
  </div>
</div>

<p class="result-count">Showing {{ quotes.length }} quotes</p>

<div v-for="(quote, index) in quotes" :key="index" class="quote-card">

<p class="quote-text">"{{ quote.quote }}"</p>

<p class="quote-attribution">
  — <strong>{{ quote.speaker }}</strong
  >,
  <a :href="`/streams/${quote.stream_date}`">{{
    formatDateFromYYYYMMDD(quote.stream_date)
  }}</a>
</p>

<div class="quote-footer">
  <span class="use-case-tag" :class="quote.use_case">{{
    USE_CASE_LABELS[quote.use_case] || quote.use_case
  }}</span>
  <span v-if="quote.context" class="quote-context">{{ quote.context }}</span>
</div>

</div>

</template>

<style scoped>
.filter-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-right: 6px;
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

.result-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 20px;
}

.quote-card {
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 2px solid var(--vp-c-brand-1);
  transition: border-color 0.5s;
}

.quote-text {
  font-style: italic;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.quote-attribution {
  font-size: 14px;
  margin-bottom: 8px;
}

.quote-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.use-case-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.use-case-tag.narration {
  border-color: var(--vp-c-indigo-1);
  color: var(--vp-c-indigo-1);
}
.use-case-tag.trailer {
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}
.use-case-tag.chapter-title {
  border-color: var(--vp-c-purple-1);
  color: var(--vp-c-purple-1);
}
.use-case-tag.character-moment {
  border-color: var(--vp-c-warning-1);
  color: var(--vp-c-warning-1);
}
.use-case-tag.emotional-beat {
  border-color: var(--vp-c-sponsor);
  color: var(--vp-c-sponsor);
}

.quote-context {
  color: var(--vp-c-text-3);
  font-size: 13px;
}
</style>
