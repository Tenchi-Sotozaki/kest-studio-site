import { ref, onMounted, onUnmounted } from 'vue';

/** CSS の @media (max-width: 768px) と境界を揃えること */
const DESKTOP_QUERY = '(min-width: 769px)';

/**
 * Shorts セクションの横スクロール制御。
 *
 * PC   : セクションを縦に長く取り、縦スクロール量をトラックの translateX に変換する
 * スマホ: スクロールジャックは指の操作と相性が悪いので無効化し、
 *         ネイティブの横スワイプ（scroll-snap）に任せる
 *
 * @param {import('vue').Ref<HTMLElement|null>} sectionRef 縦に長い外枠
 * @param {import('vue').Ref<HTMLElement|null>} trackRef   横に並ぶトラック
 */
export function useShortsScroll(sectionRef, trackRef) {
  const isScrollJackEnabled = ref(true);
  let mqDesktop = null;

  const applyTransform = () => {
    if (!isScrollJackEnabled.value) return;
    const section = sectionRef.value;
    const track = trackRef.value;
    if (!section || !track) return;

    const rect = section.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;
    if (scrollDistance <= 0) return;

    const sectionTop = rect.top;
    let progress;
    if (sectionTop > 0) {
      progress = 0;
    } else if (sectionTop < -scrollDistance) {
      progress = 1;
    } else {
      progress = Math.abs(sectionTop) / scrollDistance;
    }

    const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
    track.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
  };

  const applyScrollMode = () => {
    isScrollJackEnabled.value = mqDesktop ? mqDesktop.matches : true;

    // スワイプモードへ移る際は、JS が当てた transform を必ず解除しておく
    if (!isScrollJackEnabled.value && trackRef.value) {
      trackRef.value.style.transform = '';
    }
  };

  const handleScrollModeChange = () => {
    applyScrollMode();
    applyTransform();
  };

  onMounted(() => {
    mqDesktop = window.matchMedia(DESKTOP_QUERY);
    applyScrollMode();
    mqDesktop.addEventListener('change', handleScrollModeChange);
  });

  onUnmounted(() => {
    if (mqDesktop) mqDesktop.removeEventListener('change', handleScrollModeChange);
  });

  return { isScrollJackEnabled, applyTransform };
}
