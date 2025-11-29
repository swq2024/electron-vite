<template>
  <div class="login-page">
    <Operation />
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
          @keyup.enter="handleLogin(loginFormEl)"
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
            <el-button
              color="#626aef"
              style="width: 240px"
              :loading="loading"
              @click="handleLogin(loginFormEl)"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Operation from '@renderer/components/Operation.vue'
import { useAuthStore } from '@renderer/stores/auth'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const loginFormEl = useTemplateRef('loginForm')

const formData = reactive({
  username: '',
  password: ''
})
const rules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const status = await authStore.handleLogin(formData)
        if (status) {
          ElMessage.success('登录成功')

          const redirect = route.query.redirect as string
          router.push(redirect || '/')
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const handleRegister = (): void => {
  console.log('register!')
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
</style>
