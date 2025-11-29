import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import auth from '@renderer/api/auth'
import servers from '@renderer/utils/request'
import { ElMessage } from 'element-plus'
import users from '@renderer/api/user'
import { AxiosError } from 'axios'
// import { jwtDecode } from 'jwt-decode'
// import type { JwtPayload } from '../types/jwt'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // --- State ---
    const accessToken = ref<string | null>(null) // 存储accessToken
    const isRefreshing = ref<boolean>(false)
    const userInfo = ref<IUser | null>(null)

    // --- Getters ---
    const isAuthenticated = computed(() => !!accessToken.value)

    // --- Actions ---
    const setToken = (_accessToken: string): void => {
      accessToken.value = _accessToken
    }
    const setUserInfo = (_user): void => {
      userInfo.value = _user
    }

    const initAuth = async (): Promise<void> => {
      try {
        const storedToken = await window.authAPI.getTokens()
        if (storedToken) {
          accessToken.value = storedToken.accessToken
          try {
            await fetchUserProfile()
          } catch (error) {
            console.error('Error fetching user profile:', error)
          }
        }
      } catch (error) {
        console.error('Error initializing user store:', error)
      }
    }

    const handleLogin = async (data: { username: string; password: string }): Promise<boolean> => {
      try {
        const response = await auth.loginApi(data)
        const { accessToken, refreshToken } = response.data

        await window.authAPI.saveTokens({ accessToken, refreshToken })

        setToken(accessToken)

        await fetchUserProfile()

        return true
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error('Error logging in:', error)
          ElMessage.error(error?.response?.data?.message)
        }
        return false
      }
    }

    const logout = async (): Promise<void> => {
      try {
        await window.authAPI.removeTokens()

        const response = await auth.logoutApi()

        accessToken.value = null
        userInfo.value = null
        isRefreshing.value = false

        ElMessage.success(response?.message)
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error('Error logging out:', error)
          ElMessage.error(error?.response?.data?.message)
        }
      }
    }

    const refreshAccessToken = async (): Promise<string | null> => {
      if (isRefreshing.value) {
        return null // 如果正在刷新，则直接返回null以避免递归调用
      }

      isRefreshing.value = true // 设置刷新状态为true，防止递归调用
      const tokens = await window.authAPI.getTokens()

      if (!tokens || !tokens.refreshToken) {
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
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        await window.authAPI.saveTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        })

        accessToken.value = newAccessToken

        return newAccessToken
      } catch (error) {
        console.error('Error refreshing access token:', error)
        throw error
      } finally {
        isRefreshing.value = false
      }
    }

    const fetchUserProfile = async (): Promise<IUser | void> => {
      if (userInfo.value?.username) return userInfo.value
      if (!accessToken.value) throw new Error('No access token available.')
      try {
        const response = await users.getProfile()
        setUserInfo(response.data.user)
        return response.data.user
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    return {
      accessToken,
      userInfo,
      isRefreshing,
      isAuthenticated,
      setToken,
      handleLogin,
      logout,
      initAuth,
      refreshAccessToken,
      fetchUserProfile
    }
  },
  {
    persist: {
      pick: ['userInfo'],
      storage: sessionStorage
    }
  }
)
