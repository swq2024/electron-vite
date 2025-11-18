<template>
  <div class="flex flex-col min-h-screen">
    <el-container>
      <el-header>
        <HeaderView />
      </el-header>
      <el-container>
        <el-aside :width="appStore.asideWidth" class="transition-all transition-duration-200">
          <AsideView />
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// import { useAuthStore } from '@renderer/stores/auth'
import AsideView from '@renderer/layouts/AsideView.vue'
import HeaderView from '@renderer/layouts/HeaderView.vue'
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()
// const authStore = useAuthStore()
// const handleLogin = async (): Promise<void> => {
//   const data = {
//     username: 'admin123',
//     password: 'admin123A'
//   }

//   const res = await authStore.handleLogin(data)
//   console.log('res', res)
//   console.log('AT', authStore.accessToken)
// }

// const getProfileData = async (): Promise<void> => {
//   const res = await authStore.getProfile()
//   console.log('res', res)
// }
</script>

<style scoped>
.el-header {
  padding: 0;
  height: 10vh;
}
</style>
