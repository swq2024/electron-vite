<template>
  <div class="flex flex-col h-screen overflow-hidden bg-indigo-50">
    <el-container class="flex flex-col h-full">
      <el-header class="z-300">
        <HeaderView />
      </el-header>
      <el-container class="flex-1 overflow-hidden">
        <el-aside :width="appStore.asideWidth" class="transition-all transition-duration-200">
          <AsideView />
        </el-aside>
        <el-main class="main-content">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AsideView from '@renderer/layouts/AsideView.vue'
import HeaderView from '@renderer/layouts/HeaderView.vue'
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()
</script>

<style scoped>
.el-header {
  padding: 0; /**去除默认样式*/
  height: 10vh;
}
/* 主内容区域滚动容器基础样式 */
.main-content {
  overflow-y: auto; /* 确保内容溢出时显示滚动条 */
  scrollbar-width: thin; /* 滚动条宽度：auto/thin/none */
  scrollbar-color: #cbd5e1 #f1f5f9; /* 滑块颜色 轨道颜色 */
}
/* WebKit 内核浏览器滚动条样式（Chrome/Edge/Safari） */
::-webkit-scrollbar {
  width: 18px; /* 垂直滚动条宽度 */
  height: 6px; /* 水平滚动条高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f5f9; /* 轨道背景色 */
  border-radius: 3px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.2s ease;
}

/* 滚动条滑块hover状态 */
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* 滑块hover颜色 */
}

/* 滚动条角落（横竖滚动条交叉处） */
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
