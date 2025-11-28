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
      <note class="mb-2">
        For demonstration purpose, the idle timeout is set to <b>5s</b> in this demo (default 1min).
      </note>
      <div class="mb-2">空闲状态: {{ idle }}</div>
      <div>
        非活动时间: <b class="text-primary">{{ idleFor }}s</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnline, useIdle, useTimestamp } from '@vueuse/core'
import { computed } from 'vue'

const isOnline = useOnline()
const now = useTimestamp({ interval: 1000 })
const { idle, lastActive } = useIdle(5000) // 空闲超时设置为 5 秒
const idleFor = computed(() => {
  const activeTime = Math.floor((now.value - lastActive.value) / 1000)
  return activeTime > 0 ? activeTime : 0
})
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
