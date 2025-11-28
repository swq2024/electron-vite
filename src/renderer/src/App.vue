<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()

const handleResize = async (newPath: string): Promise<void> => {
  const isLoginPage = newPath === '/login'
  // 向 Electron 主进程发送窗口调整指令
  await window.authAPI.windowResize({
    width: isLoginPage ? 500 : 1000,
    height: isLoginPage ? 500 : 800,
    resizable: !isLoginPage
  })
}
const debouncedResize = useDebounceFn(handleResize, 100)
watch(
  () => route.path,
  (newPath) => {
    debouncedResize(newPath)
  },
  { immediate: true } // 立即执行一次（应用启动时初始化窗口大小）
)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
