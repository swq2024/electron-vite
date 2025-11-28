<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">数据面板</h2>
      </div>

      <div>=-=</div>
    </div>
    <el-divider content-position="left">分析您当前账户的数据存储</el-divider>

    <div>
      {{ `当前网络状态：${isOnline ? 'online' : 'offline'}` }}
    </div>
    <div>
      <div class="mb-2">空闲状态: {{ idle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnline, useIdle } from '@vueuse/core'

const isOnline = useOnline()
const { idle } = useIdle(5000) // 空闲超时设置为 5 秒
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
