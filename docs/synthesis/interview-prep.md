---
title: Interview Prep
description: Curated interview questions per team member, synthesized from 205 stream analyses.
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
  const questions = questionsData[selectedMember.value];
  return [...questions].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
});

const priorityCounts = computed(() => {
  const counts = { essential: 0, important: 0, "nice-to-have": 0 };
  for (const question of currentQuestions.value) {
    counts[question.priority]++;
  }
  return counts;
});

const totalQuestions = computed(() => {
  if (!questionsData) return 0;
  return Object.values(questionsData).reduce(
    (sum, questions) => sum + questions.length,
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

<VPInput label="Interviewee">
  <div class="vp-tab-group">
    <button
      v-for="member in members"
      :key="member.key"
      :class="['vp-tab', { active: selectedMember === member.key }]"
      @click="selectedMember = member.key"
    >
      {{ member.label }}
    </button>
  </div>
</VPInput>

<p class="member-role">
  {{ members.find((m) => m.key === selectedMember)?.role }}
</p>

<p class="question-stats">
  <strong>{{ currentQuestions.length }} questions</strong> ·
  {{ priorityCounts.essential }} essential ·
  {{ priorityCounts.important }} important ·
  {{ priorityCounts["nice-to-have"] }} nice to have
</p>

<div v-for="(question, index) in currentQuestions" :key="question.question" class="vp-card question-card">

<p class="question-header">
  <span class="question-number">{{ index + 1 }}.</span>
  <span class="vp-pill priority-badge" :class="question.priority">{{
    PRIORITY_BADGES[question.priority]
  }}</span>
</p>

<p class="question-text">{{ question.question }}</p>

<p class="question-context">{{ question.context }}</p>

<div v-if="question.evidence.length" class="question-evidence">
  <p class="evidence-label">Stream evidence:</p>
  <ul>
    <li v-for="(ev, i) in question.evidence" :key="i">{{ ev }}</li>
  </ul>
</div>

</div>

</template>

<style scoped>
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

.priority-badge.essential {
  border-color: var(--vp-badge-danger-border);
  color: var(--vp-badge-danger-text);
  background-color: var(--vp-badge-danger-bg);
}

.priority-badge.important {
  border-color: var(--vp-badge-warning-border);
  color: var(--vp-badge-warning-text);
  background-color: var(--vp-badge-warning-bg);
}

.priority-badge.nice-to-have {
  border-color: var(--vp-badge-info-border);
  color: var(--vp-badge-info-text);
  background-color: var(--vp-badge-info-bg);
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
  line-height: 24px;
  margin-bottom: 8px;
}

.question-evidence {
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
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
