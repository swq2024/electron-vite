<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbItems"
      :key="index"
      :to="getAbsolutePath(item)"
      :disabled="index === breadcrumbItems.length - 1"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

/**
 * 计算最终要渲染的面包屑项数组
 * 优先使用路由 meta 中的 breadcrumb 配置
 */
const breadcrumbItems = computed(() => {
  // 1. 检查当前路由是否有自定义的 breadcrumb 配置
  if (route.meta && Array.isArray(route.meta.breadcrumb)) {
    return route.meta.breadcrumb
  }

  // 2. 回退：使用 route.matched 自动生成
  return route.matched
    .filter((record) => record.path !== '/') // 过滤掉根路由
    .map((record) => ({
      path: record.path,
      title: record.meta.title || record.name || record.path
    }))
})

/**
 * 将面包屑项中的 path 解析为绝对路径
 * @param item 面包屑项
 */
const getAbsolutePath = (item): string => {
  // 使用 router.resolve 解析路径，确保正确性
  const resolved = router.resolve({ path: item.path })
  return resolved.fullPath
}
</script>

<style scoped></style>
