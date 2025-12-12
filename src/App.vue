<template>
  <div>
    <button @click="goToKestStudioLP">KestStudioLPへ</button>

    <!-- 表示切り替えも可能 -->
    <KestStudioLP v-if="showLP" />
  </div>
</template>

<script>
import KestStudioLP from './components/KestStudioLP.vue'

export default {
  components: { KestStudioLP },
  data() {
    return {
      showLP: false
    }
  },
  methods: {
    goToKestStudioLP() {
      this.showLP = true
    }
  }
}
</script>

<style>
/* 最低限のリセット */
#app-root { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Noto Sans JP", Arial; color:#111; padding:24px; }
</style>
