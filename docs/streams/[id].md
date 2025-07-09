<script setup>
import { useData } from "vitepress";

const { params } = useData();
const { streamData } = params.value;

function formatMemberName(person) {
  return person.charAt(0).toUpperCase() + person.slice(1);
}
</script>

# Development Stream Analysis

::: tip Summary
**Date:** {{ params.date }}

**Model:** {{ params.model }}

**Level(s):** {{ streamData.stream_context?.level?.join(", ") || "Unknown" }}
:::

## Stream Context

{{ streamData.stream_context?.summary || "No summary available." }}

## Development Findings

<ul v-if="streamData.development_findings?.length">
  <li
    v-for="(finding, index) in streamData.development_findings"
    :key="index"
  >
    <p>{{ finding.summary }}</p>
    <blockquote v-if="finding.quote">{{ finding.quote }}</blockquote>
  </li>
</ul>
<div v-else>
  <p>No development findings available.</p>
</div>

## Context Findings

<ul>
  <li v-for="(finding, index) in streamData.context_findings" :key="index">
    <p>{{ finding.summary }}</p>
    <blockquote v-if="finding.quote">{{ finding.quote }}</blockquote>
  </li>
</ul>

## Contributor Findings

<template
  v-for="(findings, member) in streamData.contributor_findings"
  :key="member"
>
  <template v-if="findings.length > 0">
    <h3>{{ formatMemberName(member) }}</h3>
    <ul>
      <li v-for="(finding, index) in findings" :key="index">
        <p>{{ finding.summary }}</p>
        <blockquote v-if="finding.quote">{{ finding.quote }}</blockquote>
      </li>
    </ul>
  </template>
</template>

## Key Stories

<template v-for="(story, index) in streamData.key_stories" :key="index">

::: info {{ story.title }}

<p><strong>Summary:</strong> {{ story.summary }}</p>
<p><strong>Challenge:</strong> {{ story.challenge }}</p>
<p><strong>Process:</strong> {{ story.process }}</p>
<p><strong>Outcome:</strong> {{ story.outcome }}</p>
<p v-if="story.key_quote"><strong>Key Quote:</strong></p>
<blockquote v-if="story.key_quote">{{ story.key_quote }}</blockquote>
<p v-if="story.related_to?.length">
  <strong>Related to:</strong>
  {{ story.related_to.map(formatMemberName).join(", ") }}
</p>

:::

</template>

## Open Questions

<template v-for="(item, member) in streamData.open_questions" :key="member">
  <h3>{{ item.topic }}</h3>
  <p><strong>Context:</strong> {{ item.context }}</p>
  <p>
    <strong>Relevant to:</strong>
    {{ item.related_to.map(formatMemberName).join(", ") }}
  </p>
  <p><strong>Questions:</strong></p>
  <ul>
    <li v-for="(question, index) in item.questions" :key="index">
      {{ question }}
    </li>
  </ul>
</template>
