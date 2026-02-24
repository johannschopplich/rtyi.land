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
  if (!quotesData) return [];
  return quotesData.quotes.filter((q) => {
    if (selectedUseCase.value !== "all" && q.use_case !== selectedUseCase.value)
      return false;
    if (selectedSpeaker.value !== "all" && q.speaker !== selectedSpeaker.value)
      return false;
    return true;
  });
});

const useCaseCounts = computed(() => {
  if (!quotesData) return {};
  const counts = {};
  for (const quote of quotesData.quotes) {
    counts[quote.use_case] = (counts[quote.use_case] || 0) + 1;
  }
  return counts;
});

const speakers = computed(() => {
  if (!quotesData) return [];
  const counts = {};
  for (const quote of quotesData.quotes) {
    counts[quote.speaker] = (counts[quote.speaker] || 0) + 1;
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

<div class="vp-filter-bar">
  <VPInput id="use-case" label="Use case">
    <select id="use-case" v-model="selectedUseCase">
      <option value="all">All ({{ quotesData.quotes.length }})</option>
      <option v-for="(label, key) in USE_CASE_LABELS" :key="key" :value="key">
        {{ label }} ({{ useCaseCounts[key] || 0 }})
      </option>
    </select>
  </VPInput>
  <VPInput id="speaker" label="Speaker">
    <select id="speaker" v-model="selectedSpeaker">
      <option value="all">All</option>
      <option v-for="s in speakers" :key="s.name" :value="s.name">
        {{ s.name }} ({{ s.count }})
      </option>
    </select>
  </VPInput>
</div>

<p class="vp-muted">Showing {{ quotes.length }} quotes</p>

<div v-for="quote in quotes" :key="quote.stream_date + quote.quote.slice(0, 30)" class="quote-card">

<p class="quote-text">"{{ quote.quote }}"</p>

<p class="quote-attribution">
  — <strong>{{ quote.speaker }}</strong
  >,
  <a :href="`/streams/${quote.stream_date}`">{{
    formatDateFromYYYYMMDD(quote.stream_date)
  }}</a>
</p>

<div class="quote-footer">
  <span class="vp-pill use-case-tag" :class="quote.use_case">{{
    USE_CASE_LABELS[quote.use_case]
  }}</span>
  <span v-if="quote.context" class="quote-context">{{ quote.context }}</span>
</div>

</div>

</template>

<style scoped>
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
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 20px;
}
</style>
