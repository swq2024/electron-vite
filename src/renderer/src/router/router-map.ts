import { RouteRecordRaw } from 'vue-router'
import LandingPage from '@renderer/layouts/LandingPage.vue'
import DataBoard from '@renderer/layouts/DataBoard.vue'
import GeneralView from '@renderer/views/GeneralView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
    meta: { title: 'Home' },
    children: [
      {
        path: '',
        name: 'databoard',
        component: DataBoard,
        meta: { title: '数据面板' }
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@renderer/views/PasswordPage.vue'),
        meta: { title: '所有密码' }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@renderer/views/CategoryPage.vue'),
        meta: { title: '我的分类' }
      },
      {
        path: 'collection',
        name: 'collection',
        component: () => import('@renderer/views/CollectionPage.vue'),
        meta: { title: '我的收藏' }
      },
      {
        path: 'trash',
        name: 'trash',
        component: () => import('@renderer/views/TrashPage.vue'),
        meta: { title: '回收站' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@renderer/views/SettingsPage.vue'),
        meta: { title: '应用设置' },
        children: [
          {
            path: '',
            name: 'general',
            component: GeneralView,
            meta: { title: '基础设置' }
          },
          {
            path: 'session',
            name: 'session',
            component: () => import('@renderer/views/SessionPage.vue'),
            meta: { title: '会话列表' }
          },
          {
            path: 'session/:id',
            name: 'session-detail',
            component: () => import('@renderer/views/components/SessionDetailView.vue'),
            meta: {
              title: '会话详情',
              breadcrumb: [
                { title: '应用设置', path: '/settings' },
                { title: '会话列表', path: '/settings/session' },
                { title: '会话详情', path: '' } // 最后一个可以留空 path，表示当前页
              ]
            }
          },
          {
            path: 'masterPasswd',
            name: 'masterPasswd',
            component: () => import('@renderer/views/components/MasterPasswdView.vue'),
            meta: { title: '主密码设置' }
          }
        ]
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@renderer/views/404.vue') }
]

export default routes
