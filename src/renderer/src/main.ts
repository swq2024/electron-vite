import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { errorHandler } from './error'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:uno.css'
import { setupRouterGuard } from './router/guard'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 恢复登录态
const authStore = useAuthStore()
await authStore.initAuth()

errorHandler(app)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000
})
setupRouterGuard(router)
app.use(router)
app.mount('#app')
