import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import './components/rpg-style.css'

const app = createApp(App)
app.use(createPinia())

app.config.errorHandler = (error, _instance, info) => {
  console.error(`[STISMAP] Error pada UI (${info}):`, error)
}

app.mount('#app')
