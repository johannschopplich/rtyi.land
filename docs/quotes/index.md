---
title: Memorable Quotes
description: Memorable quotes from development streams.
---

<script setup>
import { ref, computed } from "vue";
import { data as allQuotes } from "./quotes.data";

const selectedSpeaker = ref("all");

const speakers = computed(() => {
  const counts = {};
  for (const quote of allQuotes) {
    counts[quote.speaker] = (counts[quote.speaker] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
});

const filteredQuotes = computed(() => {
  if (selectedSpeaker.value === "all") return allQuotes;
  return allQuotes.filter((quote) => quote.speaker === selectedSpeaker.value);
});
</script>

# Memorable Quotes

Quotes worth remembering – potential narration lines, chapter titles, or trailer moments. Filter by speaker to prep for a specific interview.

::: tip Summary
**Total Quotes:** {{ allQuotes.length }} · **Speakers:** {{ speakers.length }}

See also: [Team Profiles](/team/index.md) for full per-person context.
:::

**Filter by speaker:**

<div style="margin-bottom: 1rem;">
  <select
    v-model="selectedSpeaker"
    style="padding: 4px 8px; border: 1px solid var(--vp-c-border); border-radius: 4px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);"
  >
    <option value="all">All ({{ allQuotes.length }})</option>
    <option
      v-for="speaker in speakers"
      :key="speaker.name"
      :value="speaker.name"
    >
      {{ speaker.name }} ({{ speaker.count }})
    </option>
  </select>
</div>

<p style="color: var(--vp-c-text-2); font-size: 0.85em;">
  Showing {{ filteredQuotes.length }} quotes
</p>

<div v-for="quote in filteredQuotes" :key="quote.streamId + quote.quote.slice(0, 30)" style="margin-bottom: 1.5rem; padding-left: 1rem; border-left: 3px solid var(--vp-c-brand-1);">

<p style="font-style: italic; margin-bottom: 0.25rem;">"{{ quote.quote }}"</p>

<p style="font-size: 0.85em; margin-bottom: 0.25rem;">
  — <strong>{{ quote.speaker }}</strong
  >, <a :href="`/streams/${quote.streamId}`">{{ quote.streamDate }}</a>
</p>

<p
  v-if="quote.context"
  style="color: var(--vp-c-text-2); font-size: 0.85em; margin-top: 0;"
>
  {{ quote.context }}
</p>

</div>
