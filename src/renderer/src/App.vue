<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.path,
  (newPath) => {
    const isLoginPage = newPath === '/login'
    // 向 Electron 主进程发送窗口调整指令
    window.electronAPI.loginWindowResize('resize-window', {
      width: isLoginPage ? 500 : 1000,
      height: isLoginPage ? 500 : 800,
      resizable: !isLoginPage
    })
  },
  { immediate: true } // 立即执行一次（应用启动时初始化窗口大小）
)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
