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

<h3>{{ index + 1 }}. {{ arc.title }}</h3>

<p>{{ arc.summary }}</p>

<p><strong>Why it matters:</strong> {{ arc.narrative_value }}</p>

<details class="vp-details">
<summary>Full arc details</summary>

<p><strong>Challenge:</strong> {{ arc.challenge }}</p>
<p><strong>Process:</strong> {{ arc.process }}</p>
<p><strong>Outcome:</strong> {{ arc.outcome }}</p>

</details>

<details v-if="arc.key_quotes.length" class="vp-details">
<summary>Key Quotes ({{ arc.key_quotes.length }})</summary>

<div
  v-for="kq in arc.key_quotes"
  :key="kq.quote.slice(0, 30)"
  class="arc-quote"
>
  <blockquote>
    "{{ kq.quote }}"
    <footer v-if="kq.context" class="quote-context">{{ kq.context }}</footer>
  </blockquote>
  <p class="quote-attribution">
    — <strong>{{ kq.speaker }}</strong
    >,
    <a :href="`/streams/${kq.stream_date}`">{{
      formatDateFromYYYYMMDD(kq.stream_date)
    }}</a>
  </p>
</div>

</details>

<details v-if="arc.interview_questions.length" class="vp-details">
<summary>Interview Questions ({{ arc.interview_questions.length }})</summary>

<ol>
  <li
    v-for="question in arc.interview_questions"
    :key="question.question.slice(0, 30)"
  >
    <p class="question-text">
      {{ question.question }}
      <span class="question-target"
        >— {{ TARGET_LABELS[question.target] }}</span
      >
    </p>
    <p class="question-context">{{ question.context }}</p>
    <ul v-if="question.evidence.length" class="question-notes">
      <li v-for="(ev, i) in question.evidence" :key="i">{{ ev }}</li>
    </ul>
  </li>
</ol>

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
.arc-quote blockquote {
  font-style: italic;
  border-left: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.quote-context {
  font-style: normal;
  color: var(--vp-c-text-2);
}

.quote-attribution {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: -8px;
}

.question-text {
  font-weight: 500;
  margin-bottom: 4px;
}

.question-target {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.question-context {
  color: var(--vp-c-text-2);
}

.question-notes {
  color: var(--vp-c-text-2);
}

.meta-people::before {
  content: "👥 ";
}

.meta-streams::before {
  content: "📺 ";
}
</style>
