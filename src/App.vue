<template>
  <div>
    <button @click="showComponent = !showComponent">
      {{ showComponent ? '戻る' : 'KestStudioLPを表示' }}
    </button>

    <!-- 条件付きでコンポーネント表示 -->
    <KestStudioLP v-if="showComponent" />
  </div>
</template>

<script>
import KestStudioLP from './components/KestStudioLP.vue'

export default {
  components: { KestStudioLP },
  data() {
    return {
      showComponent: false
    }
  }
}
</script>

<style>
/* 最低限のリセット */
#app-root { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Noto Sans JP", Arial; color:#111; padding:24px; }
</style>
