<template>
  <div class="flex flex-col space-y-3">
    <BreadcrumbItem />
    <h3 class="text-xl font-bold">修改主密码</h3>

    <div>
      <div>
        <el-card shadow="never">
          <el-steps :active="activeStep">
            <el-step title="选择验证方式" />
            <!-- 根据选择的验证方式，动态显示步骤标题 -->
            <el-step :title="verifyStepTitle" />
            <el-step title="设置新密码" />
            <el-step title="重置成功" />
          </el-steps>
          <!-- 步骤 0: 选择验证方式 -->
          <div v-if="activeStep === 0" class="mt-3">
            <el-radio-group v-model="verifyMethod" @change="selectVerifyMethod">
              <el-radio label="code" border>邮箱验证码验证</el-radio>
              <el-radio label="password" border>验证当前密码</el-radio>
            </el-radio-group>
          </div>
          <!-- 步骤 1: 验证身份 (动态内容) -->
          <div v-if="activeStep === 1">
            <el-form ref="formRef" :model="form" :rules="currentRules" label-width="auto">
              <template v-if="verifyMethod === 'code'">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱地址" />
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                  <el-row :gutter="10">
                    <el-col :span="14">
                      <el-input
                        v-model="form.code"
                        placeholder="请输入验证码"
                        prefix="el-icon-verification"
                      />
                    </el-col>
                    <el-col :span="10">
                      <el-button type="primary" :disabled="countdown > 0" @click="sendCode">
                        {{ countdown > 0 ? `${countdown}秒后重新发送` : '获取验证码' }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </template>

              <template v-if="verifyMethod === 'password'">
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="form.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    prefix="el-icon-lock"
                  />
                </el-form-item>
              </template>

              <el-form-item>
                <el-button type="primary" class="w-full" @click="nextStep(formRef)">
                  下一步
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 步骤 2: 设置新密码 (共用) -->
          <div v-if="activeStep === 2">
            <el-form ref="pwdFormRef" :model="form" :rules="passwordCheckRules" label-width="auto">
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="form.newPassword"
                  type="password"
                  placeholder="请输入新密码(至少8位，包含字母和数字)"
                  prefix="el-icon-lock"
                  @input="checkPasswordStrength"
                />
                <div class="password-strength mt-2">
                  <div class="strength-text">密码强度：{{ passwordStrengthText }}</div>
                  <div class="strength-bars">
                    <div
                      class="strength-bar"
                      :class="passwordStrength >= 1 ? 'strength-1' : ''"
                    ></div>
                    <div
                      class="strength-bar"
                      :class="passwordStrength >= 2 ? 'strength-2' : ''"
                    ></div>
                    <div
                      class="strength-bar"
                      :class="passwordStrength >= 3 ? 'strength-3' : ''"
                    ></div>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  prefix="el-icon-lock"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="w-full" @click="submitReset(pwdFormRef)">
                  提交重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 步骤 3: 重置成功 (共用) -->
          <div v-if="activeStep === 3">
            <el-icon class="success-icon">
              <CircleCheckFilled />
            </el-icon>
            <h3 class="success-title">密码重置成功！</h3>
            <p class="success-desc">您的密码已成功更新，请使用新密码登录。</p>
            <el-button type="primary" class="mt-6" @click="goToLogin"> 返回登录页 </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import BreadcrumbItem from './BreadcrumbItem.vue'
import { ref, reactive, computed } from 'vue'

interface Form {
  email: string
  code: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// 表单引用
const formRef = ref<FormInstance | undefined>()
const pwdFormRef = ref<FormInstance | undefined>()

// 表单数据
const form = reactive<Form>({
  phone: '',
  code: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const codeCheckRules = ref<FormRules<Form>>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }
  ]
})

const passwordCheckRules = ref<FormRules<Form>>({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 根据选择的验证方式，动态切换表单规则
const currentRules = computed<FormRules>(() => {
  if (verifyMethod.value === 'code') {
    return codeCheckRules
  } else if (verifyMethod.value === 'password') {
    return passwordCheckRules
  }
  return {}
})
// 步骤状态
const activeStep = ref(0)
// 选择的验证方式: 'code' 或 'password'
const verifyMethod = ref<string | null>(null)
// 倒计时状态
const countdown = ref(0)
// 密码强度状态
const passwordStrength = ref(0)
const passwordStrengthText = ref('弱')

const verifyStepTitle = computed(() => {
  if (verifyMethod.value === 'code') return '手机验证码验证'
  if (verifyMethod.value === 'password') return '验证当前密码'
  return '验证身份'
})

const selectVerifyMethod = (method: string): void => {
  verifyMethod.value = method
  activeStep.value = 1 // 直接进入验证步骤
}

const sendCode = async (): Promise<void> => {
  if (!form.email) {
    ElMessage.error('请输入邮箱')
    return
  }
  try {
    // await api.sendVerifyCode(phone.value, verifyMethod.value)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {
        clearInterval(timer)
      }
    }, 1000)
    ElMessage.success('验证码已发送至您的邮箱')
  } catch (err) {
    ElMessage.error(`error:${err}`)
  }
}

const nextStep = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      // 模拟验证通过（实际项目中这里要调用API）
      activeStep.value = 2
    } else {
      ElMessage.error('请完成身份验证')
    }
  })
}

const checkPasswordStrength = (value: string): void => {
  // 检查密码强度逻辑
  // 更新 passwordStrength 和 passwordStrengthText 的值
  let strength = 0
  if (value.length >= 8) strength++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++
  if (/[0-9]/.test(value)) strength++
  passwordStrength.value = strength
  switch (strength) {
    case 1:
      passwordStrengthText.value = '弱'
      break
    case 2:
      passwordStrengthText.value = '中'
      break
    case 3:
      passwordStrengthText.value = '强'
      break
    default:
      passwordStrengthText.value = '弱'
  }
}

const submitReset = async (formEl: FormInstance | undefined): Promise<void> => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      // 模拟验证通过（实际项目中这里要调用API）
      activeStep.value = 3
    } else {
      ElMessage.error('请完成身份验证')
    }
  })
}

const goToLogin = (): void => {
  console.log('跳转到登录页')
  // router.push('/login');
}
</script>

<style scoped></style>
