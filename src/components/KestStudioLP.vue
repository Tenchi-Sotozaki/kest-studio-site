<script setup>
/**
 * KestStudio Landing Page (updated with Contact Form & Phone)
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import portfolioData from './portfolio.json'; // 上記JSONをインポート

// --- State Management ---
const isModalOpen = ref(false);
const currentVideoId = ref('');
const modalTriggerElement = ref(null); // モーダルを閉じたあとにフォーカスを戻す要素
const heroVideo = ref(null);
const isHeroPlaying = ref(false);

// --- Contact Form State ---
const contact = ref({ name: '', email: '', message: '', consent: false });
const contactErrors = ref({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// --- Methods ---
const openModal = (videoId, event) => {
  currentVideoId.value = videoId;
  isModalOpen.value = true;
  modalTriggerElement.value = event.target;
  nextTick(() => {
    const closeBtn = document.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  });
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  currentVideoId.value = '';
  document.body.style.overflow = '';
  if (modalTriggerElement.value) modalTriggerElement.value.focus();
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

const toggleHeroVideo = () => {
  if (!heroVideo.value) return;
  if (heroVideo.value.paused) {
    heroVideo.value.play();
    isHeroPlaying.value = true;
  } else {
    heroVideo.value.pause();
    isHeroPlaying.value = false;
  }
};

// --- Contact Form Helpers ---
const validateContact = () => {
  contactErrors.value = {};
  if (!contact.value.name.trim()) contactErrors.value.name = 'お名前を入力してください。';
  if (!contact.value.email.trim()) contactErrors.value.email = 'メールアドレスを入力してください。';
  else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(contact.value.email)) contactErrors.value.email = '有効なメールアドレスを入力してください。';
  if (!contact.value.message.trim()) contactErrors.value.message = 'お問い合わせ内容を入力してください。';
  if (!contact.value.consent) contactErrors.value.consent = '個人情報の取り扱いに同意してください。';
  return Object.keys(contactErrors.value).length === 0;
};

const submitContact = async () => {
  if (!validateContact()) return;
  isSubmitting.value = true;
  submitSuccess.value = false;

  // 実運用ではAPIエンドポイントへPOSTする。
  // ここではフォールバックとして mailto を用意。
  try {
    // placeholder: replace '/api/contact' with real endpoint if available
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact.value),
    });

    if (res.ok) {
      submitSuccess.value = true;
      contact.value = { name: '', email: '', message: '', consent: false };
    } else {
      // フォールバック: mailto
      const subject = encodeURIComponent('KestStudio Contact: ' + contact.value.name);
      const body = encodeURIComponent(contact.value.message + '\n\nFrom: ' + contact.value.name + ' <' + contact.value.email + '>');
      window.location.href = `mailto:hello@keststudio.example?subject=${subject}&body=${body}`;
    }
  } catch (e) {
    // ネットワークエラー時のフォールバック
    const subject = encodeURIComponent('KestStudio Contact: ' + contact.value.name);
    const body = encodeURIComponent(contact.value.message + '\n\nFrom: ' + contact.value.name + ' <' + contact.value.email + '>');
    window.location.href = `mailto:hello@keststudio.example?subject=${subject}&body=${body}`;
  } finally {
    isSubmitting.value = false;
  }
};

// --- Lifecycle ---
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="kest-studio">
    <header class="header">
      <div class="logo">Kest</div>
      <nav class="nav">
        <a href="#portfolio">Works</a>
        <a href="#contact" class="btn-primary">Consult</a>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-video-container">
        <video 
          ref="heroVideo"
          class="hero-video"
          loop 
          muted 
          playsinline
          poster="https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-347-large.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        
        <div class="hero-overlay">
          <h1 class="hero-title">
            <span class="fade-in">Visualizing Value.</span><br>
            <span class="fade-in delay">Inspiring Future.</span>
          </h1>
          <div class="hero-actions">
            <button 
              @click="toggleHeroVideo" 
              class="play-toggle" 
              aria-pressed="isHeroPlaying"
              aria-label="背景映像を再生/停止"
            >
              {{ isHeroPlaying ? 'Pause Ambient' : 'Play Ambient' }}
            </button>
            <a href="#contact" class="btn-primary" style="margin-left:16px">Contact Us</a>
          </div>
        </div>
      </div>
    </section>

    <section id="portfolio" class="portfolio">
      <div class="container">
        <div class="section-header">
          <h2>Selected Works</h2>
          <p>洗練された視点で、本質を。</p>
        </div>

        <div class="grid">
          <article 
            v-for="item in portfolioData" 
            :key="item.id" 
            class="card"
          >
            <div class="card-thumb" @click="(e) => openModal(item.youtubeId, e)" tabindex="0" @keydown.enter="openModal(item.youtubeId, $event)">
              <img 
                :src="item.thumbnail" 
                :alt="item.alt" 
                loading="lazy" 
                width="800" 
                height="450"
              />
              <div class="card-overlay">
                <span class="play-icon">▶</span>
              </div>
            </div>
            <div class="card-info">
              <span class="category">{{ item.category }}</span>
              <h3>{{ item.title }}</h3>
            </div>
          </article>
        </div>

      </div>
    </section>

<!-- Contact セクション（Vue テンプレート用・モーダルは v-if） -->
<section id="contact" class="contact">
  <div class="container">
    <h2>Start Your Vision</h2>
    <p>あなたのブランドの価値を、共に可視化しましょう。</p>

    <div class="contact-actions" style="margin-top:24px;">
      <button class="btn-primary" @click="isModalOpen = true">お問い合わせフォームを開く</button>
      <a class="btn-outline" href="tel:+819064409072" style="margin-left:12px">090-6440-9072</a>
      <a style="margin-left:12px;color:var(--color-accent)" href="mailto:keststudiohkd@gmail.com">keststudiohkd@gmail.com</a>
    </div>
  </div>

  <!-- モーダル（Vue 的に v-if で表示） -->
  <div v-if="isModalOpen" class="modal-backdrop" @click.self="isModalOpen = false" role="dialog" aria-modal="true">
    <div class="modal-content" role="document">
      <button class="modal-close-btn" @click="isModalOpen = false" aria-label="閉じる">✕</button>

      <div class="video-wrapper" style="padding:24px; background:var(--color-bg); color:var(--color-text);">
        <h3 style="margin-top:0">お問い合わせ</h3>

        <!-- フォーム：既存の submitContact を使う -->
        <form class="contact-form" @submit.prevent="submitContact" novalidate>
          <label>
            <span class="label">お名前</span>
            <input type="text" v-model="contact.name" />
            <span class="error" v-if="contactErrors.name">{{ contactErrors.name }}</span>
          </label>

          <label>
            <span class="label">メールアドレス</span>
            <input type="email" v-model="contact.email" />
            <span class="error" v-if="contactErrors.email">{{ contactErrors.email }}</span>
          </label>

          <label>
            <span class="label">お問い合わせ内容</span>
            <textarea v-model="contact.message" rows="5"></textarea>
            <span class="error" v-if="contactErrors.message">{{ contactErrors.message }}</span>
          </label>

          <label class="consent">
            <input type="checkbox" v-model="contact.consent" />
            <span>個人情報の取り扱いに同意します。</span>
          </label>
          <span class="error" v-if="contactErrors.consent">{{ contactErrors.consent }}</span>

          <div class="form-actions">
            <button type="submit" class="btn-primary large" :disabled="isSubmitting">
              {{ isSubmitting ? '送信中...' : '送信する' }}
            </button>
            <button type="button" class="btn-outline" @click="() => { contact.name=''; contact.email=''; contact.message=''; contact.consent=false; contactErrors={}; }">リセット</button>
          </div>

          <p class="form-note" v-if="submitSuccess">送信が完了しました。ありがとうございます。追ってご連絡いたします。</p>
        </form>

        <div style="margin-top:12px; font-size:0.9rem; color:var(--color-sub)">
          直接メールする： <a href="mailto:keststudiohkd@gmail.com">keststudiohkd@gmail.com</a><br>
          電話： <a href="tel:+819064409072">090-6440-9072</a>
        </div>
      </div>
    </div>
  </div>
</section>


    <footer class="footer">
      <p>&copy; 2025 KestStudio. All Rights Reserved.</p>
    </footer>

    <Transition name="fade">
      <div 
        v-if="isModalOpen" 
        class="modal-backdrop" 
        @click.self="closeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal-content">
          <button 
            class="modal-close-btn" 
            @click="closeModal" 
            aria-label="閉じる"
          >
            ×
          </button>
          
          <div class="video-wrapper">
            <iframe 
              v-if="currentVideoId"
              width="560" 
              height="315" 
              :src="`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* --- Base Variables & Reset (Simulated :root for scoped) --- */
.kest-studio {
  --color-bg: #FFFFFF;
  --color-text: #111111;
  --color-accent: #4CAF50; /* 指定グリーン */
  --color-sub: #666;
  --color-border: #E5E5E5;
  --font-sans: 'Helvetica Neue', Arial, sans-serif;
  font-family: var(--font-sans);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav a {
  text-decoration: none;
  color: var(--color-text);
  margin-left: 32px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav a:hover {
  opacity: 0.6;
}

.hero {
  position: relative;
  height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f4f4f4;
}

.hero-video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8; /* テキストの視認性確保 */
}

.hero-overlay {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 32px;
  letter-spacing: -0.03em;
}

.play-toggle {
  background: transparent;
  border: 1px solid var(--color-text);
  padding: 12px 24px;
  cursor: pointer;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.play-toggle:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1s forwards;
}
.delay {
  animation-delay: 0.5s;
}

@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
  from { opacity: 0; transform: translateY(20px); }
}

.portfolio {
  padding: 120px 0;
}

.section-header {
  margin-bottom: 60px;
  text-align: center;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 16px;
  font-weight: 400;
}

.section-header p {
  color: var(--color-sub);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.card {
  cursor: pointer;
}

.card-thumb {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background-color: #eee;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  display: block;
}

.card:hover .card-thumb img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .card-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
  font-size: 2rem;
}

.card-info {
  margin-top: 16px;
}

.category {
  font-size: 0.75rem;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}

.card-info h3 {
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
}

.contact {
  padding: 120px 0;
  background-color: #f9f9f9;
  text-align: center;
}

.contact h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-weight: 300;
}

.contact p {
  margin-bottom: 32px;
  color: var(--color-sub);
}

.contact-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  align-items: start;
  justify-content: center;
  margin-top: 24px;
}

.contact-card {
  text-align: left;
  padding: 24px;
  background: white;
  border: 1px solid var(--color-border);
}

.contact-card h3 { margin-top: 0; }

.contact-form {
  text-align: left;
  background: white;
  padding: 24px;
  border: 1px solid var(--color-border);
}

.contact-form label { display: block; margin-bottom: 12px; }
.contact-form .label { display: block; font-size: 0.9rem; margin-bottom: 8px; }
.contact-form input,
.contact-form textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; box-sizing: border-box; }
.contact-form textarea { resize: vertical; }

.error { color: #D32F2F; font-size: 0.85rem; margin-top: 6px; display: block; }
.small { color: var(--color-sub); font-size: 0.9rem; }

.consent { display: flex; align-items: center; gap: 8px; margin: 12px 0; }

.form-actions { display: flex; gap: 12px; align-items: center; margin-top: 16px; }

.btn-primary { background-color: var(--color-accent); color: white !important; padding: 12px 32px; border-radius: 0; transition: background-color 0.3s; display: inline-block; }
.btn-primary:hover { background-color: #388E3C; }
.btn-outline { border: 1px solid var(--color-text); color: var(--color-text); padding: 10px 20px; }

.form-note { margin-top: 12px; color: #2E7D32; }

.footer {
  padding: 40px 0;
  text-align: center;
  border-top: 1px solid var(--color-border);
  font-size: 0.8rem;
  color: var(--color-sub);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 960px;
  aspect-ratio: 16/9;
  background: black;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.video-wrapper { width: 100%; height: 100%; }
.video-wrapper iframe { width: 100%; height: 100%; }

.modal-close-btn {
  position: absolute;
  top: -40px;
  right: -10px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-text);
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (max-width: 1024px) {
  .contact-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .grid { grid-template-columns: 1fr; }
  .header { padding: 20px; }
}
</style>
