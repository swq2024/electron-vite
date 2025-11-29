<template>
  <div class="aside-container no-drag" :style="{ width: appStore.asideWidth }">
    <el-scrollbar class="aside-scrollbar">
      <el-menu
        :collapse="isCollapse"
        :default-active="defaultActive"
        :collapse-transition="false"
        unique-opened
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <div class="ml-5">
          <span class="menu-group-title"> 主导航 </span>
        </div>
        <el-menu-item index="/">
          <el-icon><DataBoard /></el-icon>
          <span>数据面板</span>
        </el-menu-item>
        <el-menu-item index="/password">
          <el-icon><Key /></el-icon>
          <span>所有密码</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <el-icon><Menu /></el-icon>
          <span>我的分类</span>
        </el-menu-item>
        <el-menu-item index="/collection">
          <el-icon><CollectionTag /></el-icon>
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/trash">
          <el-icon><Delete /></el-icon>
          <span>回收站</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>应用设置</span>
        </el-menu-item>
        <div v-if="isAdmin">
          <div class="ml-5">
            <span class="menu-group-title"> 管理员 </span>
          </div>
          <el-menu-item index="/admin">
            <el-icon><Avatar /></el-icon>
            <span>管理面板</span>
          </el-menu-item>
          <el-menu-item index="/changelog">
            <el-icon><HelpFilled /></el-icon>
            <span>系统更新</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'
import { useAuthStore } from '@renderer/stores/auth'
import { ref, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.userInfo?.role === 'admin')
const isCollapse = computed(() => !(appStore.asideWidth === '180px'))
const handleOpen = (): void => {}
const handleClose = (): void => {}
const handleSelect = (path: string): void => {
  router.push(path)
}
const defaultActive = ref(route.path)

onBeforeRouteUpdate((to) => {
  defaultActive.value = to.path
})
</script>

<style scoped>
.aside-container {
  height: 100%; /* 触达视口底部 */
  overflow: hidden; /* 隐藏外层滚动，仅内层菜单滚动 */
  background-color: var(--el-menu-bg-color); /* 与菜单背景一致 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); /* 轻微阴影增强层次感 */
}
/* 滚动容器：高度自适应外层，仅内容溢出时滚动 */
.aside-scrollbar {
  height: 100%;
  padding: 8px 0; /* 上下内边距，避免菜单贴边 */
}
/* 菜单分组标题：优化样式，与原型一致 */
.menu-group-title {
  font-size: 12px;
  color: #9ca3af; /* 灰色小标题，符合深色主题 */
}
/* 菜单样式优化：去掉多余边框，适配贴底布局 */
.el-menu {
  height: 100%;
  border-right: none; /* 去掉右侧边框，避免与主内容区分割感 */
  --el-menu-active-color: #3b82f6; /* 激活态蓝色，与你的主题一致 */
  --el-menu-text-color: #666; /* 菜单文字白色 */
  --el-menu-hover-text-color: #3b82f6; /* hover蓝色 */
}
/* 优化折叠状态下的菜单间距 */
:deep(.el-menu-item) {
  margin: 4px 0;
}
</style>
