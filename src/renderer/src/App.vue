<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const handleResize = async (newPath: string): Promise<void> => {
  const isLoginPage = newPath === '/login'
  // 向 Electron 主进程发送窗口调整指令
  await window.authAPI.windowResize({
    width: isLoginPage ? 500 : 1000,
    height: isLoginPage ? 500 : 700,
    resizable: !isLoginPage
  })
}
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 检查新的路径是否是登录页
    const isNewLogin = newPath === '/login'
    // 检查旧的路径是否是登录页
    const wasOldLogin = oldPath === '/login'

    // 只有当登录状态发生切换时才触发窗口调整
    // (即：进入登录页 OR 离开登录页)
    if (isNewLogin !== wasOldLogin) {
      handleResize(newPath)
    }
  },
  { immediate: true } // 立即执行一次（应用启动时初始化窗口大小）
)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
