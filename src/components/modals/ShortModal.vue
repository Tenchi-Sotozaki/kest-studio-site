<!-- ショート動画（9:16）の全画面再生 -->
<template>
  <BaseModal
    :open="open"
    tone="dark"
    content-class="modal-content--short-video"
    close-btn-class="modal-close-btn--short"
    :aria-label="video?.title"
    @close="$emit('close')"
  >
    <div class="short-video-wrapper">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="`${video?.title ?? ''} を再生`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue';
import BaseModal from '../BaseModal.vue';
import { buildEmbedUrl } from '../../composables/useVideoEmbed.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  video: { type: Object, default: null }
});

defineEmits(['close']);

const embedUrl = computed(() => buildEmbedUrl(props.video));
</script>

<style scoped>
.short-video-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}
.short-video-wrapper iframe {
  width: 100%;
  height: 100%;
}
</style>
