import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import password from '@renderer/api/password'

export const usePwdStore = defineStore('password', () => {
  const passwordList = ref<PasswordItem[]>([])
  const pagination = ref<Pagination>()

  const currentPage = shallowRef(1)
  const pageSize = shallowRef(1)

  const setPasswordList = (newList: []): void => {
    passwordList.value = newList
  }

  const setPagination = (newPagination: Pagination): void => {
    pagination.value = newPagination
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
      setPagination(response.data.pagination)
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

  const getUserFavorites = async (): Promise<void> => {}

  return {
    passwordList,
    pagination,
    currentPage,
    pageSize,
    getPasswordList,
    toggleFavorite,
    getUserFavorites
  }
})
