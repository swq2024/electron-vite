import { RouteRecordRaw } from 'vue-router'
import LandingPage from '@renderer/layouts/LandingPage.vue'
import DataBoard from '@renderer/layouts/DataBoard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    redirect: 'databoard',
    meta: { title: 'Home' },
    children: [
      {
        path: 'databoard',
        name: 'databoard',
        component: DataBoard,
        meta: { title: 'DataBoard' }
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@renderer/views/PasswordPage.vue'),
        meta: { title: 'Password' }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@renderer/views/CategoryPage.vue'),
        meta: { title: 'Category' }
      },
      {
        path: 'collection',
        name: 'collection',
        component: () => import('@renderer/views/CollectionPage.vue'),
        meta: { title: 'Collection' }
      },
      {
        path: 'trash',
        name: 'trash',
        component: () => import('@renderer/views/TrashPage.vue'),
        meta: { title: 'Trash' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@renderer/views/SettingsPage.vue'),
        meta: { title: 'Settings' }
      },
      {
        path: 'device',
        name: 'device',
        component: () => import('@renderer/views/DevicePage.vue'),
        meta: { title: 'Device' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@renderer/views/404.vue') }
]

export default routes
