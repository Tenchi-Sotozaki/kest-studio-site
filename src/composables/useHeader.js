import { ref, onUnmounted } from 'vue';

/**
 * ヘッダーの状態管理。
 *
 * - 50px 以上スクロールしたら縮小状態にする
 * - 実際のヘッダー高さを CSS 変数 --kest-header-h に流す
 *   （Shorts セクションの高さ計算がこの値に依存している）
 */
export function useHeader() {
  const isScrolled = ref(false);
  let raf = 0;

  const updateHeaderHeightVar = () => {
    const el = document.querySelector('.header');
    const h = el?.getBoundingClientRect().height;
    if (!h) return;
    document.documentElement.style.setProperty('--kest-header-h', `${Math.round(h)}px`);
  };

  /** スクロールのたびに走るので、高さ計測は rAF に逃がす */
  const update = () => {
    isScrolled.value = window.scrollY > 50;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateHeaderHeightVar);
  };

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf);
  });

  return { isScrolled, update, updateHeaderHeightVar };
}
