<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">回收站</h2>
      </div>

      <div>
        <el-button type="warning" plain @click="handleRestorePasswords(selectedPasswordIds)"
          >批量恢复</el-button
        >
        <el-button type="danger" plain @click="handleForceDeletePasswords(selectedPasswordIds)"
          >批量删除</el-button
        >
      </div>
    </div>
    <el-divider content-position="left">查看您暂时删除的密码</el-divider>

    <div>
      <el-table
        :data="trashStore.trashList"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="35" />
        <el-table-column prop="title" label="标题/用户名" align="center">
          <template #default="{ row }">
            <div class="flex flex-col">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs">{{ row.username }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastUsedAt" label="最后使用时间" align="center">
          <template #default="{ row }">
            {{ row.lastUsedAt ? row.lastUsedAt : 'null' }}
          </template>
        </el-table-column>
        <el-table-column prop="deletedAt" label="删除时间" align="center" />
        <el-table-column label="操作" align="center" width="160">
          <template #default="{ row }">
            <el-button
              text
              type="warning"
              icon="RefreshLeft"
              @click="handleRestorePassword(row.id)"
            ></el-button>
            <el-button
              text
              type="danger"
              icon="Close"
              @click="handleForceDeletePassword(row.id)"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import Pagination from '@renderer/components/Pagination.vue'
import { useTrashStore } from '@renderer/stores/trash'

const trashStore = useTrashStore()
onMounted(async () => {
  await trashStore.fetchTrashedPassword()
})

const selectedPasswordIds = ref([])
const handleSelectionChange = (items): void => {
  selectedPasswordIds.value = items.map((item) => item.id)
}
const handleSelectAll = (items): void => {
  ElMessage.warning('请谨慎操作执行后续全选操作')
}

const handleRestorePassword = async (id: string): Promise<void> => {
  try {
    await trashStore.restorePassword(id)
    ElMessage.success('恢复成功')
  } catch (error) {
    ElMessage.error('恢复失败')
    console.error(error)
  }
}

const handleRestorePasswords = async (passwordIds: string[]): Promise<void> => {
  if (!passwordIds || passwordIds.length === 0) {
    ElMessage.warning('请选择要恢复的密码')
    return
  }

  try {
    await trashStore.restorePasswords(passwordIds)
    ElMessage.success('批量恢复成功')
  } catch (error) {
    ElMessage.error('批量恢复失败')
    console.error(error)
  }
}

const handleForceDeletePassword = (id: string): void => {
  ElMessageBox.confirm('确定要彻底删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await trashStore.forceDeletePassword(id)
      ElMessage.success('彻底删除成功')
    })
    .catch((error) => {
      if (error === 'cancel') {
        ElMessage.info('取消删除')
      } else {
        ElMessage.error('彻底删除失败')
        console.error(error)
      }
    })
}

const handleForceDeletePasswords = (passwordIds: string[]): void => {
  if (!passwordIds || passwordIds.length === 0) {
    ElMessage.warning('请选择要彻底删除的密码')
    return
  }
  ElMessageBox.confirm('确定要彻底删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await trashStore.forceDeletePasswords(passwordIds)
      ElMessage.success('彻底删除成功')
    })
    .catch((error) => {
      if (error === 'cancel') {
        ElMessage.info('取消删除')
      } else {
        ElMessage.error('彻底删除失败')
        console.error(error)
      }
    })
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
