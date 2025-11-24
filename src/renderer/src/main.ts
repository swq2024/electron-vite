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

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
setupRouterGuard(router)
errorHandler(app)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000
})

// 初始化用户状态，从本地存储(用户数据目录下[C:\Users\username\AppData\Roaming\my-app\tokens.enc])读取token
useAuthStore()
  .initialize()
  .then(() => {
    console.log('Auth store initialized. Starting app...')
    app.mount('#app')
  })
  .catch((error) => {
    console.error('Failed to initialize user store:', error)
    app.mount('#app')
  })
