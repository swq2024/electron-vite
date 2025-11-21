<template>
  <div>
    <h3 class="font-bold">外观设置</h3>
    <div class="flex flex-col space-y-5">
      <el-card shadow="never" class="mt-3">
        <label>应用主题</label>
        <p class="text-gray-500 text-sm dark:text-gray-400">选择您偏好的整体配色方案。</p>
        <el-radio-group v-model="activeTheme">
          <el-radio-button label="light">浅色模式</el-radio-button>
          <el-radio-button label="dark">深色模式</el-radio-button>
        </el-radio-group>
      </el-card>
      <el-card shadow="never">
        <label>侧边栏</label>
        <p class="text-gray-500 text-sm">收起/展开侧边栏</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTheme = ref('light')
</script>

<style scoped></style>
