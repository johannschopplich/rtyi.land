<script setup>
import { data as prompts } from "./prompts.data";
</script>

# Prompts

This page contains various prompts and analyses used for research and interview preparation. Each prompt is designed to explore different aspects of the RTYI documentary preparation.

## Available Prompts

**Total Prompts:** {{ prompts.length }}

<div class="prompt-list">
  <div v-for="prompt in prompts" :key="prompt.url" class="prompt-item">
    <h3>
      <a :href="prompt.url">{{ prompt.title }}</a>
    </h3>
    <p v-if="prompt.excerpt" class="prompt-excerpt">
      {{ prompt.excerpt }}
    </p>
  </div>
</div>

<style scoped>
.prompt-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prompt-item {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
}

.prompt-item h3 {
  position: initial;
  margin: 0 0 8px 0;
}

.prompt-item h3 a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.prompt-item h3 a:hover {
  text-decoration: underline;
}

.prompt-item h3 a::after {
  content: "";
  position: absolute;
  inset: 0;
}

.prompt-excerpt {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
}
</style>
