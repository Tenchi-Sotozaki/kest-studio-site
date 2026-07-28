<!--
  SNS アイコン。3つとも同じアウトライン形式（stroke 2 / currentColor）で揃えてある。
  TikTok は Feather 等に無いため、他2つの線の重みに合わせて描き起こしたもの。
-->
<template>
  <svg
    :class="`icon-${name}`"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'youtube'">
      <path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"
      />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </template>

    <template v-else-if="name === 'instagram'">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </template>

    <template v-else-if="name === 'tiktok'">
      <path d="M13 4v12a4 4 0 1 1-4-4" />
      <path d="M13 4c0 2.76 2.24 5 5 5" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  /** 'youtube' | 'instagram' | 'tiktok' */
  name: { type: String, required: true }
});
</script>

<style scoped>
svg {
  width: 1.2em;
  height: 1.2em;
  transition: transform 0.3s ease;
}
</style>
