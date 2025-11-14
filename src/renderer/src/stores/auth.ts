import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import auth from '@renderer/api/auth'
import users from '@renderer/api/user'
// import axios from 'axios'
import { apiServices } from '@renderer/utils/request'
// import { jwtDecode } from 'jwt-decode'
// import type { JwtPayload } from '../types/jwt'

export const useAuthStore = defineStore('user', () => {
  // --- State ---
  const accessToken = ref<string | null>(null) // 存储accessToken
  const user = ref<IUser | null>(null)
  const isRefreshing = ref<boolean>(false)

  // --- Getters ---
  const isAuthenticated = computed(() => !!accessToken.value)

  // --- Actions ---
  const setAuth = (_accessToken, _user): void => {
    accessToken.value = _accessToken
    user.value = _user
  }

  const handleLogin = async (data): Promise<void> => {
    try {
      const response = await auth.loginApi(data)
      const { accessToken, refreshToken, user } = response.data.data
      await window.electronAPI.saveTokens({ accessToken, refreshToken })

      setAuth(accessToken, user)

      console.log('RT', refreshToken)
      return Promise.resolve(response.data.success)
    } catch (error) {
      await logout()
      return Promise.reject(error)
    }
  }

  const logout = async (): Promise<void> => {
    await window.electronAPI.removeToken()

    accessToken.value = null
    user.value = null
    isRefreshing.value = false

    // router.push('/login')

    console.log('User logged out')
  }

  const initialize = async (): Promise<void> => {
    try {
      const storedToken = await window.electronAPI.getTokens()
      if (storedToken && storedToken.accessToken) {
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

  const refreshAccessToken = async (): Promise<string | null> => {
    if (isRefreshing.value) {
      return null // 如果正在刷新，则直接返回null以避免递归调用
    }

    isRefreshing.value = true
    const tokens = await window.electronAPI.getTokens()

    if (!tokens || !tokens.refreshToken) {
      await logout()
      throw new Error('No refresh token available.')
    }
    try {
      // 直接调用axios实例, 不通过拦截器处理
      const response = await apiServices.post(
        'http://localhost:3000/api/auth/refresh',
        {
          refreshToken: tokens.refreshToken
        }
        // { skipAuth: true }
      )
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data

      await window.electronAPI.saveTokens({
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
    setAuth,
    handleLogin,
    logout,
    initialize,
    refreshAccessToken,
    getProfile
  }
})
