<!--
  モーダルの共通の器。

  各モーダルはこれを包んで中身だけを書く。
  - 背景クリック / ✕ ボタンで close を emit（Escape は useModalStack が窓口）
  - 背景の明暗で ✕ とフォーカスリングの色を切り替える（tone プロパティ）
  - 見た目そのものは style.css の .modal-backdrop / .modal-content に置いてある
-->
<template>
  <Transition name="fade-modal">
    <div
      v-if="open"
      class="modal-backdrop"
      :class="backdropClass"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      @click.self="$emit('close')"
    >
      <div class="modal-content" :class="[`modal-content--${tone}`, contentClass]">
        <button
          class="modal-close-btn"
          :class="closeBtnClass"
          type="button"
          aria-label="閉じる"
          @click="$emit('close')"
        >
          ✕
        </button>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  /** 'light' = ペーパー地 / 'dark' = 黒地。✕ とフォーカスリングの色が変わる */
  tone: { type: String, default: 'light' },
  backdropClass: { type: [String, Array, Object], default: '' },
  contentClass: { type: [String, Array, Object], default: '' },
  /** テストや useModalStack から掴むための識別クラス（例: modal-close-btn--privacy） */
  closeBtnClass: { type: String, default: '' },
  ariaLabel: { type: String, default: undefined },
  ariaLabelledby: { type: String, default: undefined }
});

defineEmits(['close']);
</script>
