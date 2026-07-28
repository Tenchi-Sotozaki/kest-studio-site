import { ref } from 'vue';
import { contact as contactInfo } from '../data/site.js';

const EMAIL_RE = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;

const emptyForm = () => ({ name: '', email: '', message: '', consent: false });

/**
 * お問い合わせフォーム。
 *
 * 送信先は Netlify Forms（index.html 側に検出用の静的フォームがある）。
 * 失敗した場合は入力内容を失わないよう mailto: にフォールバックする。
 *
 * @param {() => void} [onSuccess] 送信成功後に呼ばれる（モーダルを閉じる等）
 */
export function useContactForm(onSuccess) {
  const form = ref(emptyForm());
  const errors = ref({});
  const isSubmitting = ref(false);
  const submitSuccess = ref(false);

  const validate = () => {
    const next = {};
    if (!form.value.name.trim()) next.name = 'お名前を入力してください。';

    if (!form.value.email.trim()) next.email = 'メールアドレスを入力してください。';
    else if (!EMAIL_RE.test(form.value.email)) next.email = '有効なメールアドレスを入力してください。';

    if (!form.value.message.trim()) next.message = 'お問い合わせ内容を入力してください。';
    if (!form.value.consent) next.consent = '個人情報の取り扱いに同意してください。';

    errors.value = next;
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    form.value = emptyForm();
    errors.value = {};
    submitSuccess.value = false;
  };

  const fallbackToMailto = () => {
    const subject = encodeURIComponent(`KestStudio Contact: ${form.value.name}`);
    const body = encodeURIComponent(
      `${form.value.message}\n\nFrom: ${form.value.name} <${form.value.email}>`
    );
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
  };

  const submit = async () => {
    if (!validate()) return;

    isSubmitting.value = true;
    submitSuccess.value = false;

    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      });

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      if (!res.ok) throw new Error(`送信に失敗しました (${res.status})`);

      submitSuccess.value = true;
      reset();
      submitSuccess.value = true; // reset で消えるので立て直す
      setTimeout(() => onSuccess?.(), 1500);
    } catch {
      fallbackToMailto();
    } finally {
      isSubmitting.value = false;
    }
  };

  return { form, errors, isSubmitting, submitSuccess, validate, reset, submit };
}
