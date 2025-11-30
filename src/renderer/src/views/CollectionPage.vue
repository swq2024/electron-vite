<template>
  <div class="collection-page space-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">我的收藏</h2>
      </div>
      <div>
        <el-button type="primary" plain icon="Sort" @click="handleManageCollection">
          整理排序
        </el-button>
      </div>
    </div>

    <el-divider content-position="left">最常用的账号密码触手可及</el-divider>

    <div v-if="collectStroe.collections.length > 0">
      <el-row :gutter="20">
        <el-col
          v-for="item in collectStroe.collections"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card
            class="mb-4 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-t-4 border-t-yellow-400"
            shadow="hover"
            :body-style="{ padding: '0px', cursor: 'pointer' }"
          >
            <div class="p-4 bg-gray-50 flex justify-between items-start">
              <div class="flex items-center gap-3">
                <el-avatar shape="square" :size="40" class="bg-white text-blue-500 shadow-sm">
                  <el-icon :size="24"><component :is="item.category.icon" /></el-icon>
                </el-avatar>
                <div>
                  <h3 class="font-bold text-base leading-tight">{{ item.title }}</h3>
                  <el-tag
                    size="small"
                    type="info"
                    effect="plain"
                    class="mt-1 border-none bg-transparent p-0 text-gray-500"
                  >
                    {{ item.category.name }}
                  </el-tag>
                </div>
              </div>
              <el-tooltip content="取消收藏" placement="top">
                <el-icon
                  class="text-yellow-400 cursor-pointer hover:text-gray-400 transition-colors"
                  :size="20"
                  @click="debounceToggleCollect(item)"
                >
                  <StarFilled />
                </el-icon>
              </el-tooltip>
            </div>

            <div class="p-5">
              <div class="flex justify-between items-center mb-4 group">
                <div class="text-sm text-gray-500">用户名</div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-700 truncate max-w-[120px]">{{
                    item.username
                  }}</span>
                  <el-icon
                    class="cursor-pointer text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="handleCopy(item.username, '用户名')"
                  >
                    <DocumentCopy />
                  </el-icon>
                </div>
              </div>

              <div class="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 mb-1">密码</span>
                  <span class="font-mono text-gray-600 font-bold tracking-widest">••••••••</span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  icon="DocumentCopy"
                  circle
                  @click="handleCopy(item.decryptedPassword, '密码')"
                ></el-button>
              </div>
            </div>

            <div class="px-5 pb-4 text-xs text-gray-300 flex justify-end">
              {{ item.lastUsed ? `最后使用于 ${item.lastUsed}` : '暂未使用' }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
      <div class="bg-gray-100 p-6 rounded-full mb-4">
        <el-icon :size="48" class="text-gray-300"><Collection /></el-icon>
      </div>
      <p class="text-lg font-medium text-gray-600">暂无收藏密码</p>
      <p class="text-sm mb-6">将常用的账号添加到这里，查找更方便</p>
      <el-button type="primary" plain @click="goToAllPasswords">前往添加收藏</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCollectStore } from '@renderer/stores/collection'
import { useDebounceFn } from '@vueuse/core'

const collectStroe = useCollectStore()
onMounted(async () => {
  await collectStroe.fetchCollectedPassword()
})

const handleManageCollection = (): void => {
  ElMessage.info('功能开发中：支持拖拽排序')
}

const handleToggleCollect = async (item): Promise<void> => {
  try {
    await collectStroe.toggleCollection(item.id)
    ElMessage.success(`${item.title}已从收藏夹移除`)
  } catch (error) {
    ElMessage.error('切换收藏状态失败')
    console.error(error)
  }
}

const debounceToggleCollect = useDebounceFn(handleToggleCollect, 200)

const handleCopy = async (text: string, label = '内容'): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${label}已复制`)
  } catch (error) {
    ElMessage.error('复制失败')
    console.error(error)
  }
}

// 前往所有密码页
const goToAllPasswords = () => {
  ElMessage.info('跳转到「所有密码」页面')
}
</script>

<style scoped>
:deep(.el-card) {
  border: none;
  overflow: visible; /* 允许阴影溢出 */
}

:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>
