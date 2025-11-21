<template>
  <div class="flex flex-col space-y-4">
    <el-card shadow="never" class="flex">
      <el-form ref="userFormRef" :model="userForm" :rules="rules" label-width="auto">
        <el-form-item label="头像" prop="avatar">
          <div class="cursor-default">
            <el-avatar :src="userForm.avatar" fit="cover" :size="96" @error="handleAvatarError">
              <img :src="avatarFeedbackURL" alt="avatar" />
            </el-avatar>
          </div>
          <CropperItem @get-crop-img-data="getCropImgBlobData" />
        </el-form-item>
        <el-alert
          type="info"
          description="仅限支持 WEBP、JPG、PNG、AVIF 等格式且小于 2 M"
          show-icon
          :closable="false"
        />
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-end">
        <el-button type="primary" @click="submitForm(userFormRef)">更新</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CropperItem from '@renderer/views/components/CropperItem.vue'
import type { FormInstance, FormRules } from 'element-plus'

const avatarFeedbackURL = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const handleAvatarError = (): boolean => true
const blobData = ref({})
const currentImageType = ref('')

const getCropImgBlobData = ({ base64, blob, imgType }): void => {
  // 将base64赋值给头像字段，用于预览
  userForm.value.avatar = base64
  // 保存裁剪后的 Blob 数据
  blobData.value = blob
  // 保存裁剪后的图片类型，用于上传时确定文件类型
  currentImageType.value = imgType
}

interface UserForm {
  username: string
  email: string
  avatar: string
}

const userFormRef = useTemplateRef<FormInstance | undefined | null>('userFormRef')
const rules = ref<FormRules<UserForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }]
})
const userForm = ref<UserForm>({
  username: '',
  email: '',
  avatar: ''
})

const submitForm = async (formEl: FormInstance | undefined | null): Promise<void> => {
  if (!formEl) return
  try {
    await formEl.validate((valid, fields) => {
      if (!valid) {
        console.error('表单验证失败', fields)
      } else {
        // 提交表单逻辑
        console.log('submit!')
      }
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
:deep(.vue-cropper) {
  background: #f5f5f5;
  border-radius: 8px;
  min-height: 400px;
}
:deep(.el-form-item:first-child) {
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-alert) {
  width: 420px;
  height: 32px;
  margin: 0 0 20px 40px;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
