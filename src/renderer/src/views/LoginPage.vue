<template>
  <div class="login-page">
    <div class="flex flex-row justify-end items-center">
      <div class="p2.5 flex space-x-1">
        <button class="window-btn minimize-btn no-drag" @click="handleMinimize">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 13v-2h12v2z" />
          </svg>
        </button>
        <button class="window-btn close-btn no-drag" @click="handleClose">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m8.382 17.025l-1.407-1.4L10.593 12L6.975 8.4L8.382 7L12 10.615L15.593 7L17 8.4L13.382 12L17 15.625l-1.407 1.4L12 13.41z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="flex flex-col items-center pt-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m12 9.55l7.25 5.625q-.725 1.975-2.087 3.563T14 21.25v-6.225h-4v6.225q-1.8-.925-3.162-2.512T4.75 15.175zm0-7.525l8 3V11.1q0 .5-.05.988t-.125.987L12 7.025l-7.825 6.05q-.1-.5-.137-.987T4 11.1V5.025z"
        />
      </svg>

      <h2 class="text-2xl font-family font-bold">KeyValut</h2>
      <div>
        <el-form
          ref="loginForm"
          :model="formData"
          :rules="rules"
          label-position="top"
          hide-required-asterisk
          :show-message="false"
        >
          <el-form-item label="Username" prop="username">
            <el-input
              v-model="formData.username"
              style="width: 240px; height: 36px"
              prefix-icon="User"
              placeholder="用户名/邮箱"
            />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              show-password
              style="width: 240px; height: 36px"
              prefix-icon="Lock"
              placeholder="密码"
            />
          </el-form-item>
          <div class="flex justify-between">
            <el-button type="text">忘记密码</el-button>
            <el-button type="text" @click="handleRegister">立即注册</el-button>
          </div>
          <el-form-item>
            <el-button color="#626aef" style="width: 240px" @click="handleLogin(loginFormEl)"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const loginFormEl = useTemplateRef('loginForm')

const formData = reactive({
  username: '',
  password: ''
})
const rules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response = await authStore.handleLogin(formData)
        if (response) {
          ElMessage.success('登录成功')
          router.push('/')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleRegister = (): void => {
  console.log('register!')
}

const handleMinimize = async (): Promise<void> => {
  await window.authAPI.minimizeWindow()
}

const handleClose = async (): Promise<void> => {
  await window.authAPI.closeWindow()
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  overflow: hidden;
  background-image: url('../assets/wavy-lines.svg');
  background-size: cover;
  background-color: thistle;
}

.font-family {
  font-family: 'Maple Mono';
}

/* 窗口控制按钮样式 */
.window-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}
.window-btn:hover {
  color: slategrey;
}
</style>
