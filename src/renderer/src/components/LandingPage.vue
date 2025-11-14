<template>
  <div>
    <h1>密钥管理app</h1>
    <button @click="handleLogin">登录</button>
    <br />
    <button @click="getProfileData">获取个人信息</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const authStore = useAuthStore()
const handleLogin = async (): Promise<void> => {
  const data = {
    username: 'yuhuo666',
    password: '12345678'
  }

  const res = await authStore.handleLogin(data)
  console.log('res', res)
  console.log('AT', authStore.accessToken)
}

const getProfileData = async (): Promise<void> => {
  const res = await authStore.getProfile()
  console.log('res', res)
}
</script>

<style scoped>
hr {
  margin: 20px;
  border: 2px solid #ccc;
  width: 50vw;
}
</style>
