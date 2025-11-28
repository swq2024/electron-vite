import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import auth from '@renderer/api/auth'
import users from '@renderer/api/user'
import servers from '@renderer/utils/request'
// import { jwtDecode } from 'jwt-decode'
// import type { JwtPayload } from '../types/jwt'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // --- State ---
    const accessToken = ref<string | null>(null) // 存储accessToken
    const user = ref<IUser | null>(null)
    const isRefreshing = ref<boolean>(false)

    // --- Getters ---
    const isAuthenticated = computed(() => !!accessToken.value)

    // --- Actions ---
    const setToken = (_accessToken: string): void => {
      accessToken.value = _accessToken
    }

    const setUser = (_user): void => {
      user.value = _user
    }

    const initAuth = async (): Promise<void> => {
      try {
        const storedToken = await window.authAPI.getTokens()
        if (storedToken) {
          accessToken.value = storedToken.accessToken
          // 可以在这里调用一个API来获取用户信息并验证token有效性
          // try {
          // await fetchUserProfile();
          // } catch (error) {
          // token 已过期或无效，则退出登录
          // await logout()
          // }
        }
      } catch (error) {
        console.error('Error initializing user store:', error)
      }
    }

    const handleLogin = async (data): Promise<boolean> => {
      try {
        const response = await auth.loginApi(data)
        const { accessToken, refreshToken } = response.data.data

        await window.authAPI.saveTokens({ accessToken, refreshToken })

        setToken(accessToken)

        return Promise.resolve(response.data.status)
      } catch (error) {
        await logout()
        return Promise.reject(error)
      }
    }

    const logout = async (): Promise<void> => {
      await window.authAPI.removeTokens()

      accessToken.value = null
      user.value = null
      isRefreshing.value = false

      // router.push('/login')

      console.log('User logged out')
    }

    const refreshAccessToken = async (): Promise<string | null> => {
      if (isRefreshing.value) {
        return null // 如果正在刷新，则直接返回null以避免递归调用
      }

      isRefreshing.value = true // 设置刷新状态为true，防止递归调用
      const tokens = await window.authAPI.getTokens()

      if (!tokens || !tokens.refreshToken) {
        await logout()
        throw new Error('No refresh token available.')
      }
      try {
        const response = await servers.post(
          'http://localhost:3000/api/auth/refresh',
          {
            refreshToken: tokens.refreshToken
          },
          { isRefreshTokenRequest: true }
        )
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data

        await window.authAPI.saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        })

        accessToken.value = newAccessToken

        return newAccessToken
      } catch (error) {
        await logout() // 如果刷新失败，则退出登录
        throw error // 抛出错误，以便调用者可以处理
      } finally {
        isRefreshing.value = false
      }
    }

    const getProfile = async (): Promise<void> => {
      try {
        const response = await users.getProfile()
        return response.data.data
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    return {
      accessToken,
      user,
      isRefreshing,
      isAuthenticated,
      setToken,
      setUser,
      handleLogin,
      logout,
      initAuth,
      refreshAccessToken,
      getProfile
    }
  }
  // {
  //   persist: {
  //     pick: ['accessToken'],
  //     storage: sessionStorage
  //   }
  // }
)
