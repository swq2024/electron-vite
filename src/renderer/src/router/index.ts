import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('@renderer/components/HomeView.vue') },
  { path: '/notfound', component: () => import('@renderer/views/404.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
