<!-- Shorts 一覧の 1 枚。サムネイル + タイトル + カテゴリ -->
<template>
  <article class="short-card-wrapper">
    <div class="short-card-inner">
      <div
        class="short-thumb"
        role="button"
        tabindex="0"
        :aria-label="`${video.title}を全画面で再生する`"
        @click="$emit('select', video, $event)"
        @keydown.enter.prevent="$emit('select', video, $event)"
        @keydown.space.prevent="$emit('select', video, $event)"
      >
        <img v-if="thumbnail" :src="thumbnail" class="real-video" alt="" loading="lazy" />
        <div v-else class="short-dummy-bg"></div>

        <div class="card-overlay">
          <div class="play-button">
            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="short-info">
        <h3>{{ video.title }}</h3>
        <span class="category">{{ video.category }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { buildThumbnailUrl } from '../composables/useVideoEmbed.js';

const props = defineProps({
  video: { type: Object, required: true }
});

defineEmits(['select']);

const thumbnail = computed(() => buildThumbnailUrl(props.video));
</script>

<style scoped>
.short-card-wrapper {
  width: var(--short-card-w, 260px);
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
}

.short-card-inner { width: 100%; }

.short-thumb {
  position: relative;
  aspect-ratio: 9 / 16;
  border-radius: 18px;
  overflow: hidden;
  background-color: transparent;
  border: 1px solid rgba(12, 12, 12, 0.06);
  box-shadow: 0 30px 100px rgba(12, 12, 12, 0.14);
  /*
    浮き上がるのはサムネイルだけ。カード全体を動かすと下のタイトルまで
    つられて上がり、隣のカードと行が揃わなくなる（＝ホバーで崩れて見える）。
  */
  transition:
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.short-card-wrapper:hover .short-thumb,
.short-thumb:focus-visible {
  transform: translateY(-10px);
  box-shadow: 0 40px 120px rgba(12, 12, 12, 0.28);
}

.short-dummy-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
}

/* YouTube の hqdefault は 16:9 なので、9:16 の枠に合わせて拡大して上下の黒帯を逃がす */
.real-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  transform: scale(1.35);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(12, 12, 12, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.short-card-wrapper:hover .card-overlay,
.short-thumb:focus-visible .card-overlay {
  opacity: 1;
}

.play-button {
  width: 62px;
  height: 62px;
  background: rgba(247, 244, 239, 0.92);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0c0c0c;
  transform: scale(0.86);
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}
.short-card-wrapper:hover .play-button,
.short-thumb:focus-visible .play-button {
  transform: scale(1);
}
.play-icon { width: 24px; height: 24px; margin-left: 4px; }

.short-info {
  margin-top: 18px;
  text-align: center;
}
.short-info h3 {
  font-family: var(--font-en);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-ink);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
  /*
    タイトルは常に2行分の高さを確保する。1行のカードと2行のカードが
    混在してもカテゴリの位置が揃い、行が崩れない。
  */
  min-height: 2.7em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.short-info .category {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  color: var(--color-ink-muted);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .short-card-wrapper { scroll-snap-align: center; }
  /* タップ端末では hover の浮き上がりが残るので無効化 */
  .short-card-wrapper:hover .short-thumb {
    transform: none;
    box-shadow: 0 30px 100px rgba(12, 12, 12, 0.14);
  }
  .short-info { margin-top: 14px; }
  .short-info h3 { font-size: 1.1rem; }
}
</style>
