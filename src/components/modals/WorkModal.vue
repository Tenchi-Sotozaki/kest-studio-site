<!-- 長編作品（16:9）の再生 + クレジット表示 -->
<template>
  <BaseModal
    :open="open"
    tone="dark"
    backdrop-class="modal-backdrop--video"
    content-class="modal-content--modern-video"
    close-btn-class="modal-close-btn--video"
    :aria-label="work?.title"
    @close="$emit('close')"
  >
    <div class="video-wrapper">
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="`${work?.title ?? ''} を再生`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>
    </div>

    <div v-if="work" class="video-credits">
      <div class="video-credits-meta">
        <span class="video-credits-category">{{ work.category }}</span>
        <h3 class="video-credits-title">{{ work.title }}</h3>
      </div>

      <dl v-if="work.credits" class="credits-list">
        <template v-for="(name, role) in work.credits" :key="role">
          <div v-if="name" class="credits-row">
            <dt class="credits-role">{{ role }}</dt>
            <dd class="credits-name">{{ name }}</dd>
          </div>
        </template>
      </dl>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue';
import BaseModal from '../BaseModal.vue';
import { buildEmbedUrl } from '../../composables/useVideoEmbed.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  work: { type: Object, default: null }
});

defineEmits(['close']);

const embedUrl = computed(() => buildEmbedUrl(props.work));
</script>

<style scoped>
.video-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
.video-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
}

.video-credits {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  padding: 36px 48px 40px;
  border-top: 1px solid rgba(247, 244, 239, 0.07);
}

.video-credits-meta { flex-shrink: 0; }

.video-credits-category {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  /* WCAG AA（4.5:1）を満たす濃さ。0.35 では約2.7:1 で不足していた */
  color: rgba(247, 244, 239, 0.5);
  margin-bottom: 10px;
}

.video-credits-title {
  font-family: var(--font-en);
  font-size: 1.7rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #f7f4ef;
  line-height: 1.15;
  margin: 0;
}

.credits-list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px 56px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.credits-row { display: flex; flex-direction: column; gap: 6px; }

.credits-role {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  /* 同上：0.32 → 0.5 でコントラスト比 約5.1:1 */
  color: rgba(247, 244, 239, 0.5);
}

.credits-name {
  font-family: var(--font-en);
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.02em;
  color: rgba(247, 244, 239, 0.82);
  margin: 0;
}

@media (max-width: 768px) {
  .video-credits { flex-direction: column; gap: 28px; padding: 28px 24px 32px; }
  .video-credits-title { font-size: 1.3rem; }
  .credits-list { gap: 20px 36px; }
}
</style>
