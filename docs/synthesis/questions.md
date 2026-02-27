---
title: Interview Questions (Generated)
description: All generated interview questions grouped by target person.
---

<script setup>
import { ref, computed } from "vue";
import slugify from "@sindresorhus/slugify";
import { data as storyArcsData } from "./story-arcs.data";
import { formatDateFromYYYYMMDD } from "../.vitepress/shared";

const TARGET_LABELS = {
  kaze: "Kaze",
  biobak: "Biobak",
  badub: "Badub",
  kaze_zeina: "Kaze & Zeina",
};

const INTERVIEW_PAGE = {
  kaze: "/interviews/kaze",
  biobak: "/interviews/biobak",
  badub: "/interviews/badub",
  kaze_zeina: "/interviews/kaze-zeina",
};

const TARGET_ORDER = ["kaze", "biobak", "badub", "kaze_zeina"];

const selectedPerson = ref("all");

const questionsByTarget = computed(() => {
  if (!storyArcsData) return {};
  const grouped = {};
  for (const arc of storyArcsData.arcs) {
    for (const question of arc.interview_questions) {
      if (!grouped[question.target]) grouped[question.target] = [];
      grouped[question.target].push({ ...question, arcTitle: arc.title });
    }
  }
  return grouped;
});

const targets = computed(() =>
  TARGET_ORDER.filter((t) => questionsByTarget.value[t]?.length),
);

const totalQuestions = computed(() =>
  Object.values(questionsByTarget.value).reduce(
    (sum, qs) => sum + qs.length,
    0,
  ),
);

const visibleTargets = computed(() => {
  if (selectedPerson.value === "all") return targets.value;
  return targets.value.filter((t) => t === selectedPerson.value);
});
</script>

# Interview Questions (Generated)

All interview questions extracted from the [Story Arcs](/synthesis/story-arcs) synthesis, grouped by target person for interview prep.

<template v-if="!storyArcsData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate story arcs from stream data.
:::

</template>

<template v-else>

::: tip Summary
**{{ totalQuestions }}** questions across **{{ storyArcsData.arcs.length }}** arcs
· <span v-for="(t, i) in targets" :key="t">{{ TARGET_LABELS[t] }}: {{ questionsByTarget[t].length }}<span v-if="i < targets.length - 1"> · </span></span>
:::

**Filter by person:**

<div class="vp-filter-bar">
  <VPInput id="person" label="Person">
    <select id="person" v-model="selectedPerson">
      <option value="all">All ({{ totalQuestions }})</option>
      <option v-for="target in targets" :key="target" :value="target">
        {{ TARGET_LABELS[target] }} ({{ questionsByTarget[target].length }})
      </option>
    </select>
  </VPInput>
</div>

<div v-for="target in visibleTargets" :key="target">

<h2 :id="target">
  {{ TARGET_LABELS[target] }} ({{ questionsByTarget[target].length }})
</h2>

<p>
  <a :href="INTERVIEW_PAGE[target]">Compare with hand-crafted questions →</a>
</p>

<ol>
  <li
    v-for="(question, i) in questionsByTarget[target]"
    :key="i"
    class="question-item"
  >
    <p class="question-text">{{ question.question }}</p>
    <p class="question-rationale">{{ question.rationale }}</p>
    <p class="question-meta">
      from:
      <a :href="`/synthesis/story-arcs#${slugify(question.arcTitle)}`">{{
        question.arcTitle
      }}</a>
      <span v-if="question.source_streams.length" class="question-sources">
        · 📺
        <span v-for="(date, j) in question.source_streams" :key="date">
          <a :href="`/streams/${date}`">{{ formatDateFromYYYYMMDD(date) }}</a
          ><span v-if="j < question.source_streams.length - 1">, </span>
        </span>
      </span>
    </p>
  </li>
</ol>

</div>

</template>

<style scoped>
.question-item + .question-item {
  border-top: 1px solid var(--vp-c-divider);
}

.question-text {
  font-weight: 500;
}

.question-rationale {
  color: var(--vp-c-text-2);
}

.question-meta {
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}
</style>
