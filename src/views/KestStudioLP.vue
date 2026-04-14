<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import portfolioData from '../components/portfolio.json';

// --- State Management ---
const isContactModalOpen = ref(false);
const isVideoModalOpen = ref(false);
const currentVideo = ref(null);
const modalTriggerElement = ref(null);
const isScrolled = ref(false);

// ★ショート動画用のモーダル状態
const isShortModalOpen = ref(false);
const currentShortId = ref('');

// --- ★nicopi風 横スクロール用の状態 ---
const shortVideoSection = ref(null);
const horizontalTrack = ref(null); 

const shortVideos = [
  { youtubeId: 'XihcgtAgbD4', title: 'HOTEIYA', category: 'Sandwich Stand' },
  { youtubeId: '5SvSdn6lqN0', title: 'Gen Sekikawa', category: 'Running' },
  { youtubeId: 'nNoFhJRY0HQ', title: 'White Seed', category: 'Craft Beer' },
  { youtubeId: 'C4zgfmj39yU', title: 'Kai Yuki', category: 'Haircut Short Film' },
  { youtubeId: 'ILTHCawTXQA', title: 'Hatate Takeru Skateboarding', category: 'Short Film' },
  { youtubeId: 'SLo4-y1plug', title: '亀仙人', category: 'Vlog' },
  { youtubeId: 'gX_AfG1kw3Y', title: '函館市水産物卸売市場', category: 'Cinematic' }
];

const fontList = [
  "'Cormorant Garamond', serif",
  "'Zen Kaku Gothic New', sans-serif",
  "Arial, Helvetica, sans-serif",
  "'Times New Roman', Times, serif",
  "'Courier New', Courier, monospace",
  "Georgia, serif",
  "Verdana, Geneva, sans-serif",
  "'Trebuchet MS', Helvetica, sans-serif",
  "Impact, Charcoal, sans-serif",
  "'Arial Black', Gadget, sans-serif",
  "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
  "Tahoma, Geneva, sans-serif",
  "'Lucida Console', Monaco, monospace",
  "Garamond, serif",
  "'Comic Sans MS', cursive, sans-serif",
  "'Brush Script MT', cursive",
  "Baskerville, 'Baskerville Old Face', serif",
  "Optima, sans-serif",
  "'Bodoni MT', Didot, 'Didot LT STD', serif",
  "Copperplate, 'Copperplate Gothic Light', fantasy",
  "Papyrus, fantasy",
  "'Century Gothic', sans-serif",
  "Consolas, monaco, monospace",
  "Cambria, Georgia, serif",
  "Candara, Calibri, sans-serif",
  "'Franklin Gothic Medium', 'Arial Narrow', sans-serif",
  "Futura, 'Trebuchet MS', Arial, sans-serif",
  "Rockwell, 'Courier Bold', Courier, Georgia, Times, 'Times New Roman', serif",
  "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
];

const currentHeroFont = ref(fontList[0]);
let fontInterval = null;
let headerHeightRaf = 0;

const updateHeaderHeightVar = () => {
  const headerEl = document.querySelector('.header');
  const h = headerEl?.getBoundingClientRect().height;
  if (!h) return;
  document.documentElement.style.setProperty('--kest-header-h', `${Math.round(h)}px`);
};

// --- Methods ---
const openVideoModal = (item, event) => {
  currentVideo.value = item;
  isVideoModalOpen.value = true;
  modalTriggerElement.value = event?.currentTarget || null;
  nextTick(() => {
    const closeBtn = document.querySelector('.modal-close-btn--video');
    if (closeBtn) closeBtn.focus();
  });
  document.body.style.overflow = 'hidden';
};

const closeVideoModal = () => {
  isVideoModalOpen.value = false;
  currentVideo.value = null;
  document.body.style.overflow = '';
  if (modalTriggerElement.value) modalTriggerElement.value.focus();
};

const openShortModal = (youtubeId, event) => {
  currentShortId.value = youtubeId;
  isShortModalOpen.value = true;
  modalTriggerElement.value = event?.currentTarget || null;
  nextTick(() => {
    const closeBtn = document.querySelector('.modal-close-btn--short');
    if (closeBtn) closeBtn.focus();
  });
  document.body.style.overflow = 'hidden';
};

const closeShortModal = () => {
  isShortModalOpen.value = false;
  currentShortId.value = '';
  document.body.style.overflow = '';
  if (modalTriggerElement.value) modalTriggerElement.value.focus();
};

const openContactModal = (event) => {
  isContactModalOpen.value = true;
  modalTriggerElement.value = event?.currentTarget || null;
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
    else if (isShortModalOpen.value) closeShortModal();
    else if (isContactModalOpen.value) closeContactModal();
  }
};

// --- スライド計算 ---
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
  if (headerHeightRaf) cancelAnimationFrame(headerHeightRaf);
  headerHeightRaf = requestAnimationFrame(() => {
    updateHeaderHeightVar();
  });

  if (shortVideoSection.value && horizontalTrack.value) {
    const rect = shortVideoSection.value.getBoundingClientRect();
    const sectionTop = rect.top;
    const scrollDistance = rect.height - window.innerHeight;

    let progress = 0;
    if (sectionTop <= 0 && sectionTop >= -scrollDistance) {
      progress = Math.abs(sectionTop) / scrollDistance;
    } else if (sectionTop > 0) {
      progress = 0;
    } else {
      progress = 1;
    }

    const trackWidth = horizontalTrack.value.scrollWidth;
    const windowWidth = window.innerWidth;
    const maxTranslate = trackWidth - windowWidth;
    const translateX = progress * maxTranslate;

    horizontalTrack.value.style.transform = `translate3d(-${translateX}px, 0, 0)`;
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

const resetContact = () => {
  contact.value = { name: '', email: '', message: '', consent: false };
  contactErrors.value = {};
  submitSuccess.value = false;
};

// --- Netlify Form Submit ---
const submitContact = async () => {
  if (!validateContact()) return;
  isSubmitting.value = true;
  submitSuccess.value = false;

  try {
    const formData = new URLSearchParams();
    formData.append('form-name', 'contact');
    formData.append('name', contact.value.name);
    formData.append('email', contact.value.email);
    formData.append('message', contact.value.message);

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
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  
  setTimeout(handleScroll, 50); 
  setTimeout(updateHeaderHeightVar, 0);

  let lastIndex = 0;
  fontInterval = setInterval(() => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * fontList.length);
    } while (randomIndex === lastIndex);
    
    lastIndex = randomIndex;
    currentHeroFont.value = fontList[randomIndex];
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);

  if (headerHeightRaf) cancelAnimationFrame(headerHeightRaf);
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
          <a href="#shorts">Shorts</a>
          <a href="#portfolio">Works</a>
          <a href="#contact">Contact</a>
          
          <a href="https://www.youtube.com/channel/UCH-4ben4UmUS8ZpEylbhRFQ" target="_blank" rel="noopener noreferrer" class="nav-social">
            <svg class="icon-youtube" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
            <span>YouTube</span>
          </a>

          <a href="https://www.instagram.com/kest_films/" target="_blank" rel="noopener noreferrer" class="nav-social">
            <svg class="icon-insta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
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
        <p class="hero-copy fade-in delay-3">
          Journey to Inspiration,<br />
          <em>Driven by Our Films.</em>
        </p>
      </div>
      <div class="scroll-indicator fade-in delay-3">
        <div class="scroll-ring">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <path id="textPath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
            <text fill="#0c0c0c" font-size="11" font-weight="700" letter-spacing="0.12em">
              <textPath href="#textPath" startOffset="0" textLength="250">
                SCROLL DOWN • SCROLL DOWN • 
              </textPath>
            </text>
          </svg>
          <div class="scroll-line-center"></div>
        </div>
      </div>
    </div>

    <section id="shorts" class="shorts-section" ref="shortVideoSection">
      <div class="shorts-sticky">
        <div class="shorts-header fade-in-scroll">
          <h2>Shorts video</h2>
        </div>
        <div class="shorts-stage">
          <div class="shorts-track-container">
            <div class="shorts-track" ref="horizontalTrack">
              
              <article 
                v-for="(video, index) in shortVideos" 
                :key="index" 
                class="short-card-wrapper"
              >
                <div class="short-card-inner">
                  <div 
                    class="short-thumb"
                    @click="(e) => openShortModal(video.youtubeId, e)"
                    tabindex="0"
                    @keydown.enter="(e) => openShortModal(video.youtubeId, e)"
                    :aria-label="`${video.title}を全画面で再生する`"
                  >
                    <img 
                      v-if="video.youtubeId"
                      :src="`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`" 
                      class="real-video"
                      alt="thumbnail"
                    />
                    <div v-else class="short-dummy-bg"></div>
                    
                    <div class="card-overlay">
                      <div class="play-button">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div class="short-info">
                    <h3>{{ video.title }}</h3>
                    <span class="category">{{ video.category }}</span>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </div>
        
      </div>
    </section>

    <!-- <section id="portfolio" class="portfolio section">
      <div class="container">
        <div class="section-header fade-in-scroll">
          <span class="sub-title">Long Works</span>
          <h2>手がけた映像</h2>
        </div>

        <div class="grid">
          <article v-for="item in portfolioData" :key="item.id" class="card">
            <div 
              class="card-thumb" 
              @click="(e) => openVideoModal(item, e)" 
              tabindex="0"
              @keydown.enter="(e) => openVideoModal(item, e)"
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
    </section> -->

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

              <a href="https://www.youtube.com/channel/UCH-4ben4UmUS8ZpEylbhRFQ" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-social">
                <svg class="icon-youtube" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                YouTube
              </a>
              
              <a href="https://www.instagram.com/kest_films/" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-social">
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
        <div class="modal-content modal-content--modern-video">
          <button class="modal-close-btn modal-close-btn--video" @click="closeVideoModal" aria-label="閉じる">✕</button>
          <div class="video-wrapper">
            <iframe v-if="currentVideo" 
              :src="`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`"
              title="YouTube video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
          <div v-if="currentVideo" class="video-credits">
            <div class="video-credits-meta">
              <span class="video-credits-category">{{ currentVideo.category }}</span>
              <h3 class="video-credits-title">{{ currentVideo.title }}</h3>
            </div>
            <dl v-if="currentVideo.credits" class="credits-list">
              <template v-for="(name, role) in currentVideo.credits" :key="role">
                <div v-if="name" class="credits-row">
                  <dt class="credits-role">{{ role }}</dt>
                  <dd class="credits-name">{{ name }}</dd>
                </div>
              </template>
            </dl>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade-modal">
      <div v-if="isShortModalOpen" class="modal-backdrop" @click.self="closeShortModal" role="dialog" aria-modal="true">
        <div class="modal-content modal-content--short-video">
          <button class="modal-close-btn modal-close-btn--short" @click="closeShortModal" aria-label="閉じる">✕</button>
          <div class="short-video-wrapper">
            <iframe v-if="currentShortId" 
              :src="`https://www.youtube-nocookie.com/embed/${currentShortId}?autoplay=1&rel=0`"
              title="YouTube Short video player" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              style="width: 100%; height: 100%;">
            </iframe>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* --- Design Tokens & Resets --- */
.kest-studio {
  --color-paper: #f7f4ef;
  --color-ink: #0c0c0c;
  --color-ink-muted: rgba(12, 12, 12, 0.62);
  --color-surface: rgba(255, 255, 255, 0.55);
  --color-border: rgba(12, 12, 12, 0.12);
  --color-accent: #0c0c0c;
  --color-accent-hover: rgba(12, 12, 12, 0.7);

  --font-sans: 'Helvetica Neue', Arial, sans-serif;
  --font-en: 'Playfair Display', serif;
  
  font-family: var(--font-sans);
  color: var(--color-ink);
  line-height: 1.8;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;
  background: transparent;
}

/* --- Yuppa-style Yuba Background --- */
.yuba-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 10% 10%, rgba(0, 0, 0, 0.06), transparent 60%),
    radial-gradient(900px 600px at 90% 30%, rgba(0, 0, 0, 0.04), transparent 55%),
    radial-gradient(900px 800px at 30% 95%, rgba(0, 0, 0, 0.03), transparent 60%);
}

.yuba-shape {
  position: absolute;
  animation: morphYuba 20s ease-in-out infinite both alternate;
  transform-origin: center center;
}

.shape-1 { width: 120vw; height: 120vw; top: -40%; left: -20%; background: radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 0.06), transparent 55%); animation-delay: 0s; animation-duration: 25s; }
.shape-2 { width: 100vw; height: 100vw; bottom: -30%; right: -20%; background: radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0.05), transparent 60%); animation-delay: -5s; animation-duration: 22s; }
.shape-3 { width: 80vw; height: 80vw; top: 20%; left: 30%; background: radial-gradient(circle at 40% 50%, rgba(0, 0, 0, 0.04), transparent 62%); animation-delay: -10s; animation-duration: 18s; }

@keyframes morphYuba {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
  34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(45deg) scale(1.05); }
  67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(90deg) scale(0.95); }
  100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(135deg) scale(1); }
}

/* --- Noise Effect --- */
.noise-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2; opacity: 0.06; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }

*, *::before, *::after { box-sizing: border-box; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
.hero, .section, .footer, .shorts-section { position: relative; z-index: 1; }
.section { padding: 140px 0; }
h1, h2, h3 { margin: 0; line-height: 1.4; }
.section-header { text-align: center; }
.sub-title { display: block; font-family: var(--font-sans); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 16px; color: var(--color-ink-muted); }
.section-header h2 { font-family: var(--font-en); font-size: clamp(2.1rem, 4vw, 3.2rem); font-weight: 600; letter-spacing: -0.02em; }

/* --- Header --- */
.header { position: fixed; top: 0; left: 0; width: 100%; z-index: 50; transition: all 0.35s ease; padding: 20px 0; color: var(--color-ink); }
.header.is-scrolled { background-color: rgba(247, 244, 239, 0.72); backdrop-filter: blur(14px); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); padding: 14px 0; border-bottom: 1px solid var(--color-border); }
.header-inner { display: flex; justify-content: space-between; align-items: center; max-width: 1440px; margin: 0 auto; padding: 0 40px; }
.logo { font-family: var(--font-en); font-size: 1.65rem; font-weight: 600; letter-spacing: -0.01em; }
.header.is-scrolled .logo { color: var(--color-ink); }
.nav { display: flex; align-items: center; gap: 40px; }
.nav a { text-decoration: none; color: inherit; font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; transition: opacity 0.25s ease; }
.nav a:hover { opacity: 0.55; }
.nav-social { display: flex; align-items: center; gap: 8px; position: relative; }
.nav-social::before { content: ''; position: absolute; left: -20px; top: 50%; transform: translateY(-50%); width: 1px; height: 16px; background-color: currentColor; opacity: 0.4; }
.icon-insta, .icon-youtube { width: 1.2em; height: 1.2em; transition: transform 0.3s ease; }
.nav-social:hover .icon-insta, .nav-social:hover .icon-youtube { transform: scale(1.1); }

/* --- Hero --- */
.hero { height: 100vh; min-height: 700px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.hero-content { position: relative; z-index: 2; padding: 0 24px; }
.hero-title { font-family: var(--font-en); font-size: clamp(3.6rem, 9.2vw, 7.2rem); font-weight: 600; margin-bottom: 24px; letter-spacing: -0.03em; color: var(--color-ink); text-shadow: none; white-space: nowrap; }
.hero-copy {
  margin: 0 auto;
  max-width: 34rem;
  font-family: var(--font-sans);
  font-size: 0.98rem;
  line-height: 1.9;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.hero-copy em {
  font-family: var(--font-en);
  font-style: italic;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
.scroll-indicator { position: absolute; bottom: 32px; left: 50%; margin-left: -60px; z-index: 10; width: 120px; display: flex; justify-content: center; }
.scroll-ring { position: relative; width: 120px; height: 120px; }
.ring-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; animation: rotateText 14s linear infinite; }
.scroll-line-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 1px; height: 48px; background-color: transparent; overflow: hidden; }
.scroll-line-center::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #0c0c0c; animation: scrollDropCenter 2.5s cubic-bezier(0.65, 0, 0.35, 1) infinite; }

@keyframes rotateText { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes scrollDropCenter { 0% { transform: translateY(-100%); opacity: 0; } 20% { opacity: 1; } 80% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(100%); opacity: 0; } }

/* =========================================================
   🎞️ nicopiスタイル 横スクロールセクション
========================================================= */
.shorts-section {
  height: 400vh;
  background-color: transparent;
}

.shorts-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 100vh;
  width: 100vw;
  --shorts-header-space: 84px;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column; 
  align-items: center;     
  justify-content: center;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box; 
}

.shorts-sticky {
  --shorts-stage-shift-y: -48px;
}

.shorts-header {
  position: absolute;
  top: calc(var(--kest-header-h, 80px) + 18px); 
  left: 0;
  right: 0;
  width: min(1100px, calc(100% - 48px));
  margin: 0 auto;
  text-align: center;
  pointer-events: none;
  z-index: 3;
}
.shorts-header h2 {
  margin: 0;
}

.shorts-stage {
  width: 100%;
  display: flex;
  height: calc(100vh - var(--kest-header-h, 80px) - var(--shorts-header-space));
  padding-top: calc(var(--kest-header-h, 80px) + var(--shorts-header-space));
  align-items: center;
}

.shorts-track-container {
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  overflow: hidden;
  transform: translateY(var(--shorts-stage-shift-y, 0px));
}

.shorts-track {
  display: flex;
  gap: 128px; 
  padding: 0 15vw; 
  width: max-content; 
  will-change: transform;
}

.short-card-wrapper {
  width: 260px; 
  flex-shrink: 0; 
  cursor: pointer;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.short-card-wrapper:hover {
  transform: translateY(-10px);
}

.short-card-inner {
  width: 100%;
}

.short-thumb {
  position: relative;
  aspect-ratio: 9 / 16;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.16);
  background-color: rgba(12, 12, 12, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: box-shadow 0.4s ease; 
}

.short-dummy-bg { width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.02)); }
.short-card-wrapper:hover .short-thumb { box-shadow: 0 26px 90px rgba(0, 0, 0, 0.22); }

.short-info { 
  margin-top: 16px; 
  text-align: center; 
}
.short-info h3 { font-family: var(--font-en); font-size: 1.25rem; font-weight: 600; color: var(--color-ink); margin-bottom: 6px; letter-spacing: -0.01em; }
.short-info .category { font-family: var(--font-sans); font-size: 0.78rem; color: var(--color-ink-muted); letter-spacing: 0.18em; text-transform: uppercase; }

.real-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}

/* =========================================================
   Portfolio Grid (通常の横長映像)
========================================================= */
.portfolio { padding-top: 80px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px 32px; margin-top: 72px; }
.card { cursor: pointer; background: rgba(255, 255, 255, 0.55); border-radius: 18px; overflow: hidden; box-shadow: 0 18px 60px rgba(0, 0, 0, 0.12); border: 1px solid var(--color-border); transition: transform 0.35s ease, box-shadow 0.35s ease; backdrop-filter: blur(10px); }
.card:hover { transform: translateY(-6px); box-shadow: 0 26px 90px rgba(0, 0, 0, 0.16); }
.card-thumb { position: relative; aspect-ratio: 16 / 9; background-color: rgba(12, 12, 12, 0.92); overflow: hidden; }
.card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.card:hover .card-thumb img { transform: scale(1.05); }

.card-overlay { position: absolute; inset: 0; background: rgba(12, 12, 12, 0.38); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s ease; }
.card:hover .card-overlay, .short-card-wrapper:hover .card-overlay { opacity: 1; }
.play-button { width: 62px; height: 62px; background: rgba(247, 244, 239, 0.92); border-radius: 999px; display: flex; align-items: center; justify-content: center; color: #0c0c0c; transform: scale(0.86); transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 18px 50px rgba(0,0,0,0.35); }
.card:hover .play-button, .short-card-wrapper:hover .play-button { transform: scale(1); }
.play-icon { width: 24px; height: 24px; margin-left: 4px; }

.card-info { padding: 24px; text-align: left; }
.category { font-family: var(--font-sans); font-size: 0.78rem; font-weight: 600; color: var(--color-ink-muted); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px; display: block; }
.card-info h3 { font-family: var(--font-en); font-size: 1.45rem; font-weight: 600; color: var(--color-ink); letter-spacing: -0.01em; }

/* --- Contact Section --- */
.contact-box { display: flex; justify-content: center; }
.contact-box-inner { max-width: 900px; width: 100%; text-align: center; background-color: rgba(255, 255, 255, 0.55); color: var(--color-ink); padding: 84px 64px; border-radius: 26px; box-shadow: 0 26px 90px rgba(0, 0, 0, 0.12); border: 1px solid var(--color-border); backdrop-filter: blur(12px); }
.contact-title { font-family: var(--font-en); font-size: clamp(2.6rem, 4vw, 3.4rem); margin-bottom: 18px; font-weight: 600; color: var(--color-ink); letter-spacing: -0.02em; }
.contact-desc { color: var(--color-ink-muted); margin-bottom: 56px; font-size: 1.05rem; line-height: 1.8; }
.contact-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; height: 60px; padding: 0 40px; border-radius: 100px; font-size: 1rem; font-weight: 700; text-decoration: none; cursor: pointer; transition: all 0.3s ease; min-width: 260px; }
.btn-primary { background-color: #0c0c0c; color: #f7f4ef; border: 1px solid rgba(0, 0, 0, 0.25); box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18); }
.btn-primary:hover { background-color: rgba(12, 12, 12, 0.86); transform: translateY(-2px); box-shadow: 0 26px 90px rgba(0, 0, 0, 0.22); }
.btn-outline { background-color: transparent; color: #0c0c0c; border: 1px solid rgba(12, 12, 12, 0.22); }
.btn-outline:hover { border-color: rgba(12, 12, 12, 0.45); background-color: rgba(255, 255, 255, 0.35); }
.btn-social { gap: 8px; }
.btn-block { width: 100%; }

/* --- Modals Common --- */
.modal-backdrop { position: fixed; inset: 0; background: rgba(12, 12, 12, 0.78); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.modal-content { position: relative; width: 100%; background: rgba(247, 244, 239, 0.96); color: var(--color-ink); border-radius: 24px; box-shadow: 0 32px 100px rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.12); }
.modal-close-btn { position: absolute; top: 24px; right: 24px; width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 50%; font-size: 1.5rem; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; z-index: 10; }
.modal-close-btn:hover { background: var(--color-accent); transform: rotate(90deg); }

.modal-content--contact { max-width: 600px; padding: 64px 48px; overflow: hidden; }

/* 長編動画（16:9）用モーダル */
.modal-content--modern-video { max-width: 1100px; background: #0c0c0c; border-radius: 16px; overflow: hidden; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8); }
.modal-content--modern-video .modal-close-btn { top: 16px; right: 16px; background: rgba(0, 0, 0, 0.5); }
.modal-content--modern-video .modal-close-btn:hover { background: rgba(255, 255, 255, 0.2); }
.video-wrapper { width: 100%; aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; background: #000; }
.video-wrapper iframe { width: 100%; height: 100%; }

/* --- Video Credits Area --- */
.video-credits {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
  padding: 32px 40px;
  background: #0c0c0c;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.video-credits-meta {
  flex-shrink: 0;
}

.video-credits-category {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(247, 244, 239, 0.45);
  margin-bottom: 8px;
}

.video-credits-title {
  font-family: var(--font-en);
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #f7f4ef;
  line-height: 1.2;
}

.credits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 48px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.credits-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.credits-role {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(247, 244, 239, 0.4);
}

.credits-name {
  font-family: var(--font-en);
  font-size: 0.95rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: rgba(247, 244, 239, 0.85);
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .video-credits {
    flex-direction: column;
    gap: 24px;
    padding: 24px 20px;
  }
  .credits-list { gap: 16px 32px; }
  .video-credits-title { font-size: 1.25rem; }
}

/* ★ ショート動画（9:16）専用モーダル */
.modal-content--short-video { 
  background: #000; 
  border-radius: 16px; 
  overflow: hidden; 
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  height: 90vh;
  max-height: 900px;
  aspect-ratio: 9 / 16;
  margin: 0 auto; 
}
.modal-content--short-video .modal-close-btn { top: 16px; right: 16px; background: rgba(0, 0, 0, 0.5); }
.modal-content--short-video .modal-close-btn:hover { background: var(--color-accent); }
.short-video-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; }

/* --- Form Styles --- */
.modal-body h3 { font-family: var(--font-en); font-size: 2.2rem; font-weight: 600; color: #0c0c0c; text-align: center; margin-bottom: 16px; letter-spacing: -0.02em; }
.modal-sub { color: var(--color-ink-muted); margin-bottom: 48px; text-align: center; font-size: 0.95rem; }
.form-group { margin-bottom: 24px; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; color: var(--color-ink); letter-spacing: 0.12em; text-transform: uppercase; }
.contact-form input[type="text"], .contact-form input[type="email"], .contact-form textarea { width: 100%; padding: 16px 18px; background-color: rgba(255, 255, 255, 0.65); border: 1px solid rgba(12, 12, 12, 0.18); border-radius: 14px; font-family: var(--font-sans); font-size: 1rem; color: var(--color-ink); transition: all 0.25s; }
.contact-form input:focus, .contact-form textarea:focus { outline: none; background-color: rgba(255, 255, 255, 0.8); border-color: rgba(12, 12, 12, 0.45); box-shadow: 0 0 0 4px rgba(12, 12, 12, 0.08); }
.consent-label { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; cursor: pointer; margin-bottom: 32px; color: var(--color-ink-muted); }
.success-message { margin-top: 24px; padding: 16px; background-color: rgba(255, 255, 255, 0.65); color: #0c0c0c; border: 1px solid rgba(12, 12, 12, 0.16); border-radius: 14px; text-align: center; font-weight: 700; }

/* --- Animations --- */
.fade-modal-enter-active, .fade-modal-leave-active { transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
.fade-modal-enter-from, .fade-modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
.fade-in { opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.delay-3 { animation-delay: 0.3s; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

/* --- Responsive (スマホ用) --- */
@media (max-width: 768px) {
  .header-inner { padding: 0 24px; }
  .nav { gap: 24px; }
  .nav a:not(.nav-social) { display: none; }
  .nav-social::before { display: none; }
  .nav-social span { display: none; }
  .hero-title { font-size: clamp(2.4rem, 12vw, 3.8rem); }
  .section { padding: 80px 0; }
  .contact-box-inner { padding: 56px 24px; border-radius: 20px; }
  .contact-title { font-size: 2.2rem; }
  .contact-actions { flex-direction: column; }
  .btn { width: 100%; min-width: auto; }
  .modal-content--contact { padding: 40px 24px; }
  
  .shorts-track { padding: 0 10vw; gap: 64px; } 
  .short-card-wrapper { width: 200px; } 
  .shorts-sticky { --shorts-header-space: 72px; }
  .shorts-sticky { --shorts-stage-shift-y: -32px; }

  .modal-content--short-video {
    width: 90vw;
    height: auto;
    max-height: 85vh;
  }
}
</style>