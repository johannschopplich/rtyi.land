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

<div class="quote-filter">
  <select v-model="selectedSpeaker" class="quote-select">
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

<p class="quote-count">Showing {{ filteredQuotes.length }} quotes</p>

<div v-for="quote in filteredQuotes" :key="quote.streamId + quote.quote.slice(0, 30)" class="quote-card">

<p class="quote-text">"{{ quote.quote }}"</p>

<p class="quote-attribution">
  — <strong>{{ quote.speaker }}</strong
  >,
  <a :href="`/streams/${quote.streamId}`">{{ quote.streamDate }}</a>
</p>

<p v-if="quote.context" class="quote-context">
  {{ quote.context }}
</p>

</div>

<style scoped>
.quote-filter {
  margin-bottom: 16px;
}

.quote-select {
  padding: 4px 8px;
  border: 1px solid var(--vp-input-border-color);
  border-radius: 4px;
  background: var(--vp-input-bg-color);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 24px;
}

.quote-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 24px;
}

.quote-card {
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 2px solid var(--vp-c-brand-1);
}

.quote-text {
  font-style: italic;
  margin-bottom: 8px;
}

.quote-attribution {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
}

.quote-context {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 20px;
  margin-top: 0;
}
</style>
