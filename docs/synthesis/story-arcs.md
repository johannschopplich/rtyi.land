---
title: Story Arcs
description: Arc-first narrative stories with embedded interview questions and quotes.
---

<script setup>
import { ref, computed } from "vue";
import { data as storyArcsData } from "./story-arcs.data";
import {
  capitalizeInitialLetter,
  formatDateFromYYYYMMDD,
} from "../.vitepress/shared";

const selectedPerson = ref("all");

const TARGET_LABELS = {
  kaze: "Kaze Emanuar",
  biobak: "Biobak",
  badub: "Badub",
  kaze_zeina: "Kaze & Zeina",
};

const arcs = computed(() => {
  if (!storyArcsData) return [];
  if (selectedPerson.value === "all") return storyArcsData.arcs;
  return storyArcsData.arcs.filter((arc) =>
    arc.related_to.includes(selectedPerson.value),
  );
});

const relatedPeople = computed(() => {
  if (!storyArcsData) return [];
  const people = new Set();
  for (const arc of storyArcsData.arcs) {
    for (const person of arc.related_to) {
      people.add(person);
    }
  }
  return [...people].sort();
});
</script>

# Story Arcs

Arc-first narrative stories synthesized from all development streams. Each arc captures a challenge, the process of working through it, and the outcome – with the best interview questions and supporting quotes attached.

<template v-if="!storyArcsData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate story arcs from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Story Arcs:** {{ storyArcsData.arcs.length }}
:::

**Filter by person:**

<div class="vp-filter-bar">
  <VPInput id="person" label="Person">
    <select id="person" v-model="selectedPerson">
      <option value="all">All ({{ storyArcsData.arcs.length }})</option>
      <option v-for="person in relatedPeople" :key="person" :value="person">
        {{ capitalizeInitialLetter(person) }}
      </option>
    </select>
  </VPInput>
</div>

<p class="vp-muted">Showing {{ arcs.length }} arcs</p>

<div v-for="(arc, index) in arcs" :key="arc.title" class="vp-card">

<h3 class="arc-title">{{ index + 1 }}. {{ arc.title }}</h3>

<p class="arc-summary">{{ arc.summary }}</p>

<p class="arc-value">
  <strong>Why it matters:</strong> {{ arc.narrative_value }}
</p>

<details class="vp-details arc-details">
<summary>Full arc details</summary>

<p><strong>Challenge:</strong> {{ arc.challenge }}</p>
<p><strong>Process:</strong> {{ arc.process }}</p>
<p><strong>Outcome:</strong> {{ arc.outcome }}</p>

</details>

<details v-if="arc.key_quotes.length" class="vp-details quotes-details">
<summary>Key Quotes ({{ arc.key_quotes.length }})</summary>

<div
  v-for="kq in arc.key_quotes"
  :key="kq.quote.slice(0, 30)"
  class="arc-quote"
>
  <blockquote>"{{ kq.quote }}"</blockquote>
  <p class="quote-context" v-if="kq.context">{{ kq.context }}</p>
  <p class="quote-attribution">
    — <strong>{{ kq.speaker }}</strong
    >,
    <a :href="`/streams/${kq.stream_date}`">{{
      formatDateFromYYYYMMDD(kq.stream_date)
    }}</a>
  </p>
</div>

</details>

<details v-if="arc.interview_questions.length" class="vp-details questions-details">
<summary>Interview Questions ({{ arc.interview_questions.length }})</summary>

<div
  v-for="(q, qi) in arc.interview_questions"
  :key="q.question.slice(0, 30)"
  class="arc-question"
>
  <p class="question-text">{{ qi + 1 }}. {{ q.question }}</p>
  <p class="question-target">
    <span class="vp-pill tip">{{ TARGET_LABELS[q.target] }}</span>
  </p>
  <p class="question-context">{{ q.context }}</p>
  <div v-if="q.evidence.length" class="question-evidence">
    <ul>
      <li v-for="(ev, i) in q.evidence" :key="i">{{ ev }}</li>
    </ul>
  </div>
</div>

</details>

<div class="vp-card-meta">
  <span v-if="arc.related_to.length" class="meta-people">
    {{ arc.related_to.map(capitalizeInitialLetter).join(", ") }}
  </span>
  <span v-if="arc.source_streams.length" class="meta-streams">
    {{ arc.source_streams.length }} source stream{{
      arc.source_streams.length !== 1 ? "s" : ""
    }}
  </span>
</div>

</div>

</template>

<style scoped>
.arc-title {
  color: var(--vp-c-brand-1);
}

.arc-summary {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.arc-value {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.arc-details,
.quotes-details,
.questions-details {
  font-size: 14px;
  line-height: 1.6;
}

.arc-quote blockquote {
  font-style: italic;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 16px;
  margin: 8px 0 4px;
  color: var(--vp-c-text-2);
  transition: border-color 0.5s;
}

.quote-context {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 2px 0 4px;
  padding-left: 16px;
  line-height: 1.5;
}

.quote-attribution {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}

.arc-question {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-color 0.5s;
}

.arc-question:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.question-text {
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 6px;
}

.question-target {
  margin-bottom: 6px;
}

.question-context {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 20px;
  margin-bottom: 6px;
}

.question-evidence {
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.question-evidence ul {
  margin: 0;
  padding-left: 20px;
}

.question-evidence li {
  margin-bottom: 2px;
}

.meta-people::before {
  content: "👥 ";
}

.meta-streams::before {
  content: "📺 ";
}
</style>
