import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import password from '@renderer/api/password'

export const usePwdStore = defineStore('password', () => {
  const passwordList = ref<PasswordItem[]>([])

  const total = ref(0)
  const currentPage = shallowRef(1)
  const pageSize = shallowRef(1)

  const setPasswordList = (newList: []): void => {
    passwordList.value = newList
  }

  const getPasswordList = async (params = {}): Promise<void> => {
    try {
      const response = await password.getPasswordList({
        ...params,
        currentPage: currentPage.value,
        pageSize: pageSize.value
      })
      setPasswordList(
        response.data.passwords.map((item: PasswordItem) => ({
          ...item,
          showPassword: false
        }))
      )
      total.value = response.data.pagination.total
    } catch (error) {
      console.error(error)
    }
  }

  const toggleFavorite = async (id: string): Promise<void> => {
    try {
      await password.toggleFavorite(id)
      await getPasswordList()
    } catch (error) {
      console.error(error)
    }
  }

  const createPassword = async (data: PasswordForm): Promise<void> => {
    try {
      await password.createPassword(data)
      await getPasswordList()
    } catch (error) {
      console.error(error)
    }
  }

  const updatePassword = async (id: string, data: PasswordForm): Promise<void> => {
    try {
      await password.updatePassword(id, data)
      await getPasswordList()
    } catch (error) {
      console.error(error)
    }
  }

  const deletePassword = async (id: string): Promise<void> => {
    try {
      await password.deletePassword(id)
      await getPasswordList()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    passwordList,
    total,
    currentPage,
    pageSize,
    getPasswordList,
    toggleFavorite,
    createPassword,
    updatePassword,
    deletePassword
  }
})
