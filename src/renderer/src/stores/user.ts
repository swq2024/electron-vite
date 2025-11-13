import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { computed, ref } from 'vue'
import type { JwtPayload } from '../types/jwt'

export const useUserStore = defineStore('user', () => {
  // --- State ---
  const token = ref<string | null>(null)
  const user = ref<IUser | null>(null)

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => user.value?.role === 'admin')

  const jti = computed(() => {
    if (!token.value) return null
    try {
      const decode = jwtDecode<JwtPayload>(token.value)
      return decode.jti
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  })

  // --- Actions ---
  const setToken = async (newToken: string): Promise<void> => {
    if (!newToken) {
      console.error('Error: Token cannot be null or undefined')
    }

    try {
      const decode = jwtDecode<JwtPayload>(newToken)
      const { userId, role } = decode

      token.value = newToken
      user.value = {
        id: userId,
        role
      }

      const result = await window.electronAPI.setToken(newToken)
      if (!result.success) {
        console.error('Failed to save token securely:', result.error)
        // 可以考虑给用户一个提示
      }

      console.log('Token set successfully')
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }

  const logout = async (): Promise<void> => {
    token.value = null
    user.value = null

    await window.electronAPI.removeToken()
    // router.push('/login')

    console.log('User logged out')
  }

  const initialize = async (): Promise<void> => {
    try {
      const storedToken = await window.electronAPI.getToken()
      if (storedToken) {
        setToken(storedToken)
        console.log('User state restored from secure storage')
      }
    } catch (error) {
      console.error('Error initializing user store:', error)
    }
  }

  return { token, user, jti, isAuthenticated, isAdmin, setToken, logout, initialize }
})
