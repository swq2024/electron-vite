<template>
  <div>
    <h3 class="font-bold">外观设置</h3>
    <div class="flex flex-col space-y-5">
      <el-card shadow="never" class="mt-3">
        <label>应用主题</label>
        <p class="text-gray-400 text-sm">选择您偏好的整体配色方案。</p>
        <el-radio-group
          v-model="activeTheme"
          text-color="#000"
          class="mt-3"
          @change="handleChangeTheme"
        >
          <el-radio-button value="light">
            <div class="flex flex-col space-y-3 p4">
              <p>
                <el-icon color="yellow" :size="32"><Sunny /></el-icon>
              </p>
              <p><span>浅色模式</span></p>
            </div>
          </el-radio-button>
          <el-radio-button value="dark">
            <div class="flex flex-col space-y-3 p4">
              <p>
                <el-icon color="skyblue" :size="32"><Moon /></el-icon>
              </p>
              <p><span>深色模式</span></p>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-card>
      <el-card shadow="never">
        <label>侧边栏</label>
        <p class="text-gray-400 text-sm">控制侧边栏展开或收起。</p>
        <el-switch v-model="sidebarCollapsed" @change="appStore.changeAsideWidth()"></el-switch>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@renderer/stores/app'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()

const activeTheme = ref('light')
const sidebarCollapsed = ref(appStore.asideWidth === '180px')

const handleChangeTheme = (value: string): void => {
  ElMessage.success(`${value} 主题切换成功`)
}
</script>

<style scoped>
.el-radio-group {
  gap: 1rem;
}
:deep(.el-radio-button__inner) {
  border: 1px solid #dcdfe6;
}
:deep(.el-radio-button:first-child .el-radio-button__inner),
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 10px;
}
.el-radio-button {
  --el-radio-button-checked-border-color: #409eff;
}
</style>
