import { defineStore } from 'pinia'
import category from '@renderer/api/category'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<CategoryItem[]>([])

  const fetchCategories = async (): Promise<void> => {
    try {
      const res = await category.getCategoryList()
      categoryList.value = res.data.categories
    } catch (error) {
      console.error(error)
    }
  }

  const createCategory = async (payload): Promise<void> => {
    try {
      await category.createCategory(payload)
      await fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const updateCategory = async (id: string, payload): Promise<void> => {
    try {
      await category.updateCategory(id, payload)
      await fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await category.deleteCategory(id)
      await fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const setDefaultCategory = async (id: string): Promise<void> => {
    try {
      await category.setDefaultCategory(id)
      await fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    categoryList,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setDefaultCategory
  }
})
