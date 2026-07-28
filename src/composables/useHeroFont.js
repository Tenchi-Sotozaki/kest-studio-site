import { ref, onMounted, onUnmounted } from 'vue';
import { heroFonts } from '../data/heroFonts.js';

/**
 * ヒーロー見出しの書体をランダムに切り替える演出。
 * 直前と同じ書体は選ばないので、必ず見た目が変わる。
 */
export function useHeroFont(intervalMs = 100) {
  const currentFont = ref(heroFonts[0]);
  let timer = null;

  onMounted(() => {
    let lastIndex = 0;
    timer = setInterval(() => {
      let next;
      do {
        next = Math.floor(Math.random() * heroFonts.length);
      } while (next === lastIndex);

      lastIndex = next;
      currentFont.value = heroFonts[next];
    }, intervalMs);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { currentFont };
}
