<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import portfolioData from '../components/portfolio.json';

// --- State Management ---
const isContactModalOpen = ref(false);
const isVideoModalOpen = ref(false);
const currentVideoId = ref('');
const modalTriggerElement = ref(null);
const isScrolled = ref(false);

// --- Contact Form State ---
const contact = ref({ name: '', email: '', message: '', consent: false });
const contactErrors = ref({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// --- Methods ---
const openVideoModal = (videoId, event) => {
  currentVideoId.value = videoId;
  isVideoModalOpen.value = true;
  modalTriggerElement.value = event?.target || null;
  nextTick(() => {
    const closeBtn = document.querySelector('.modal-close-btn--video');
    if (closeBtn) closeBtn.focus();
  });
  document.body.style.overflow = 'hidden';
};

const closeVideoModal = () => {
  isVideoModalOpen.value = false;
  currentVideoId.value = '';
  document.body.style.overflow = '';
  if (modalTriggerElement.value) modalTriggerElement.value.focus();
};

const openContactModal = (event) => {
  isContactModalOpen.value = true;
  modalTriggerElement.value = event?.target || null;
  nextTick(() => {
    const closeBtn = document.querySelector('.modal-close-btn--contact');
    if (closeBtn) closeBtn.focus();
  });
  document.body.style.overflow = 'hidden';
};

const closeContactModal = () => {
  isContactModalOpen.value = false;
  document.body.style.overflow = '';
  if (modalTriggerElement.value) modalTriggerElement.value.focus();
};

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (isVideoModalOpen.value) closeVideoModal();
    else if (isContactModalOpen.value) closeContactModal();
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
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

const resetContact = () => {
  contact.value = { name: '', email: '', message: '', consent: false };
  contactErrors.value = {};
  submitSuccess.value = false;
};

const submitContact = async () => {
  if (!validateContact()) return;
  isSubmitting.value = true;
  submitSuccess.value = false;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact.value),
    });

    if (res.ok) {
      submitSuccess.value = true;
      resetContact();
      setTimeout(() => {
        closeContactModal();
      }, 1500);
    } else {
      throw new Error('API Error');
    }
  } catch (e) {
    const subject = encodeURIComponent('KestStudio Contact: ' + contact.value.name);
    const body = encodeURIComponent(contact.value.message + '\n\nFrom: ' + contact.value.name + ' <' + contact.value.email + '>');
    window.location.href = `mailto:keststudiohkd@gmail.com?subject=${subject}&body=${body}`;
  } finally {
    isSubmitting.value = false;
  }
};

// --- Lifecycle ---
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="kest-studio">
<header :class="['header', { 'is-scrolled': isScrolled }]">
      <div class="header-inner">
        <div class="logo">Kest Films</div>
        <nav class="nav">
          <a href="#portfolio">Works</a>
          <a href="#contact">Contact</a>
          <a href="https://www.instagram.com/kest_films/" target="_blank" rel="noopener noreferrer" class="nav-social">
            <svg class="icon-insta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>

    <div class="hero">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="fade-in">Kest Studio</span>
        </h1>
        <h2 class="hero-subtitle">
          <span class="fade-in delay-1">Journey to Inspiration,</span><br>
          <span class="fade-in delay-2">Driven by Our Films</span>
        </h2>
        <p class="hero-text fade-in delay-3">
          洗練された視点で、本質を。
        </p>
      </div>
      <div class="scroll-indicator fade-in delay-3">
        <span>Scroll</span>
        <div class="line"></div>
      </div>
    </div>

    <section id="portfolio" class="portfolio section">
      <div class="container">
        <div class="section-header fade-in-scroll">
          <h2>Works</h2>
          <p>私たちの手がけた映像作品</p>
        </div>

        <div class="grid">
          <article v-for="item in portfolioData" :key="item.id" class="card">
            <div 
              class="card-thumb" 
              @click="(e) => openVideoModal(item.youtubeId, e)" 
              tabindex="0"
              @keydown.enter="(e) => openVideoModal(item.youtubeId, e)"
              :aria-label="`${item.title}の動画を再生する`"
            >
              <img :src="item.thumbnail" :alt="item.alt" loading="lazy" width="800" height="450" />
              <div class="card-overlay">
                <div class="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
                </div>
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

<section id="contact" class="contact section">
      <div class="container">
        <div class="contact-box">
          <h2 class="contact-title">Start Your Vision</h2>
          <p class="contact-desc">あなたのブランドの価値を、共に可視化しましょう。<br>まずはお気軽にご相談ください。</p>
          
          <div class="contact-actions">
            <button @click="openContactModal" class="btn btn-primary">
              Webからのお問い合わせ
            </button>
            
            <a href="https://www.instagram.com/kest_films/" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-insta">
              <svg class="icon-insta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              @kest_films
            </a>

            <a href="tel:+819064409072" class="btn btn-outline">
              Tel: 090-6440-9072
            </a>
            <a href="mailto:keststudiohkd@gmail.com" class="btn btn-outline">
              Email: keststudiohkd@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Kest Studio. All Rights Reserved.</p>
    </footer>

    <Transition name="fade">
      <div v-if="isContactModalOpen" class="modal-backdrop" @click.self="closeContactModal" role="dialog" aria-modal="true">
        <div class="modal-content modal-content--contact">
          <button class="modal-close-btn modal-close-btn--contact" @click="closeContactModal" aria-label="閉じる">✕</button>
          
          <div class="modal-body">
            <h3>お問い合わせ</h3>
            <p class="modal-sub">プロジェクトのご相談やご質問など、お気軽にお問い合わせください。</p>
            
            <form class="contact-form" @submit.prevent="submitContact" novalidate>
              <div class="form-group">
                <label>お名前</label>
                <input type="text" v-model="contact.name" placeholder="山田 太郎" />
                <span class="error" v-if="contactErrors.name">{{ contactErrors.name }}</span>
              </div>

              <div class="form-group">
                <label>メールアドレス</label>
                <input type="email" v-model="contact.email" placeholder="example@keststudio.com" />
                <span class="error" v-if="contactErrors.email">{{ contactErrors.email }}</span>
              </div>

              <div class="form-group">
                <label>お問い合わせ内容</label>
                <textarea v-model="contact.message" rows="5" placeholder="ご相談内容をご記入ください"></textarea>
                <span class="error" v-if="contactErrors.message">{{ contactErrors.message }}</span>
              </div>

              <label class="consent-label">
                <input type="checkbox" v-model="contact.consent" />
                <span><a href="#" class="link">個人情報の取り扱い</a>に同意します。</span>
              </label>
              <span class="error" v-if="contactErrors.consent">{{ contactErrors.consent }}</span>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
                  {{ isSubmitting ? '送信中...' : '送信する' }}
                </button>
              </div>
              <Transition name="fade">
                <div class="success-message" v-if="submitSuccess">
                  送信が完了しました。追ってご連絡いたします。
                </div>
              </Transition>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isVideoModalOpen" class="modal-backdrop" @click.self="closeVideoModal" role="dialog" aria-modal="true">
        <div class="modal-content modal-content--video">
          <button class="modal-close-btn modal-close-btn--video" @click="closeVideoModal" aria-label="閉じる">✕</button>
          <div class="video-wrapper">
            <iframe v-if="currentVideoId" 
              :src="`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`"
              title="YouTube video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* --- Fonts --- */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');

/* --- Design Tokens & Resets --- */
.kest-studio {
  /* 暖かみのある白を基調としたカラーパレット */
  --color-bg: #FCFAF8; /* エクリュ/ウォームホワイト */
  --color-surface: #FFFFFF;
  --color-text: #33312E; /* 柔らかいチャコールグレー */
  --color-text-mut: #8A857D;
  --color-border: #E8E5DF;
  --color-accent: #B0A392; /* 上品なグレージュ */
  --color-accent-hover: #968A79;
  
  --font-sans: 'Zen Kaku Gothic New', sans-serif;
  --font-serif: 'Cormorant Garamond', serif;
  
  font-family: var(--font-sans);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 140px 0;
}

/* --- Typography --- */
h1, h2, h3 {
  margin: 0;
  line-height: 1.3;
}

.section-header {
  text-align: center;
  margin-bottom: 72px;
}

.section-header h2 {
  font-size: 3rem;
  font-family: var(--font-serif);
  font-weight: 400;
  margin-bottom: 16px;
  color: var(--color-text);
}

.section-header p {
  color: var(--color-text-mut);
  font-size: 1.05rem;
  letter-spacing: 0.08em;
}

/* --- Header --- */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  transition: all 0.4s ease;
  padding: 24px 0;
}

.header.is-scrolled {
  background-color: rgba(252, 250, 248, 0.9);
  backdrop-filter: blur(8px);
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

.logo {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.nav {
  display: flex;
  align-items: center;
}

.nav a {
  text-decoration: none;
  color: var(--color-text);
  margin-left: 40px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.nav a:hover {
  color: var(--color-accent);
}

.nav-social {
  position: relative;
  padding-left: 24px;
}

.nav-social::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background-color: var(--color-border);
}

/* --- Hero (Typographic & Warm) --- */
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* 背景のふんわりとしたグラデーションオーブ */
.hero-bg-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s infinite ease-in-out alternate;
}

.shape-1 {
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #EBE3D5 0%, transparent 70%);
  top: -10%;
  left: -10%;
}

.shape-2 {
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, #E1D9CD 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(5%, 10%) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 24px;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 400;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.hero-subtitle {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--color-text-mut);
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 32px;
}

.hero-text {
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--color-text);
  font-weight: 500;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  color: var(--color-text-mut);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.scroll-indicator .line {
  width: 1px;
  height: 60px;
  background-color: var(--color-text-mut);
  margin-top: 16px;
  position: relative;
  overflow: hidden;
}

.scroll-indicator .line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-text);
  animation: scrollLine 2s infinite cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes scrollLine {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* --- Portfolio Grid --- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 56px 40px;
}

.card {
  cursor: pointer;
  group: hover;
}

.card-thumb {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 16 / 9;
  background-color: #EAEAEA;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: box-shadow 0.4s ease;
}

.card:hover .card-thumb {
  box-shadow: 0 15px 40px rgba(0,0,0,0.08);
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.card:hover .card-thumb img {
  transform: scale(1.04);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(51, 49, 46, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}

.play-button {
  width: 72px;
  height: 72px;
  background: rgba(252, 250, 248, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.9);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .play-button {
  transform: scale(1);
}

.play-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text);
  margin-left: 4px;
}

.card-info {
  margin-top: 24px;
  text-align: center;
}

.category {
  font-size: 0.75rem;
  color: var(--color-text-mut);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.card-info h3 {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* --- Contact Section --- */
.contact {
  background-color: var(--color-surface);
}

.contact-box {
  background-color: var(--color-bg);
  border-radius: 2px; /* 少しシャープにしてモダンに */
  padding: 100px 40px;
  text-align: center;
  border: 1px solid var(--color-border);
}

.contact-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  margin-bottom: 24px;
  font-weight: 400;
}

.contact-desc {
  color: var(--color-text-mut);
  margin-bottom: 56px;
  font-size: 1.05rem;
  line-height: 1.8;
}

.contact-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 40px;
  border-radius: 0; /* 四角いボタンで洗練された印象に */
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 240px;
}

.btn-primary {
  background-color: var(--color-text);
  color: var(--color-bg);
  border: 1px solid var(--color-text);
}

.btn-primary:hover {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: #FFF;
}

.btn-outline {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-outline:hover {
  border-color: var(--color-text);
}

.btn-block {
  width: 100%;
}

/* --- Modals --- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(51, 49, 46, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal-content {
  position: relative;
  width: 100%;
  background: var(--color-bg);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-content--video {
  max-width: 1000px;
  aspect-ratio: 16 / 9;
  background: #000;
}

.modal-content--contact {
  max-width: 600px;
  padding: 64px 48px;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
  z-index: 10;
}

.modal-close-btn--video {
  color: #FFF;
}

.modal-close-btn--contact {
  color: var(--color-text-mut);
}

.modal-close-btn:hover {
  transform: rotate(90deg);
}

.video-wrapper {
  width: 100%;
  height: 100%;
}

.video-wrapper iframe {
  width: 100%;
  height: 100%;
}

/* --- Form Styles --- */
.modal-body h3 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-family: var(--font-serif);
  font-weight: 400;
  text-align: center;
}

.modal-sub {
  color: var(--color-text-mut);
  margin-bottom: 40px;
  font-size: 0.95rem;
  text-align: center;
}

.form-group {
  margin-bottom: 32px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
  letter-spacing: 0.05em;
}

.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form textarea {
  width: 100%;
  padding: 16px 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-text);
  transition: border-color 0.3s;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #C2BFBA;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-bottom-color: var(--color-text);
}

.consent-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 32px;
  color: var(--color-text-mut);
}

.consent-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-text);
}

.link {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.error {
  color: #C15151;
  font-size: 0.8rem;
  margin-top: 8px;
  display: block;
}

.success-message {
  margin-top: 24px;
  padding: 16px;
  background-color: #F1F4F0;
  color: #4C6546;
  text-align: center;
  font-weight: 500;
  border: 1px solid #DCE3DA;
}

/* --- Footer --- */
.footer {
  padding: 40px 0 60px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-mut);
  letter-spacing: 0.05em;
}

/* --- Animations --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 24px;
  }
  
  .nav a {
    margin-left: 20px;
    font-size: 0.85rem;
  }
  
  .nav-social {
    display: none; /* スマホのヘッダーは狭いので非表示、下部のボタンへ誘導 */
  }

  .hero-title {
    font-size: 3.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .section {
    padding: 80px 0;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .contact-box {
    padding: 64px 24px;
  }

  .contact-title {
    font-size: 2.2rem;
  }

  .contact-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    min-width: auto;
  }

  .modal-content--contact {
    padding: 40px 24px;
  }
}

.icon-insta {
  width: 1.2em;
  height: 1.2em;
  transition: transform 0.3s ease;
}

/* ヘッダーのSNSリンク */
.nav-social {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  padding-left: 24px;
}

.nav-social::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background-color: var(--color-border);
}

.nav-social:hover .icon-insta {
  transform: scale(1.1);
  color: var(--color-accent);
}

/* Instagramボタンの装飾 */
.btn-insta {
  gap: 10px;
}

.btn-insta:hover .icon-insta {
  transform: rotate(-10deg) scale(1.1);
}

/* スマホ表示の微調整 */
@media (max-width: 768px) {
  .nav-social span {
    display: none; /* スマホではテキストを隠してアイコンのみにする */
  }
  .nav-social {
    padding-left: 16px;
  }
  .btn-insta .icon-insta {
    width: 1.4em;
    height: 1.4em;
  }
}
</style>