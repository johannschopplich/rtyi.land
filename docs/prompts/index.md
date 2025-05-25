<script setup>
import { data as prompts } from "./prompts.data";
</script>

# Prompts

This section contains various prompts and analyses used for research and documentation.

## Available Prompts

**Total Prompts:** {{ prompts.length }}

<div class="prompt-list">
  <div 
    v-for="prompt in prompts" 
    :key="prompt.url"
    class="prompt-item"
  >
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
  gap: 1.5rem;
}

.prompt-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
}

.prompt-item h3 {
  margin: 0 0 8px 0;
  position: initial;
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
  font-size: var(--vp-custom-block-font-size);
  line-height: 24px;
}
</style>
