import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'root', component: () => import('@renderer/components/LandingPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@renderer/views/404.vue') }
]

export default routes
