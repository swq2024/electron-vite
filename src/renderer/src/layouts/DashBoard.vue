<template>
  <div class="flex justify-between items-center">
    <div>
      <div class="cursor-pointer" @click="appStore.changeAsideWidth">
        <el-icon v-if="appStore.asideWidth === '180px'" :size="24"><Fold /></el-icon>
        <el-icon v-else :size="24"><Expand /></el-icon>
      </div>
      <h1 class="font-bold">数据面板</h1>
      <span class="text-sm text-gray-400">=-=</span>
    </div>

    <div>123</div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()
</script>

<style scoped></style>
