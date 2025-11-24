<template>
  <div>
    <BreadcrumbItem />
    <div class="reset-password-container">
      <el-card class="reset-password-card">
        <!-- 动态页面标题 -->
        <div class="page-title">{{ pageTitle }}</div>

        <!-- 1. 选择验证方式（初始页面） -->
        <div v-if="currentStage === 'selectMethod'" class="form-container">
          <div class="desc">请选择一种方式验证身份，完成密码重置</div>
          <el-button type="primary" class="method-btn" icon="Message" @click="goToVerifyCode">
            邮箱验证码验证
          </el-button>
          <el-button
            type="success"
            class="method-btn"
            icon="Lock"
            @click="goToResetPassword('password')"
          >
            验证当前密码
          </el-button>
        </div>

        <!-- 2. 邮箱验证码验证（分支1） -->
        <div v-if="currentStage === 'verifyCode'" class="form-container">
          <el-form ref="codeFormRef" :model="form" :rules="codeRules" label-width="100px">
            <el-form-item label="注册邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入绑定的邮箱" clearable />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-input v-model="form.code" placeholder="请输入6位验证码" clearable />
                </el-col>
                <el-col :span="10">
                  <el-button type="primary" :disabled="remaining < 60" @click="sendCode">
                    {{ remaining < 60 ? `${remaining}秒后重发` : '获取验证码' }}
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="form-actions">
              <el-button type="default" @click="goToSelectMethod">返回</el-button>
              <el-button type="primary" @click="verifyCodeAndNext">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 3. 重置密码（共用页面，分支1和分支2都会进入） -->
        <div v-if="currentStage === 'resetPassword'" class="form-container">
          <el-form
            ref="passwordFormRef"
            :model="form"
            :rules="getPasswordRules"
            label-width="100px"
          >
            <!-- 只有选择「验证当前密码」时，才显示当前密码输入框 -->
            <el-form-item
              v-if="verifyMethod === 'password'"
              label="当前密码"
              prop="currentPassword"
            >
              <el-input
                v-model="form.currentPassword"
                type="password"
                placeholder="请输入您的当前密码"
                prefix="el-icon-lock"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="form.newPassword"
                type="password"
                placeholder="8-20位，包含字母和数字"
                prefix="el-icon-lock"
                @input="checkPasswordStrength"
              />
              <!-- 密码强度提示 -->
              <div class="password-strength mt-2">
                <div class="strength-text">强度：{{ passwordStrengthText }}</div>
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

            <el-form-item class="form-actions">
              <el-button type="default" @click="goBack()">返回</el-button>
              <el-button type="primary" @click="submitResetPassword">提交重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 4. 重置成功（最终页面） -->
        <div v-if="currentStage === 'success'" class="success-container text-center">
          <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
          <h3 class="success-title">密码重置成功！</h3>
          <p class="success-desc">您的密码已更新，请使用新密码登录</p>
          <el-button type="primary" class="mt-4" @click="goToLogin">返回登录页</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import BreadcrumbItem from './BreadcrumbItem.vue'
import { useCountdown } from '@vueuse/core'

// 核心状态：控制当前显示的页面阶段（无需步骤条，直接映射页面）
type CurrentStage = 'selectMethod' | 'verifyCode' | 'resetPassword' | 'success'
const currentStage = ref<CurrentStage>('selectMethod') // 初始阶段：选择验证方式

// 选择的验证方式（记录用户选择，用于控制表单显示）
const verifyMethod = ref<string | null>(null)

// 表单引用
const codeFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

// 其他状态
// const countdown = ref(0)
const passwordStrength = ref(0)
const passwordStrengthText = ref('弱')

// 表单数据
const form = reactive({
  email: '',
  code: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 动态页面标题（随当前阶段变化，让用户明确当前操作）
const pageTitle = computed(() => {
  switch (currentStage.value) {
    case 'selectMethod':
      return '重置密码'
    case 'verifyCode':
      return '验证邮箱身份'
    case 'resetPassword':
      return '设置新密码'
    case 'success':
      return '操作成功'
    default:
      return '重置密码'
  }
})

// 表单规则
const codeRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
})

// 动态密码规则（根据验证方式，决定是否校验当前密码）
const getPasswordRules = computed<FormRules>(() => {
  const baseRules = {
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
        pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/,
        message: '密码需8-20位，包含字母和数字',
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (_, value: string, callback: (error?: Error) => void) => {
          if (value !== form.newPassword) callback(new Error('两次密码不一致'))
          else callback()
        },
        trigger: 'blur'
      }
    ]
  }

  // 如果是「验证当前密码」方式，添加当前密码的校验规则
  if (verifyMethod.value === 'password') {
    return {
      currentPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' },
        { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
      ],
      ...baseRules
    }
  }

  return baseRules
})

// 1. 选择验证方式 → 邮箱验证码页面
const goToVerifyCode = (): void => {
  verifyMethod.value = 'code'
  currentStage.value = 'verifyCode'
}

// 2. 选择验证方式 → 重置密码页面（当前密码方式）
const goToResetPassword = (method: string): void => {
  verifyMethod.value = method
  currentStage.value = 'resetPassword'
}

// 3. 验证邮箱通过 → 重置密码页面
const verifyCodeAndNext = async (): Promise<void> => {
  if (!codeFormRef.value) return
  await codeFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟验证码校验（实际项目中调用API）
      ElMessage.success('邮箱验证通过！')
      currentStage.value = 'resetPassword' // 直接跳转到设置新密码页面
    } else {
      ElMessage.error('请完成邮箱验证')
    }
  })
}

// 4. 返回上一页（根据当前阶段智能返回）
const goBack = (): void => {
  if (currentStage.value === 'verifyCode') {
    currentStage.value = 'selectMethod' // 验证码页面 → 选择方式
  } else if (currentStage.value === 'resetPassword') {
    // 重置密码页面 → 选择方式（如果是验证码分支，也返回选择页，简化逻辑）
    goToSelectMethod()
  }
}

// 5. 返回到选择验证方式页面
const goToSelectMethod = (): void => {
  currentStage.value = 'selectMethod'
  // 重置表单数据（可选，提升体验）
  form.email = ''
  form.code = ''
  countdown.value = 0
}

// --------------- 核心功能逻辑 ---------------
const countdown = shallowRef(60)
const { remaining, start, reset } = useCountdown(countdown, {
  onComplete() {
    reset(countdown.value)
  },
  onTick() {
    console.log('倒计时剩余时间：', remaining.value)
  }
})

// 发送验证码
const sendCode = (): void => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  // 模拟发送验证码（实际项目中调用API）
  if (remaining.value === 60) {
    start()
  }
  ElMessage.success('验证码已发送至您的邮箱')
}

// 检查密码强度
const checkPasswordStrength = (value: string): void => {
  let strength = 0
  if (value.length >= 8) strength++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++
  if (/[0-9]/.test(value)) strength++
  passwordStrength.value = strength
  passwordStrengthText.value = strength === 1 ? '弱' : strength === 2 ? '中' : '强'
}

// 提交重置密码
const submitResetPassword = async (): Promise<void> => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟重置密码API请求
      setTimeout(() => {
        currentStage.value = 'success' // 直接跳转到成功页面
      }, 800)
    } else {
      ElMessage.error('请检查密码输入')
    }
  })
}

// 返回登录页
const goToLogin = (): void => {
  console.log('跳转到登录页')
  // 实际项目中使用路由跳转：router.push("/login");
}
</script>

<style scoped>
/* 页面整体样式 */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f7fa;
  padding: 20px;
  margin-top: 20px;
}

/* 卡片样式（简洁居中） */
.reset-password-card {
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 30px 20px;
}

/* 页面标题（突出显示，让用户明确当前操作） */
.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 25px;
}

/* 表单容器（统一间距） */
.form-container {
  width: 100%;
}

/* 描述文本（辅助说明） */
.desc {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

/* 验证方式按钮（横向排列，间距适中） */
.method-btn {
  width: 45%;
  margin: 0 8px 15px;
  padding: 12px 0;
}

/* 表单操作按钮（靠右对齐） */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* 密码强度样式 */
.password-strength {
  width: 100%;
}
.strength-text {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.strength-bars {
  display: flex;
  gap: 4px;
  height: 6px;
}
.strength-bar {
  flex: 1;
  background-color: #eee;
  border-radius: 3px;
  transition: background-color 0.3s;
}
.strength-1 {
  background-color: #ff4d4f;
}
.strength-2 {
  background-color: #faad14;
}
.strength-3 {
  background-color: #52c41a;
}

/* 成功页面样式 */
.success-container {
  padding: 20px 0;
}
.success-icon {
  font-size: 56px;
  color: #52c41a;
  margin-bottom: 15px;
}
.success-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.success-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

/* 响应式适配（小屏幕下按钮纵向排列） */
@media (max-width: 480px) {
  .method-btn {
    width: 100%;
    margin: 0 0 15px;
  }
  .form-actions {
    flex-direction: column;
  }
  .form-actions el-button {
    width: 100%;
  }
}
</style>
