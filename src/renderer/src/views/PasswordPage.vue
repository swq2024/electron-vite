<template>
  <div class="flex flex-col space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">所有密码</h2>
      </div>

      <div><el-button type="primary" plain> 新建密码</el-button></div>
    </div>

    <el-divider content-position="left">管理和查看您存储的所有密码</el-divider>

    <div class="flex justify-between">
      <div class="flex-1 mr-1">
        <el-input v-model="searchPassword" clearable placeholder="搜索密码...">
          <template #prepend>
            <el-button icon="Search" />
          </template>
        </el-input>
      </div>
      <div>
        <el-button>
          <el-icon><Filter /></el-icon>
          筛选
        </el-button>
      </div>
    </div>

    <div>
      <el-row :gutter="20">
        <el-col
          v-for="item in pwdStore.passwordList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="mb-4" shadow="hover">
            <template #header>
              <div class="flex items-center space-x-2">
                <el-icon :size="28" color="skyblue">
                  <component :is="item.category.icon"></component>
                </el-icon>
                <div>
                  <p class="item_title text-sm font-bold">{{ item.title }}</p>
                  <p class="item_category text-xs text-gray-500">{{ item.category.name }}</p>
                </div>
              </div>

              <div @click="debounceToggleFavorite(item)">
                <el-button
                  v-if="item.isFavorite"
                  text
                  icon="StarFilled"
                  class="is-active"
                ></el-button>
                <el-button v-else text icon="Star"></el-button>
              </div>
            </template>
            <!-- card body -->
            <div class="flex flex-col">
              <div>
                <label class="text-gray-400 text-sm">用户名</label>
                <div class="flex justify-between">
                  <p class="text-xs">{{ item.username }}</p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click="copyUsername(item.username)"
                  >
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </p>
                </div>
              </div>
              <div>
                <label class="text-gray-400 text-sm">密码</label>
                <div class="flex justify-between">
                  <p class="text-sm">
                    {{ item?.showPassword ? item.password : '********' }}
                  </p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click="togglePasswordVisibility(item)"
                  >
                    <el-icon>
                      <component :is="item?.showPassword ? 'Hide' : 'View'" />
                    </el-icon>
                  </p>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="flex justify-center">
        <Pagination
          :total="pwdStore.pagination!.total"
          :current-page="pwdStore.currentPage"
          :page-size="pwdStore.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '@renderer/components/Pagination.vue'
import { usePwdStore } from '@renderer/stores/password'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

const pwdStore = usePwdStore()

const searchPassword = ref('')

const handleCurrentChange = async (val: number): Promise<void> => {
  pwdStore.currentPage = val
  await pwdStore.getPasswordList()
}

onMounted(async () => {
  await pwdStore.getPasswordList()
})
const togglePasswordVisibility = (item): void => {
  item.showPassword = !item.showPassword
}
const toggleFavorite = async (item): Promise<void> => {
  if (item) {
    await pwdStore.toggleFavorite(item.id)
    ElMessage.success(`${item.title} ${item.isFavorite ? '已从收藏夹移除' : '已添加到收藏夹'}`)
  }
}
const debounceToggleFavorite = useDebounceFn(toggleFavorite, 200)
const copyUsername = (username: string): void => {
  navigator.clipboard
    .writeText(username)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
:deep(.el-card__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.is-active {
  color: greenyellow;
}
</style>
