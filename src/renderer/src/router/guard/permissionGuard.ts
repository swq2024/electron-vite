import { useAuthStore } from '@renderer/stores/auth'
import { ref } from 'vue'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  Router
} from 'vue-router'

const hasGetUserInfo = ref(false)
export const createPermissionGuard = (router: Router): void => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      try {
        const authStore = useAuthStore()
        const isLoggedIn = !!authStore.accessToken
        // 我既然使用safeStorage进行本地存储并且是Electron应用，
        if (isLoggedIn && to.meta.isLoginPage && !from.meta.requiresAuth) {
          next('/')
          return
        }

        if (!isLoggedIn && to.meta.requiresAuth) {
          next('/login')
          return
        }

        if (!hasGetUserInfo.value) {
          const userInfo = await authStore.getProfile()
          console.log('获取用户信息：', userInfo)
          // authStore.setUser(userInfo)
          hasGetUserInfo.value = true
        }

        next()
      } catch (error) {
        hasGetUserInfo.value = false
        console.error('权限守卫错误：', error)
      }
    }
  )
}
