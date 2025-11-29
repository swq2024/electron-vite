import { useAuthStore } from '@renderer/stores/auth'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  Router
} from 'vue-router'

let isAuthInited = false
export const createPermissionGuard = (router: Router): void => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore()

      // 全局初始化：仅首次执行，恢复token
      if (!isAuthInited) {
        try {
          await authStore.initAuth()
        } catch (error) {
          console.error('Auth initialization failed:', error)
        } finally {
          isAuthInited = true
        }
      }

      const isLoggedIn = !!authStore.accessToken
      // 判断目标是否为登录页 (建议统一用 path 或 meta 判断，这里保留 meta 逻辑)
      const isGoingToLogin = to.meta.isLoginPage || to.path === '/login'
      // 判断目标是否需要鉴权 (默认如果不写 meta.requiresAuth 则视为公开页面，防止死循环)
      const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
      try {
        // 2. 已登录的情况
        if (isLoggedIn) {
          if (isGoingToLogin) {
            // 已登录用户访问登录页，强制跳回首页或来源页
            // 去掉 from.meta.requiresAuth 判断。只要已登录，就不该访问登录页
            next({ path: '/' })
          } else {
            // 正常访问其他页面
            next()
          }
          return
        }
        // 3. 未登录的情况
        if (requiresAuth) {
          // 添加 redirect 参数，登录后自动跳回原本想访问的页面
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          // 访问白名单页面（如 404、关于我们等不需要登录的页面）
          next()
        }
      } catch (error) {
        console.error('路由守卫异常：', error)
        // 发生严重错误时，通常安全起见重定向到登录页或放行
        next(false)
      }
    }
  )
}
