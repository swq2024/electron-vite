<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <div class="cursor-pointer" @click="appStore.changeAsideWidth">
          <el-icon v-if="appStore.asideWidth === '180px'" :size="24"><Fold /></el-icon>
          <el-icon v-else :size="24"><Expand /></el-icon>
        </div>
        <h2 class="font-bold">数据面板</h2>
      </div>

      <div>=-=</div>
    </div>
    <el-divider content-position="left">分析您当前账户的数据存储</el-divider>

    <div>123</div>
    <div>456</div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
