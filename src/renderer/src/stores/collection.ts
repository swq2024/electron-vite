import { defineStore } from 'pinia'
import { ref } from 'vue'
import password from '@renderer/api/password'

export const useCollectStore = defineStore('collection', () => {
  const collections = ref<CollectionPassword[]>([])

  const fetchCollectedPassword = async (): Promise<void> => {
    try {
      const response = await password.getUserFavorites()
      collections.value = response.data.decryptedPasswords
    } catch (error) {
      console.error('Error fetching passwords:', error)
    }
  }

  const toggleCollection = async (id: string): Promise<void> => {
    try {
      await password.toggleFavorite(id)
      await fetchCollectedPassword()
    } catch (error) {
      console.error('Error toggling collection:', error)
    }
  }

  return {
    collections,
    fetchCollectedPassword,
    toggleCollection
  }
})
