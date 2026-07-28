<!-- プライバシーポリシー。ルーターを入れていないためモーダルで提供する -->
<template>
  <BaseModal
    :open="open"
    tone="light"
    content-class="modal-content--privacy"
    close-btn-class="modal-close-btn--privacy"
    aria-labelledby="privacy-title"
    @close="$emit('close')"
  >
    <div class="modal-body legal-body">
        <h3 id="privacy-title">プライバシーポリシー</h3>
        <p class="legal-lead">
          Kest Studio（以下「当スタジオ」といいます）は、本ウェブサイトを通じて取得する個人情報の取り扱いについて、
          以下のとおり方針を定めます。
        </p>

        <section class="legal-section">
          <h4>1. 事業者情報</h4>
          <dl class="legal-dl">
            <div><dt>名称</dt><dd>Kest Studio</dd></div>
            <div><dt>所在地</dt><dd>北海道函館市</dd></div>
            <div><dt>運営責任者</dt><dd>外崎 天智</dd></div>
            <div><dt>連絡先</dt><dd>keststudiohkd@gmail.com ／ 090-6440-9072</dd></div>
          </dl>
        </section>

        <section class="legal-section">
          <h4>2. 取得する情報</h4>
          <p>お問い合わせフォームの送信時に、以下の情報を取得します。</p>
          <ul>
            <li>お名前</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容に記載された情報</li>
          </ul>
          <p>
            このほか、サイトの利用状況に応じて、IPアドレス・ブラウザの種類・アクセス日時などの
            技術的な情報が自動的に記録される場合があります。
          </p>
        </section>

        <section class="legal-section">
          <h4>3. 利用目的</h4>
          <p>取得した情報は、次の目的の範囲でのみ利用します。</p>
          <ul>
            <li>お問い合わせへの回答およびご連絡</li>
            <li>お見積り、ご提案、映像制作に関する打ち合わせ</li>
            <li>本ウェブサイトの品質改善および不具合対応</li>
          </ul>
          <p>上記の目的を超えて利用する場合は、あらためてご本人の同意をいただきます。</p>
        </section>

        <section class="legal-section">
          <h4>4. 第三者への提供</h4>
          <p>
            取得した個人情報を、ご本人の同意なく第三者へ提供・販売することはありません。
            ただし、法令に基づく開示請求があった場合はこの限りではありません。
          </p>
        </section>

        <section class="legal-section">
          <h4>5. 外部サービスの利用</h4>
          <p>
            本ウェブサイトでは、機能提供のために以下の外部サービスを利用しています。
            これらのサービスの提供事業者に対し、通信の性質上、IPアドレス等の情報が送信される場合があります。
          </p>
          <ul>
            <li><strong>Netlify</strong> — サイトのホスティングおよびお問い合わせフォームの受信</li>
            <li><strong>YouTube / Vimeo</strong> — 作品動画の埋め込み再生（YouTube はプライバシー強化モードで配信）</li>
            <li><strong>Google Fonts</strong> — ウェブフォントの配信</li>
          </ul>
          <p>各サービスにおける情報の取り扱いは、それぞれの提供事業者が定める方針に従います。</p>
        </section>

        <section class="legal-section">
          <h4>6. Cookie について</h4>
          <p>
            当スタジオは、広告配信や個人を特定する目的で Cookie を使用していません。
            埋め込み動画などの外部サービスが Cookie を利用する場合がありますが、
            ブラウザの設定によって無効化できます。無効化した場合、一部の機能がご利用いただけないことがあります。
          </p>
        </section>

        <section class="legal-section">
          <h4>7. 情報の管理と保管期間</h4>
          <p>
            取得した個人情報は、漏えい・滅失・毀損を防ぐために必要かつ適切な措置を講じて管理します。
            お問い合わせに関する情報は、対応の完了後、必要がなくなった時点で速やかに削除します。
          </p>
        </section>

        <section class="legal-section">
          <h4>8. 開示・訂正・削除等のご請求</h4>
          <p>
            ご自身の個人情報について、開示・訂正・追加・削除・利用停止をご希望の場合は、
            下記の窓口までご連絡ください。ご本人であることを確認のうえ、法令に従い速やかに対応します。
          </p>
        </section>

        <section class="legal-section">
          <h4>9. 本ポリシーの変更</h4>
          <p>
            法令の改正やサービス内容の変更に伴い、本ポリシーを改定することがあります。
            改定後の内容は、本ウェブサイトに掲載した時点から効力を生じます。
          </p>
        </section>

        <section class="legal-section">
          <h4>10. お問い合わせ窓口</h4>
          <dl class="legal-dl">
            <div><dt>メール</dt><dd><a href="mailto:keststudiohkd@gmail.com">keststudiohkd@gmail.com</a></dd></div>
            <div><dt>電話</dt><dd><a href="tel:+819064409072">090-6440-9072</a></dd></div>
          </dl>
        </section>

        <p class="legal-date">制定日：2026年4月20日</p>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../BaseModal.vue';

defineProps({
  open: { type: Boolean, default: false }
});

defineEmits(['close']);
</script>

<style scoped>
/* 外枠は固定したまま、中身だけをスクロールさせる（✕ が流れないように）。
   .modal-content--privacy 自体のレイアウトは親から届かないので :global で当てる。 */
:global(.modal-content--privacy) {
  max-width: 720px;
  max-height: min(86vh, 900px);
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
:global(.modal-content--privacy .modal-close-btn) {
  top: 16px;
  right: 16px;
}

.legal-body {
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 56px 48px 48px;
}

.legal-body h3 { text-align: left; margin-bottom: 20px; }
.legal-lead { color: var(--color-ink-muted); font-size: 0.92rem; line-height: 1.9; margin: 0 0 8px; }

.legal-section { margin-top: 32px; }
.legal-section h4 {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 12px;
  color: var(--color-ink);
}
.legal-section p { margin: 0 0 12px; font-size: 0.9rem; line-height: 1.9; color: var(--color-ink-muted); }
.legal-section ul { margin: 0 0 12px; padding-left: 1.25em; font-size: 0.9rem; line-height: 1.9; color: var(--color-ink-muted); }
.legal-section li { margin-bottom: 4px; }
.legal-section strong { color: var(--color-ink); font-weight: 700; }
.legal-section a { color: var(--color-ink); text-underline-offset: 3px; }

.legal-dl { margin: 0; font-size: 0.9rem; line-height: 1.9; }
.legal-dl > div { display: flex; gap: 16px; padding: 6px 0; border-bottom: 1px solid var(--color-border); }
.legal-dl dt { flex: 0 0 7.5em; font-weight: 700; color: var(--color-ink); }
.legal-dl dd { margin: 0; color: var(--color-ink-muted); }

.legal-date { margin-top: 40px; font-size: 0.82rem; color: var(--color-ink-muted); text-align: right; }

@media (max-width: 768px) {
  :global(.modal-content--privacy) { max-height: 88vh; }
  .legal-body { padding: 48px 24px 32px; }
  .legal-dl > div { flex-direction: column; gap: 2px; }
  .legal-dl dt { flex: none; }
}
</style>
