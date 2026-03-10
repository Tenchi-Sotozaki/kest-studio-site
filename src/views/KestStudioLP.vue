<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import portfolioData from '../components/portfolio.json';

// --- State Management ---
const isContactModalOpen = ref(false);
const isVideoModalOpen = ref(false);
const currentVideoId = ref('');
const modalTriggerElement = ref(null);
const isScrolled = ref(false);

const fontList = [
  "'Cormorant Garamond', serif",            // エレガント（明朝）
  "'Zen Kaku Gothic New', sans-serif",      // モダン（ゴシック）
  "Arial, Helvetica, sans-serif",           // スタンダード
  "'Times New Roman', Times, serif",        // クラシック
  "'Courier New', Courier, monospace",      // タイプライター調
  "Georgia, serif",                         // 美しいセリフ体
  "Verdana, Geneva, sans-serif",            // 力強いゴシック
  "'Trebuchet MS', Helvetica, sans-serif",  // スタイリッシュ
  "Impact, Charcoal, sans-serif",           // 極太
  "'Arial Black', Gadget, sans-serif",      // ポップな極太
  "'Palatino Linotype', 'Book Antiqua', Palatino, serif", // オールドスタイル
  "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
  "Tahoma, Geneva, sans-serif",
  "'Lucida Console', Monaco, monospace",    // プログラミングコード風
  "Garamond, serif",
  "'Comic Sans MS', cursive, sans-serif",   // コミック風
  "'Brush Script MT', cursive",             // 筆記体
  "Baskerville, 'Baskerville Old Face', serif",
  "Optima, sans-serif",                     // セリフとサンセリフの中間
  "'Bodoni MT', Didot, 'Didot LT STD', serif", // ファッション誌風
  "Copperplate, 'Copperplate Gothic Light', fantasy", // レトロ・銅版画風
  "Papyrus, fantasy",                       // 古代風
  "'Century Gothic', sans-serif",           // 幾何学的
  "Consolas, monaco, monospace",            
  "Cambria, Georgia, serif",
  "Candara, Calibri, sans-serif",
  "'Franklin Gothic Medium', 'Arial Narrow', sans-serif",
  "Futura, 'Trebuchet MS', Arial, sans-serif", // モダンジオメトリック
  "Rockwell, 'Courier Bold', Courier, Georgia, Times, 'Times New Roman', serif", // スラブセリフ（太いヒゲ）
  "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
];

const currentHeroFont = ref(fontList[0]);
let fontInterval = null;

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

const encode = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

// 👇 送信処理をNetlify仕様に書き換え
const submitContact = async () => {
  if (!validateContact()) return;
  isSubmitting.value = true;
  submitSuccess.value = false;

  try {
    // Netlify Formsの仕様に合わせて送信
const formData = new URLSearchParams();
    formData.append('form-name', 'contact'); // ステップ1のフォーム名と一致させる
    formData.append('name', contact.value.name);
    formData.append('email', contact.value.email);
    formData.append('message', contact.value.message);

    // 👇 Netlifyに向けて送信
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
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
    // 送信エラー時は、念のためメールアプリを立ち上げる
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

  let lastIndex = 0;
  fontInterval = setInterval(() => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * fontList.length);
    } while (randomIndex === lastIndex);
    
    lastIndex = randomIndex;
    currentHeroFont.value = fontList[randomIndex];
  }, 100); // 0.1秒ごとにフォントを変更
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);

  if (fontInterval) clearInterval(fontInterval);
});
</script>

<template>
  <div class="kest-studio">
    <div class="noise-overlay"></div>

    <div class="yuba-bg">
      <div class="yuba-shape shape-1"></div>
      <div class="yuba-shape shape-2"></div>
      <div class="yuba-shape shape-3"></div>
    </div>

    <header :class="['header', { 'is-scrolled': isScrolled }]">
      <div class="header-inner">
        <div class="logo">Kest Studio</div>
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
      <div class="hero-content">
        <h1 class="hero-title fade-in" :style="{ fontFamily: currentHeroFont }">
        Kest Studio
        </h1>
      </div>
      <div class="scroll-indicator fade-in delay-3">
        <div class="scroll-ring">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <path id="textPath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
            <text fill="#FFFFFF" font-size="11" font-weight="700" letter-spacing="0.1em">
              <textPath href="#textPath" startOffset="0" textLength="250">
                SCROLL DOWN • SCROLL DOWN • 
              </textPath>
            </text>
          </svg>
          <div class="scroll-line-center"></div>
        </div>
      </div>
    </div>

    <section id="portfolio" class="portfolio section">
      <div class="container">
        <div class="section-header fade-in-scroll">
          <span class="sub-title">Our Works</span>
          <h2>手がけた映像</h2>
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
          <div class="contact-box-inner">
            <h2 class="contact-title">Contact</h2>
            <p class="contact-desc">
            </p>
            
            <div class="contact-actions">
              <button @click="openContactModal" class="btn btn-primary">
                Webからのお問い合わせ
              </button>
              
              <a href="https://www.instagram.com/kest_films/" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-insta">
                <svg class="icon-insta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram (@kest_films)
              </a>

              <a href="tel:+819064409072" class="btn btn-outline">
                Tel: 090-6440-9072
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Kest Studio. All Rights Reserved.</p>
    </footer>

    <Transition name="fade-modal">
      <div v-if="isContactModalOpen" class="modal-backdrop" @click.self="closeContactModal" role="dialog" aria-modal="true">
        <div class="modal-content modal-content--contact">
          <button class="modal-close-btn modal-close-btn--contact" @click="closeContactModal" aria-label="閉じる">✕</button>
          
          <div class="modal-body">
            <h3>お問い合わせ</h3>
            <p class="modal-sub">プロジェクトのご相談やご質問など、お気軽にご連絡ください。</p>
            
            <form class="contact-form" name="contact" @submit.prevent="submitContact" novalidate>
              <div class="form-group">
                <label>お名前</label>
                <input type="text" name="name" v-model="contact.name" placeholder="山田 太郎" />
                <span class="error" v-if="contactErrors.name">{{ contactErrors.name }}</span>
              </div>

              <div class="form-group">
                <label>メールアドレス</label>
                <input type="email" name="email" v-model="contact.email" placeholder="hello@example.com" />
                <span class="error" v-if="contactErrors.email">{{ contactErrors.email }}</span>
              </div>

              <div class="form-group">
                <label>お問い合わせ内容</label>
                <textarea name="message" v-model="contact.message" rows="5" placeholder="ご相談内容をご記入ください"></textarea>
                <span class="error" v-if="contactErrors.message">{{ contactErrors.message }}</span>
              </div>

              <label class="consent-label">
                <input type="checkbox" v-model="contact.consent" />
                <span><a href="#" class="link">プライバシーポリシー</a>に同意する</span>
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

<Transition name="fade-modal">
      <div v-if="isVideoModalOpen" class="modal-backdrop" @click.self="closeVideoModal" role="dialog" aria-modal="true">
        <div class="modal-content modal-content--video crt-tv">
          <button class="modal-close-btn modal-close-btn--video" @click="closeVideoModal" aria-label="閉じる">✕</button>
          
          <div class="crt-casing">
            <div class="crt-screen-bezel">
              <div class="crt-glass"></div>
              <div class="video-wrapper">
                <iframe v-if="currentVideoId" 
                  :src="`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`"
                  title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
            
            <div class="crt-panel">
              <div class="crt-dial"></div>
              <div class="crt-dial"></div>
              <div class="crt-speaker"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');

/* --- Design Tokens & Resets --- */
.kest-studio {
  --color-grad-start: #FF9B6A; 
  --color-grad-end: #E87A43;
  --color-accent: #E87A43; 
  --color-accent-hover: #D6652D;
  --color-surface: #2E3526;
  --color-border: #4C5741;
  --color-text-light: #FFFFFF;
  --color-text-surface: #EAF0E1;
  --color-text-mut: #8B997B;
  
  --font-sans: 'Zen Kaku Gothic New', sans-serif;
  --font-en: 'Cormorant Garamond', serif;
  
  font-family: var(--font-sans);
  color: var(--color-text-light);
  line-height: 1.8;
  letter-spacing: 0.04em;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;
  background-color: var(--color-grad-start);
}

/* --- Yuppa-style Yuba Background --- */
.yuba-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-grad-start) 0%, var(--color-grad-end) 100%);
}

.yuba-shape {
  position: absolute;
  animation: morphYuba 20s ease-in-out infinite both alternate;
  transform-origin: center center;
}

.shape-1 {
  width: 120vw;
  height: 120vw;
  top: -40%;
  left: -20%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(8px);
  animation-delay: 0s;
  animation-duration: 25s;
}

.shape-2 {
  width: 100vw;
  height: 100vw;
  bottom: -30%;
  right: -20%;
  background: linear-gradient(135deg, rgba(232, 122, 67, 0.4), rgba(255, 155, 106, 0.2));
  animation-delay: -5s;
  animation-duration: 22s;
}

.shape-3 {
  width: 80vw;
  height: 80vw;
  top: 20%;
  left: 30%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 200, 150, 0.15));
  animation-delay: -10s;
  animation-duration: 18s;
}

@keyframes morphYuba {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
  34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(45deg) scale(1.05); }
  67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(90deg) scale(0.95); }
  100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(135deg) scale(1); }
}

/* --- Noise Effect --- */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.15;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

*, *::before, *::after {
  box-sizing: border-box;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero, .section, .footer {
  position: relative;
  z-index: 1;
}

.section {
  padding: 140px 0;
}

h1, h2, h3 {
  margin: 0;
  line-height: 1.4;
}

.section-header {
  text-align: center;
  margin-bottom: 72px;
}

.sub-title {
  display: block;
  font-family: var(--font-en);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  opacity: 0.9;
}

.section-header h2 {
  font-family: var(--font-sans);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* --- Header --- */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  transition: all 0.4s ease;
  padding: 24px 0;
}

.header.is-scrolled {
  background-color: rgba(46, 53, 38, 0.95);
  color: var(--color-text-surface);
  box-shadow: 0 4px 24px rgba(20, 26, 15, 0.4);
  padding: 16px 0;
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
  font-family: var(--font-en);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.header.is-scrolled .logo {
  color: var(--color-accent);
}

.nav {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav a {
  text-decoration: none;
  color: inherit;
  font-family: var(--font-en);
  font-size: 1.1rem;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.nav a:hover {
  opacity: 0.7;
}

.nav-social {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.nav-social::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 16px;
  background-color: currentColor;
  opacity: 0.4;
}

.icon-insta {
  width: 1.2em;
  height: 1.2em;
  transition: transform 0.3s ease;
}

.nav-social:hover .icon-insta {
  transform: scale(1.1);
}

/* --- Hero --- */
.hero {
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 24px;
}

.hero-title {
  font-size: clamp(4rem, 10vw, 7rem);
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
  text-shadow: 0 4px 24px rgba(232, 122, 67, 0.4);
  white-space: nowrap;
}

/* --- Scroll Indicator --- */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  margin-left: -60px;
  z-index: 10;
  width: 120px;
  display: flex;
  justify-content: center;
}

.scroll-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.ring-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: rotateText 14s linear infinite;
}

.scroll-line-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 48px;
  background-color: transparent;
  overflow: hidden;
}

.scroll-line-center::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  animation: scrollDropCenter 2.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes rotateText {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes scrollDropCenter {
  0% { transform: translateY(-100%); opacity: 0; }
  20% { opacity: 1; }
  80% { transform: translateY(100%); opacity: 0; }
  100% { transform: translateY(100%); opacity: 0; }
}

/* --- Portfolio Grid --- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px 32px;
}

.card {
  cursor: pointer;
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(20, 26, 15, 0.4);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 56px rgba(20, 26, 15, 0.6);
}

.card-thumb {
  position: relative;
  aspect-ratio: 16 / 9; 
  background-color: #1E2419;
  overflow: hidden;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.card:hover .card-thumb img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(46, 53, 38, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}

.play-button {
  width: 64px;
  height: 64px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .play-button {
  transform: scale(1);
}

.play-icon {
  width: 24px;
  height: 24px;
  margin-left: 4px;
}

.card-info {
  padding: 24px;
  text-align: left;
}

.category {
  font-family: var(--font-en);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  display: block;
}

.card-info h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-surface);
}

/* --- Contact Section --- */
.contact-box {
  display: flex;
  justify-content: center;
}

.contact-box-inner {
  max-width: 900px;
  width: 100%;
  text-align: center;
  background-color: var(--color-surface);
  color: var(--color-text-surface);
  padding: 80px 64px;
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(20, 26, 15, 0.4);
}

.contact-title {
  font-family: var(--font-en);
  font-size: 3rem;
  margin-bottom: 24px;
  font-weight: 700;
  color: var(--color-accent);
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

/* --- Bold Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 0 40px;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 260px;
}

.btn-primary {
  background-color: var(--color-accent);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 8px 24px rgba(232, 122, 67, 0.25);
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(232, 122, 67, 0.35);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-border);
}

.btn-outline:hover {
  border-color: var(--color-accent);
  background-color: #3A4230;
}

.btn-insta {
  gap: 8px;
}

.btn-block {
  width: 100%;
}

/* --- Modals Common --- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 26, 15, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal-content {
  position: relative;
  width: 100%;
  background: var(--color-surface);
  color: var(--color-text-surface);
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
}

.modal-close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: #1E2419;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  color: var(--color-text-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.modal-close-btn:hover {
  background: var(--color-border);
  transform: rotate(90deg);
}

/* --- Contact Modal Specific --- */
.modal-content--contact {
  max-width: 600px;
  padding: 64px 48px;
  overflow: hidden; /* コンタクトのみはみ出しを隠す */
}

/* --- Form Styles --- */
.modal-body h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
  text-align: center;
  margin-bottom: 16px;
}

.modal-sub {
  color: var(--color-text-mut);
  margin-bottom: 48px;
  text-align: center;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text-surface);
}

.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form textarea {
  width: 100%;
  padding: 16px 20px;
  background-color: #1E2419;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-text-surface);
  transition: all 0.3s;
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #6A7A5A;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  background-color: var(--color-surface);
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(232, 122, 67, 0.15);
}

.consent-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 32px;
  color: var(--color-text-mut);
}

.consent-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-accent);
}

.link {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.error {
  color: #FF5E5E;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 8px;
  display: block;
}

.success-message {
  margin-top: 24px;
  padding: 16px;
  background-color: #242A1D;
  color: var(--color-accent);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
}

/* --- Animations --- */
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =========================================================
   📺 CRT TV (ブラウン管テレビ風動画モーダル) 
========================================================= */
.modal-content--video {
  max-width: 900px;
  background: transparent;
  box-shadow: none;
  /* 閉じるボタンを外側に出すため、hiddenにしない */
  overflow: visible !important; 
}

/* テレビの外枠 */
.crt-casing {
  background: linear-gradient(135deg, #4C5741, #2E3526);
  border-radius: 32px;
  padding: 32px 24px 32px 32px;
  display: flex;
  gap: 24px;
  box-shadow: 
    inset 0 4px 12px rgba(255, 255, 255, 0.1),
    inset 0 -8px 16px rgba(0, 0, 0, 0.6),
    0 32px 80px rgba(0, 0, 0, 0.8);
  border: 2px solid #1E2419;
}

/* 画面の黒いフチ部分 */
.crt-screen-bezel {
  flex: 1;
  background: #0a0a0a;
  border-radius: 40px; 
  padding: 16px;
  box-shadow: 
    inset 0 8px 16px rgba(0,0,0,0.9),
    0 2px 4px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3; 
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ブラウン管のガラス反射と走査線エフェクト */
.crt-glass {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none; 
  background: 
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.6) 100%);
  background-size: 100% 4px, 100% 100%;
  border-radius: 24px;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.9);
  animation: crtScanlines 10s linear infinite;
}

/* YouTubeを中央に配置 */
.video-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 24px;
  overflow: hidden;
}

.video-wrapper iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  border-radius: 8px; 
}

/* 右側の操作パネル */
.crt-panel {
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding-top: 16px;
}

/* チャンネルダイヤル */
.crt-dial {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3A4230, #1E2419);
  border-radius: 50%;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.6),
    inset 0 2px 4px rgba(255,255,255,0.1);
  position: relative;
}

.crt-dial::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 12px;
  background: var(--color-accent); 
  border-radius: 2px;
}

/* スピーカーの溝 */
.crt-speaker {
  flex: 1;
  width: 32px;
  margin-bottom: 16px;
  background: repeating-linear-gradient(
    to bottom,
    #1E2419,
    #1E2419 4px,
    transparent 4px,
    transparent 8px
  );
  border-radius: 4px;
  opacity: 0.8;
}

@keyframes crtScanlines {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 0 100px, 0 0; }
}

/* テレビモーダル用の閉じるボタン配置 */
.modal-close-btn--video {
  top: -64px;
  right: 0;
  background: var(--color-accent);
  color: #FFF;
}

.modal-close-btn--video:hover {
  background: var(--color-accent-hover);
  transform: rotate(90deg) scale(1.1);
}

/* --- Responsive (スマホ用) --- */
@media (max-width: 768px) {
  .header-inner { padding: 0 24px; }
  .nav { gap: 24px; }
  .nav a:not(.nav-social) { display: none; }
  .nav-social::before { display: none; }
  .nav-social span { display: none; }
  .hero-title { font-size: clamp(2rem, 12vw, 3.5rem); }
  .hero-subtitle { font-size: 1.4rem; }
  .section { padding: 80px 0; }
  .contact-box-inner { padding: 56px 24px; border-radius: 20px; }
  .contact-title { font-size: 2.2rem; }
  .contact-actions { flex-direction: column; }
  .btn { width: 100%; min-width: auto; }
  .modal-content--contact { padding: 40px 24px; }
  
  /* スマホ用テレビレイアウト */
  .crt-casing {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
  .crt-panel {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    padding-top: 0;
  }
  .crt-dial {
    width: 40px;
    height: 40px;
  }
  .crt-speaker {
    height: 32px;
    width: 100px;
    margin-bottom: 0;
    background: repeating-linear-gradient(
      to right,
      #1E2419,
      #1E2419 4px,
      transparent 4px,
      transparent 8px
    );
  }
}
</style>