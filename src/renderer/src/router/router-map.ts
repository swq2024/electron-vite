import { RouteRecordRaw } from 'vue-router'
import LandingPage from '@renderer/layouts/LandingPage.vue'
import DashBoard from '@renderer/layouts/DashBoard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    meta: { title: 'Home' },
    children: [
      {
        path: 'databoard',
        name: 'dashboard',
        component: DashBoard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@renderer/views/PasswordPage.vue'),
        meta: { title: 'Password' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@renderer/views/404.vue') }
]

export default routes
