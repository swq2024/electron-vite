import { defineStore } from 'pinia'
import { ref } from 'vue'
import password from '@renderer/api/password'

export const useTrashStore = defineStore('trash', () => {
  const trashList = ref<TrashPassword[]>([])

  const fetchTrashedPassword = async (): Promise<void> => {
    try {
      const response = await password.getTrashPasswords()
      trashList.value = response.data.passwords
    } catch (error) {
      console.error('Error fetching trashed passwords:', error)
    }
  }

  const restorePassword = async (id: string): Promise<void> => {
    try {
      await password.restorePassword(id)
      await fetchTrashedPassword()
    } catch (error) {
      console.error('Error restoring password:', error)
    }
  }

  const restorePasswords = async (ids: string[]): Promise<void> => {
    try {
      await password.restorePasswords(ids)
      await fetchTrashedPassword()
    } catch (error) {
      console.error('Error restoring passwords:', error)
    }
  }

  const forceDeletePassword = async (id: string): Promise<void> => {
    try {
      await password.forceDeletePassword(id)
      await fetchTrashedPassword()
    } catch (error) {
      console.error('Error force deleting password:', error)
    }
  }

  const forceDeletePasswords = async (ids: string[]): Promise<void> => {
    try {
      await password.forceDeletePasswords(ids)
      await fetchTrashedPassword()
    } catch (error) {
      console.error('Error force deleting passwords:', error)
    }
  }

  const emptyTrash = async (): Promise<void> => {
    try {
      await password.emptyTrash()
      await fetchTrashedPassword()
    } catch (error) {
      console.error('Error clearing trash:', error)
    }
  }

  return {
    trashList,
    fetchTrashedPassword,
    restorePassword,
    restorePasswords,
    forceDeletePassword,
    forceDeletePasswords,
    emptyTrash
  }
})
