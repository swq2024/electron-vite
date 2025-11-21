<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">回收站</h2>
      </div>

      <div>
        <el-button type="primary" plain>全部恢复</el-button>
        <el-button type="danger" plain>清空回收站</el-button>
      </div>
    </div>
    <el-divider content-position="left">查看您暂时删除的密码</el-divider>

    <div>
      <el-table :data="trashData">
        <el-table-column type="selection" width="35" />
        <el-table-column prop="title" label="标题/用户名" align="center">
          <template #default="{ row }">
            <div class="flex flex-col">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs">{{ row.username }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastUsedAt" label="最后使用时间" align="center" />
        <el-table-column prop="deletedAt" label="删除时间" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              text
              type="warning"
              size="small"
              icon="RefreshLeft"
              @click="handleRestore(row)"
            ></el-button>
            <el-button
              text
              type="danger"
              size="small"
              icon="Close"
              @click="deletePermanently(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex justify-center">
      <Pagination
        :total="20"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import Pagination from '@renderer/components/Pagination.vue'

const trashData = ref([
  {
    title: 'Google',
    username: 'user1',
    deletedAt: '2023-01-01',
    lastUsedAt: '2023-01-02'
  },
  {
    title: 'Facebook',
    username: 'user2',
    deletedAt: '2023-01-03',
    lastUsedAt: '2023-01-04'
  },
  {
    title: 'Twitter',
    username: 'user3',
    deletedAt: '2023-01-05',
    lastUsedAt: '2023-01-06'
  },
  {
    title: 'Instagram',
    username: 'user4',
    deletedAt: '2023-01-07',
    lastUsedAt: '2023-01-08'
  },
  {
    title: 'LinkedIn',
    username: 'user5',
    deletedAt: '2023-01-09',
    lastUsedAt: '2023-01-10'
  },
  {
    title: 'Pinterest',
    username: 'user6',
    deletedAt: '2023-01-11',
    lastUsedAt: '2023-01-12'
  },
  {
    title: 'YouTube',
    username: 'user7',
    deletedAt: '2023-01-13',
    lastUsedAt: '2023-01-14'
  },
  {
    title: 'TikTok',
    username: 'user8',
    deletedAt: '2023-01-15',
    lastUsedAt: '2023-01-16'
  },
  {
    title: 'Snapchat',
    username: 'user9',
    deletedAt: '2023-01-17',
    lastUsedAt: '2023-01-18'
  },
  {
    title: 'WhatsApp',
    username: 'user10',
    deletedAt: '2023-01-19',
    lastUsedAt: '2023-01-20'
  },
  {
    title: 'Telegram',
    username: 'user11',
    deletedAt: '2023-01-21',
    lastUsedAt: '2023-01-22'
  }
])
const handleRestore = (row) => {
  ElMessage.success('恢复成功')
}
const deletePermanently = (row) => {
  ElMessage.success('永久删除成功')
}

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
// 当前页码改变
const handleCurrentChange = (val: number): void => {
  currentPage.value = val
  // 滚动到顶部（可选）
  // window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
