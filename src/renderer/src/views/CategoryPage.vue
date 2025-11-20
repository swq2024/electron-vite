<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">我的分类</h2>
      </div>

      <div><el-button type="primary" plain> 新建分类</el-button></div>
    </div>
    <el-divider content-position="left">分类和管理您的密码</el-divider>
    <div class="flex justify-between">
      <div class="flex-1 mr-1">
        <el-input v-model="searchCategory" clearable placeholder="搜索分类..."> </el-input>
      </div>
      <div>
        <el-button icon="Search"> 搜索 </el-button>
      </div>
    </div>

    <div>
      <el-table :data="categoryList" style="width: 100%">
        <el-table-column prop="name" label="分类名称" align="center" width="120">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center">
              <el-icon :color="row.color">
                <component :is="row.icon"></component>
              </el-icon>
              <span style="margin-left: 10px">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="" align="center" />
        <el-table-column prop="" label="" align="center" />
        <el-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <el-button type="primary" text icon="Edit" @click="handleEdit(row)"></el-button>
            <el-button type="danger" text icon="Delete" @click="handleDelete(row)"></el-button>
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
import { ref } from 'vue'

const searchCategory = ref('')

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
// 当前页码改变
const handleCurrentChange = (val: number): void => {
  currentPage.value = val
  // 滚动到顶部（可选）
  // window.scrollTo({ top: 0, behavior: 'smooth' })
}

const categoryList = ref([
  { id: 1, name: '分类1', color: '#FF0000', icon: 'Folder' },
  { id: 2, name: '分类2', color: '#00FF00', icon: 'Folder' },
  { id: 3, name: '分类3', color: '#0000FF', icon: 'Folder' }
])

const handleEdit = (row) => {
  console.log('编辑分类', row)
}

const handleDelete = (row) => {
  console.log('删除分类', row)
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
