<template>
  <div>
    <h3 class="font-bold">高级选项</h3>
    <div class="flex flex-col space-y-3">
      <el-card shadow="never" class="mt3">
        <div class="flex flex-col space-y-2">
          <p>数据同步</p>
          <p class="text-gray-400 text-sm">管理本地数据与云端备份的同步设置。</p>
          <p class="flex justify-between items-center bg-gray-200/55 rounded">
            <span class="text-gray-500">自动云同步</span>
            <el-button type="primary" text icon="Refresh">立即同步</el-button>
          </p>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-2">
          <p>数据导出/导入</p>
          <p class="text-gray-400 text-sm">对密码存储的导出和导入。</p>
          <div>
            <el-button type="primary" text icon="Download">导出数据(json)</el-button>
            <el-button type="primary" plain icon="Upload">导入数据(json/csv)</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-2">
          <p>安全操作</p>
          <p class="text-gray-400 text-sm">立即锁定应用程序, 需要重新输入主密码才能访问。</p>
          <el-button type="danger" plain icon="Lock" class="w-30">锁定应用</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
