---
title: Interview Prep
description: Curated interview questions per team member, synthesized from 152 stream analyses.
---

<script setup>
import { ref, computed } from "vue";
import { data as questionsData } from "./interview-questions.data";

const selectedMember = ref("kaze");

const members = [
  {
    key: "kaze",
    label: "Kaze Emanuar",
    role: "Lead Developer & Project Creator",
  },
  { key: "biobak", label: "Biobak", role: "Graphics Artist & Level Designer" },
  { key: "badub", label: "Badub", role: "Composer & Audio Engineer" },
  {
    key: "kaze_zeina",
    label: "Kaze & Zeina",
    role: "Joint Interview – Creative & Personal Partnership",
  },
];

const PRIORITY_BADGES = {
  essential: "🔴 Essential",
  important: "🟡 Important",
  "nice-to-have": "🟢 Nice to Have",
};

const PRIORITY_ORDER = { essential: 0, important: 1, "nice-to-have": 2 };

const currentQuestions = computed(() => {
  if (!questionsData) return [];
  const questions = questionsData[selectedMember.value] ?? [];
  return [...questions].sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3),
  );
});

const priorityCounts = computed(() => {
  const counts = { essential: 0, important: 0, "nice-to-have": 0 };
  for (const q of currentQuestions.value) {
    counts[q.priority] = (counts[q.priority] || 0) + 1;
  }
  return counts;
});

const totalQuestions = computed(() => {
  if (!questionsData) return 0;
  return Object.values(questionsData).reduce(
    (sum, questions) => sum + (questions?.length ?? 0),
    0,
  );
});
</script>

# Interview Prep

Curated interview questions synthesized from all stream analyses. Each question includes context on why it matters and specific stream evidence to reference. Prioritized for 1–2 hour interviews.

See also: [Hand-crafted Interview Questions](/interviews/) for your manually prepared questions.

<template v-if="!questionsData">

::: warning Synthesis data not available
Run `pnpm stream-synthesis` to generate interview questions from stream data.
:::

</template>

<template v-else>

::: tip Summary
**Total Questions:** {{ totalQuestions }} across {{ members.length }} interview sessions
:::

**Select interviewee:**

<div class="member-tabs">
  <button
    v-for="member in members"
    :key="member.key"
    :class="['member-tab', { active: selectedMember === member.key }]"
    @click="selectedMember = member.key"
  >
    {{ member.label }}
  </button>
</div>

<p class="member-role">
  {{ members.find((m) => m.key === selectedMember)?.role }}
</p>

<p class="question-stats">
  <strong>{{ currentQuestions.length }} questions</strong> ·
  {{ priorityCounts.essential }} essential ·
  {{ priorityCounts.important }} important ·
  {{ priorityCounts["nice-to-have"] }} nice to have
</p>

<div v-for="(question, index) in currentQuestions" :key="index" class="question-card">

<p class="question-header">
  <span class="question-number">{{ index + 1 }}.</span>
  <span class="priority-badge" :class="question.priority">{{
    PRIORITY_BADGES[question.priority]
  }}</span>
</p>

<p class="question-text">{{ question.question }}</p>

<p class="question-context">{{ question.context }}</p>

<div v-if="question.evidence?.length" class="question-evidence">
  <p class="evidence-label">Stream evidence:</p>
  <ul>
    <li v-for="(ev, i) in question.evidence" :key="i">{{ ev }}</li>
  </ul>
</div>

</div>

</template>

<style scoped>
.member-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.member-tab {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 14px;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
}

.member-tab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.member-tab.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.member-role {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 4px;
}

.question-stats {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 24px;
}

.question-card {
  margin-bottom: 24px;
  padding: 16px 16px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.question-card > :first-child {
  margin-top: 0;
}

.question-card > :last-child {
  margin-bottom: 0;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.question-number {
  font-weight: 700;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.priority-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.priority-badge.essential {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}

.priority-badge.important {
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-1);
}

.priority-badge.nice-to-have {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success-1);
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 8px;
}

.question-context {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.question-evidence {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.evidence-label {
  font-weight: 600;
  margin-bottom: 4px;
}

.question-evidence ul {
  margin: 0;
  padding-left: 20px;
}

.question-evidence li {
  margin-bottom: 2px;
}
</style>
