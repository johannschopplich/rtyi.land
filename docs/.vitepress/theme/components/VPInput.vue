<script setup lang="ts">
defineProps<{
  label: string;
  id?: string;
}>();
</script>

<template>
  <div class="VPInput">
    <label :for="id" class="label">{{ label }}</label>
    <div class="input-wrapper">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.VPInput {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.input-wrapper :deep(select),
.input-wrapper :deep(input) {
  padding: 0 10px;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background-color: var(--vp-input-bg-color, var(--vp-c-bg-alt));
  border: 1px solid var(--vp-input-border-color, var(--vp-c-border));
  border-radius: 8px;
  outline: none;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
}

.input-wrapper :deep(select):hover,
.input-wrapper :deep(input):hover {
  border-color: var(--vp-c-brand-2);
}

.input-wrapper :deep(select):focus,
.input-wrapper :deep(input):focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.input-wrapper :deep(select:disabled),
.input-wrapper :deep(input:disabled) {
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  cursor: not-allowed;
}

.input-wrapper :deep(select:disabled):hover,
.input-wrapper :deep(input:disabled):hover,
.input-wrapper :deep(select:disabled):focus,
.input-wrapper :deep(input:disabled):focus {
  border-color: var(--vp-c-divider);
  box-shadow: none;
}

.input-wrapper :deep(input[type="number"]) {
  width: 70px;
}
</style>
