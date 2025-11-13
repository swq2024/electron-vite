import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { errorHandler } from './error'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
errorHandler(app)

app.mount('#app')
