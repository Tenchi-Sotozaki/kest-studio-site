<!-- お問い合わせフォーム（Netlify Forms 送信 / 失敗時は mailto: にフォールバック） -->
<template>
  <BaseModal
    :open="open"
    tone="light"
    content-class="modal-content--contact"
    close-btn-class="modal-close-btn--contact"
    aria-labelledby="contact-title"
    @close="$emit('close')"
  >
    <div class="modal-body">
      <h3 id="contact-title">お問い合わせ</h3>
      <p class="modal-sub">プロジェクトのご相談やご質問など、お気軽にご連絡ください。</p>

      <form class="contact-form" name="contact" novalidate @submit.prevent="submit">
        <div class="form-group">
          <label for="contact-name">お名前</label>
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            name="name"
            placeholder="山田 太郎"
            :aria-invalid="Boolean(errors.name)"
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="contact-email">メールアドレス</label>
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            name="email"
            placeholder="hello@example.com"
            :aria-invalid="Boolean(errors.email)"
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="contact-message">お問い合わせ内容</label>
          <textarea
            id="contact-message"
            v-model="form.message"
            name="message"
            rows="5"
            placeholder="ご相談内容をご記入ください"
            :aria-invalid="Boolean(errors.message)"
          ></textarea>
          <span v-if="errors.message" class="error">{{ errors.message }}</span>
        </div>

        <label class="consent-label">
          <input v-model="form.consent" type="checkbox" />
          <span>
            <button type="button" class="link" @click="$emit('open-privacy', $event)">
              プライバシーポリシー
            </button>に同意する
          </span>
        </label>
        <span v-if="errors.consent" class="error">{{ errors.consent }}</span>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
            {{ isSubmitting ? '送信中...' : '送信する' }}
          </button>
        </div>

        <Transition name="fade">
          <p v-if="submitSuccess" class="success-message" role="status">
            送信が完了しました。追ってご連絡いたします。
          </p>
        </Transition>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../BaseModal.vue';
import { useContactForm } from '../../composables/useContactForm.js';

defineProps({
  open: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'open-privacy']);

const { form, errors, isSubmitting, submitSuccess, submit } = useContactForm(() => emit('close'));
</script>

<style scoped>
.form-actions { margin-top: 8px; }
</style>
