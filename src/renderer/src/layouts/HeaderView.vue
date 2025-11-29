<template>
  <div class="flex justify-between items-center h-[69px] header-group">
    <div class="flex items-center ml5 space-x-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 640 640">
          <path
            fill="#74C0FC"
            d="M400 416C497.2 416 576 337.2 576 240C576 142.8 497.2 64 400 64C302.8 64 224 142.8 224 240C224 258.7 226.9 276.8 232.3 293.7L71 455C66.5 459.5 64 465.6 64 472L64 552C64 565.3 74.7 576 88 576L168 576C181.3 576 192 565.3 192 552L192 512L232 512C245.3 512 256 501.3 256 488L256 448L296 448C302.4 448 308.5 445.5 313 441L346.3 407.7C363.2 413.1 381.3 416 400 416zM440 160C462.1 160 480 177.9 480 200C480 222.1 462.1 240 440 240C417.9 240 400 222.1 400 200C400 177.9 417.9 160 440 160z"
          />
        </svg>
        <span class="font-bold text-xl text-blue-300">KeyValut Pro</span>
      </div>
    </div>

    <div class="no-drag flex items-center">
      <div class="flex space-x-3 mt1">
        <el-tooltip content="产品更新动态" effect="light">
          <div
            class="hover:color-gray-500 cursor-pointer hover:bg-gray-100/80"
            @click="handleChangelogClick"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 4.5a.5.5 0 0 0-.5-.5a.5.5 0 0 0-.5.5v1.53c-2.25.25-4 2.15-4 4.47v5.91L5.41 18h12.18L16 16.41V10.5c0-2.32-1.75-4.22-4-4.47zM11.5 3A1.5 1.5 0 0 1 13 4.5v.71c2.31.65 4 2.79 4 5.29V16l3 3H3l3-3v-5.5C6 8 7.69 5.86 10 5.21V4.5A1.5 1.5 0 0 1 11.5 3m0 19a2.5 2.5 0 0 1-2.45-2h1.04a1.495 1.495 0 0 0 2.82 0h1.04a2.5 2.5 0 0 1-2.45 2"
              />
            </svg>
          </div>
        </el-tooltip>
        <div>
          <el-dropdown trigger="click" class="cursor-pointer" @command="handleCommand">
            <el-avatar :src="userInfo?.avatar" size="small" @error="errorHandler" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" icon="User">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings" icon="Setting">应用设置</el-dropdown-item>
                <el-dropdown-item command="logout" icon="SwitchButton" divided
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-divider direction="vertical" />
      <Operation />
    </div>
  </div>
</template>

<script setup lang="ts">
import Operation from '@renderer/components/Operation.vue'
import { useAuthStore } from '@renderer/stores/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const errorHandler = (): boolean => true

const authStore = useAuthStore()
const userInfo = authStore.userInfo

const handleCommand = async (command: string): Promise<void> => {
  switch (command) {
    case 'profile':
      ElMessage('个人资料正在开发')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await authStore.logout()
      router.push('/login')
      break
  }
}
const handleChangelogClick = (): void => {
  router.push('/changelog')
}
</script>

<style scoped>
.header-group {
  background-color: var(--el-menu-bg-color); /* 与菜单背景一致 */
}
</style>
