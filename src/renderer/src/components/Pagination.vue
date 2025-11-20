<template>
  <div class="pagination-container">
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
// 定义 props
defineProps({
  // 总条数
  total: {
    type: Number,
    required: true
  },
  // 当前页码
  currentPage: {
    type: Number,
    default: 1
  },
  // 每页显示数量
  pageSize: {
    type: Number,
    default: 10
  }
  // 每页显示数量选项
  // pageSizes: {
  //   type: Array,
  //   default: () => [5, 10, 20, 50]
  // }
})

// 定义 emits
const emit = defineEmits(['size-change', 'current-change'])

// 每页显示数量改变
const handleSizeChange = (val): void => {
  emit('size-change', val)
}

// 当前页码改变
const handleCurrentChange = (val): void => {
  emit('current-change', val)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: transparent;
}

.pagination {
  --el-pagination-background-color: transparent;
  --el-pagination-text-color: #d1d5db;
  --el-pagination-hover-color: #3b82f6;
  --el-pagination-active-color: #3b82f6;
  --el-pagination-border-color: #374151;
}

.pagination :deep(.el-pagination__sizes) {
  color: #d1d5db;
}

.pagination :deep(.el-select .el-input__inner) {
  background-color: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}

.pagination :deep(.el-pagination__btn) {
  background-color: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}

.pagination :deep(.el-pagination__btn:hover) {
  color: #3b82f6;
  border-color: #3b82f6;
}

.pagination :deep(.el-pager li) {
  color: #d1d5db;
}

.pagination :deep(.el-pager li.is-active) {
  background-color: #3b82f6;
  color: #ffffff;
}

.pagination :deep(.el-pagination__editor) {
  background-color: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}
</style>
