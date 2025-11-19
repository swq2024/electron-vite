<template>
  <div class="overflow-auto shadow-md" :style="{ width: appStore.asideWidth }">
    <el-scrollbar height="600px">
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
          <span class="text-gray-400 text-3"> 主导航 </span>
        </div>
        <el-menu-item index="/databoard">
          <el-icon><DataBoard /></el-icon>
          <span>数据面板</span>
        </el-menu-item>
        <el-menu-item index="/password">
          <el-icon><Key /></el-icon>
          <span>所有密码</span>
        </el-menu-item>
        <!-- <el-sub-menu index="/category">
          <template #title>
            <el-icon>
              <Menu />
            </el-icon>
            <span>我的分类</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/default">默认分类</el-menu-item>
            <el-menu-item index="/1">社交媒体</el-menu-item>
            <el-menu-item index="/2">游戏账号</el-menu-item>
            <el-menu-item index="/3">游戏账号</el-menu-item>
            <el-menu-item index="/4">游戏账号</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu> -->

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
        <el-menu-item index="/setting">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
        <div class="ml-5">
          <span class="text-gray-400 text-3"> 管理员 </span>
        </div>
        <el-menu-item index="/panel">
          <el-icon><Avatar /></el-icon>
          <span>管理面板</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const isCollapse = computed(() => !(appStore.asideWidth === '180px'))
const handleOpen = (): void => {}
const handleClose = (): void => {}
const handleSelect = (path: string): void => {
  router.push(path)
}
const defaultActive = ref(route.path)
</script>

<style scoped>
.el-menu {
  /*--el-menu-active-color: var(--menu-active-text-color);*/
  height: 100vh;
  /*border: none;*/
}
@supports (scrollbar-width: none) {
  .el-menu {
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari/Edge */
    }
  }
}
</style>
