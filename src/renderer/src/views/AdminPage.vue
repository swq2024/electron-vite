<template>
  <div>
    <div class="flex items-center">
      <h2 class="font-bold">管理面板</h2>
    </div>
    <el-divider content-position="left">集中管理用户、监控系统状态和审计安全日志</el-divider>

    <div class="flex flex-col space-y-2">
      <div>
        <el-card shadow="hover">
          <div class="flex items-center">
            <el-icon><User /></el-icon>
            <span class="ml-2">用户管理</span>
          </div>
        </el-card>
      </div>
      <div>
        <el-card shadow="hover">
          <div class="flex items-center">
            <el-icon><Monitor /></el-icon>
            <span class="ml-2">系统监控</span>
          </div>
        </el-card>
      </div>
      <div>
        <el-card shadow="hover">
          <div class="flex items-center">
            <el-icon><Document /></el-icon>
            <span class="ml-2">安全日志</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
