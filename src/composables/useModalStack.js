import { ref, computed, nextTick } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * 重ねて開けるモーダルのスタック管理。
 *
 * - どのモーダルが開いているかを名前で管理する
 * - 開いた要素を覚えておき、閉じたらそこへフォーカスを戻す
 * - Tab / Shift+Tab を最前面のモーダル内で循環させる
 * - Escape は最前面のものから 1 枚ずつ閉じる
 *
 * 最前面の判定は DOM 順（.modal-backdrop の最後）で行うため、
 * テンプレート側では「後に開きうるモーダルほど後ろに置く」こと。
 */
export function useModalStack() {
  const openModals = ref([]);
  const focusReturnStack = [];

  const isOpen = (name) => openModals.value.includes(name);
  const isAnyOpen = computed(() => openModals.value.length > 0);
  /** Escape で閉じる対象＝最後に開いたもの */
  const topModal = computed(() => openModals.value[openModals.value.length - 1] ?? null);

  const lockScroll = () => { document.body.style.overflow = 'hidden'; };
  const releaseScrollIfLast = () => {
    document.body.style.overflow = openModals.value.length ? 'hidden' : '';
  };

  /**
   * @param {string} name モーダル識別子
   * @param {Event} [event] 呼び出し元のイベント（フォーカス復帰先の特定に使う）
   * @param {string} [focusSelector] 開いた直後にフォーカスする要素のセレクタ
   */
  const open = (name, event, focusSelector) => {
    if (isOpen(name)) return;
    openModals.value = [...openModals.value, name];
    focusReturnStack.push(event?.currentTarget ?? null);
    lockScroll();

    nextTick(() => {
      const target = focusSelector ? document.querySelector(focusSelector) : null;
      if (target) target.focus();
    });
  };

  const close = (name) => {
    if (!isOpen(name)) return;
    openModals.value = openModals.value.filter((n) => n !== name);
    const returnTo = focusReturnStack.pop();

    nextTick(() => {
      releaseScrollIfLast();
      if (returnTo && document.contains(returnTo)) returnTo.focus();
    });
  };

  const closeTop = () => {
    if (topModal.value) close(topModal.value);
  };

  /** モーダル内でフォーカス可能な要素を、表示中のものに絞って取得する */
  const getFocusableIn = (root) => {
    const all = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR));
    const visible = all.filter((el) => {
      if (el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
      // checkVisibility 非対応の環境では絞り込まない（トラップが無効化されるのを防ぐ）
      return typeof el.checkVisibility === 'function' ? el.checkVisibility() : true;
    });
    return visible.length ? visible : all;
  };

  /** DOM 上いちばん後ろ＝最前面のモーダル要素 */
  const getTopModalEl = () => {
    const modals = document.querySelectorAll('.modal-backdrop');
    return modals.length ? modals[modals.length - 1] : null;
  };

  const trapFocus = (e) => {
    const modal = getTopModalEl();
    if (!modal) return;

    const items = getFocusableIn(modal);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const isOutside = !modal.contains(active);

    if (e.shiftKey && (active === first || isOutside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || isOutside)) {
      e.preventDefault();
      first.focus();
    }
  };

  /** window の keydown に直接つなぐハンドラ */
  const handleKeydown = (e) => {
    if (!isAnyOpen.value) return;

    if (e.key === 'Escape') {
      closeTop();
      return;
    }
    if (e.key === 'Tab') {
      trapFocus(e);
    }
  };

  /** アンマウント時などにスクロールロックが残らないようにする */
  const releaseScroll = () => { document.body.style.overflow = ''; };

  return { openModals, isOpen, isAnyOpen, topModal, open, close, closeTop, handleKeydown, releaseScroll };
}
