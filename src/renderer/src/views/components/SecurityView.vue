<template>
  <div>
    <h3 class="font-bold">安全与认证</h3>
    <div class="flex flex-col space-y-4 mt-3">
      <el-card shadow="never">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <p>主密码管理</p>
            <el-button
              type="primary"
              icon="Edit"
              text
              size="small"
              @click="router.push('/settings/masterPasswd')"
              >修改</el-button
            >
          </div>
          <div>
            <p class="text-gray-400 text-xs">
              您的主密码是加密您所有数据的唯一密钥。请确保其强度足够高
            </p>
          </div>
          <div class="flex justify-start items-center">
            <span>主密码强度评分：</span>
            <el-rate
              v-model="rateValue"
              :max="5"
              size="small"
              disabled
              :colors="['red', 'yellow', 'green']"
              show-text
              text-color="#ff9900"
              :texts="['极弱', '弱', '一般', '强', '极强']"
              class="ml2"
            />
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <p>双因素认证(2FA)</p>
            <el-text :type="switchValue ? 'success' : 'danger'" size="small">
              {{ switchValue ? '已启用' : '未启用' }}
            </el-text>
          </div>
          <div>
            <p class="text-gray-400 text-xs">
              双因素认证可以提高您的账户安全性，但需要您在登录时输入验证码。
            </p>
          </div>
          <div class="flex justify-start items-center">
            <span>双因素认证状态：</span>
            <el-switch
              v-model="switchValue"
              :loading="isLoading"
              :before-change="handleBeforeChange"
            />
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <p>活动会话</p>
            <el-button
              type="primary"
              text
              size="small"
              icon="Memo"
              @click="router.push('/settings/session')"
            >
              查看全部
            </el-button>
          </div>
          <div>
            <p class="text-gray-400 text-xs">
              当前登录的设备列表。如果您在多个设备上登录，可以随时注销其他设备上的会话。
            </p>
          </div>
          <div class="flex flex-col">
            <li class="flex justify-between">
              <div class="flex items-center space-x-3">
                <div>
                  <el-icon color="blue"><Monitor /></el-icon>
                </div>
                <div class="flex flex-col">
                  <p class="text-sm">设备名称： Windows 10</p>
                  <p class="text-xs text-gray-500">IP地址： 192.168.1.1</p>
                </div>
              </div>
              <div>
                <div class="text-xs">
                  <span>登录时间：</span>
                  <span>2025-11-22 12:00:00</span>
                </div>
                <div class="flex justify-end">
                  <el-button type="info" text size="small" icon="Remove">移除</el-button>
                </div>
              </div>
            </li>
            <el-divider />
            <li class="flex justify-between">
              <div class="flex items-center space-x-3">
                <div>
                  <el-icon color="green"><Iphone /></el-icon>
                </div>
                <div class="flex flex-col">
                  <p class="text-sm">设备名称： iPhone 16 Pro</p>
                  <p class="text-xs text-gray-500">IP地址： 134.121.123.123</p>
                </div>
              </div>
              <div>
                <div class="text-xs">
                  <span>登录时间：</span>
                  <span>2025-11-21 9:00:00</span>
                </div>
                <div class="flex justify-end">
                  <el-button type="info" text size="small" icon="Remove">移除</el-button>
                </div>
              </div>
            </li>
            <el-divider />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const rateValue = ref(3.7)
const switchValue = ref(false)
const isLoading = ref(false)

// 若返回 false 或者返回 Promise 且被 reject，则停止切换
const handleBeforeChange = (): Promise<boolean> => {
  // Handle switch change logic here
  isLoading.value = true
  // 传递给接口即将变化的值(变化之前的值取反)
  const switchingValue = !switchValue.value
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const result = await someAsyncFunction(switchingValue)
      if (result) {
        isLoading.value = false
        ElMessage({
          message: 'Switch value changed: ' + !switchValue.value,
          type: 'success'
        })
        resolve(true)
      } else {
        isLoading.value = false
        ElMessage({
          message: 'Switch value change failed',
          type: 'error'
        })
        reject(false)
      }
    }, 1000)
  })
}
</script>

<style scoped></style>
