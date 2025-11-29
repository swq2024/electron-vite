<template>
  <div class="flex flex-row justify-end items-center">
    <div class="p2.5 flex space-x-1">
      <button class="window-btn minimize-btn no-drag" @click="handleMinimize">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6 13v-2h12v2z" />
        </svg>
      </button>
      <button class="window-btn close-btn no-drag" @click="handleClose">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m8.382 17.025l-1.407-1.4L10.593 12L6.975 8.4L8.382 7L12 10.615L15.593 7L17 8.4L13.382 12L17 15.625l-1.407 1.4L12 13.41z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleMinimize = async (): Promise<void> => {
  await window.authAPI.minimizeWindow()
}

const handleClose = async (): Promise<void> => {
  await window.authAPI.closeWindow()
}
</script>

<style scoped>
/* 窗口控制按钮样式 */
.window-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}
.window-btn:hover {
  color: slategrey;
}
</style>
