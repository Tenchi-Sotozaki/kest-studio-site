import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

const loader = document.getElementById('app-loading')
if (loader) {
  loader.classList.add('is-hidden')
  setTimeout(() => loader.remove(), 800)
}