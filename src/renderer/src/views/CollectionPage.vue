<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">我的收藏</h2>
      </div>

      <div><el-button type="primary" plain> =-= </el-button></div>
    </div>
    <el-divider content-position="left">查看您平时使用频次较高的密码</el-divider>

    <div></div>
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
