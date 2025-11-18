import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref(false)
  const asideWidth = ref('180px')

  const toggleCollapse = (): void => {
    isCollapse.value = !isCollapse.value
  }

  const changeAsideWidth = (): void => {
    asideWidth.value = asideWidth.value === '180px' ? '64px' : '180px'
  }

  return {
    isCollapse,
    asideWidth,
    toggleCollapse,
    changeAsideWidth
  }
})
