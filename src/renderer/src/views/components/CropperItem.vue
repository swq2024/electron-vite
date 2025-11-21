<template>
  <div class="ml-3">
    <el-upload
      ref="uploadRef"
      accept="image/*"
      :auto-upload="true"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-change="handleFileChange"
      :http-request="handleHttpRequest"
    >
      <el-button>选择头像</el-button>
    </el-upload>

    <el-dialog v-model="cropDialogVisible" width="70%" top="2vh" destroy-on-close draggable>
      <template #header>
        <span class="text-xl font-semibold">裁剪头像</span>
      </template>

      <template #default>
        <div class="flex justify-around">
          <div class="w-[540px] h-[450px] relative">
            <VueCropper
              v-if="option.cropImg"
              ref="cropperRef"
              class="w-full h-full rounded overflow-hidden"
              :img="option.cropImg"
              :autoCrop="option.autoCrop"
              :autoCropHeight="option.autoCropHeight"
              :autoCropWidth="option.autoCropWidth"
              :canMove="option.canMove"
              :canScale="option.canScale"
              :centerBox="option.centerBox"
              :fixed="option.fixed"
              :fixedBox="option.fixedBox"
              :fixedNumber="option.fixedNumber"
              :info="option.info"
              :canMoveBox="option.canMoveBox"
              :info-true="option.infoTrue"
              :mode="option.mode"
              :origin="option.origin"
              :outputSize="option.outputSize"
              :outputType="option.outputType"
              @realTime="onRealTime"
            />

            <p class="absolute text-center w-full bottom-3 text-light-50/75 text-xs">
              鼠标滚轮缩放控制图片显示大小，鼠标拖拽调整显示位置
            </p>
            <div class="flex justify-start mt-5">
              <el-button v-if="option.cropImg" text bg :icon="ArrowPathIcon" @click="restartUpload">
                重新选择
              </el-button>
              <el-button :icon="ArrowDownTrayIcon" circle @click="downloadPreView" />
            </div>
          </div>

          <div
            class="w-50 h-container bg-gray-200/45 rounded flex justify-center items-center flex-col space-y-3"
          >
            <div :style="getPreviewStyle">
              <div :style="previews.div">
                <img :src="previews.url" :style="previews.img" alt="" />
              </div>
            </div>

            <div class="flex justify-center items-center">
              <p class="text-sm cursor-default">预览</p>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <el-button type="primary" @click="confirmCrop">确定</el-button>
        <el-button @click="cropDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { ref, computed, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const cropperEl = useTemplateRef('cropperRef')
const cropDialogVisible = ref(false)
const currentImageType = ref('')

const option = ref({
  autoCrop: true, // 是否默认生成截图框
  autoCropHeight: 300, // 默认生成截图框宽度(默认值：容器的 80%, 可选值：0 ~ max), 真正裁剪出来的图片的宽度为 autoCropHeight * 1.25
  autoCropWidth: 300, // 默认生成截图框宽度(默认值：容器的 80%, 可选值：0 ~ max), 真正裁剪出来的图片的宽度为 autoWidth * 1.25
  canMove: true, // 上传图片是否可以移动
  canScale: true, // 图片是否允许滚轮缩放
  centerBox: true, // 截图框是否被限制在图片里面
  canMoveBox: true, //截图框能否拖动
  fixed: true, // 是否固定截图框的宽高比例
  fixedBox: false, // 是否固定截图框大小
  fixedNumber: [1, 1], // 截图框的宽高比例([ 宽度 , 高度 ])
  cropImg: '', // 裁剪图片的地址(可选值：url 地址, base64, blob)
  info: false, // 是否显示裁剪框的宽高信息
  infoTrue: true, // infoTrue为 true 时裁剪框显示的是预览图片的宽高信息,infoTrue为 false 时裁剪框显示的是裁剪框的宽高信息
  mode: 'contain', // 截图框可拖动时的方向(可选值：contain , cover, 100px, 100% auto)
  origin: false, // 上传的图片是否按照原始比例渲染
  outputSize: 1, // 裁剪生成图片的质量(可选值：0.1 ~ 1)
  outputType: 'png' // 裁剪生成图片的格式(可选值：png, jpeg, webp)  不用在 BeforeUpload 中提前获取file.type
})

const restartUpload = (): void => {
  document.querySelector('.el-upload .el-button')?.click()
}

const previews = ref({})
const onRealTime = (data): void => {
  previews.value = data
}

const getPreviewStyle = computed(() => {
  return {
    width: previews.value.w + 'px',
    height: previews.value.h + 'px',
    overflow: 'hidden',
    'border-radius': '50%',
    zoom: '0.5'
  }
})

const beforeAvatarUpload = (file): boolean => {
  currentImageType.value = file.type.split('/')[1]

  if (!/(webp|jpg|jpeg|png|avif)$/i.test(currentImageType.value)) {
    ElMessage.error('请上传WEBP、JPG、PNG 或 AVIF 格式的图片。')
    return false
  }
  // 大小限制在后端处理
  return true
}

const handleFileChange = (file): void => {
  if (file.status === 'ready') return

  const reader = new FileReader()
  reader.onload = async (e) => {
    let data
    if (typeof e.target?.result === 'object') {
      // 把 Array Buffer 转化为 blob
      data = window.URL.createObjectURL(new Blob([e.target?.result]))
    } else {
      // 如果是 base64 字符串，直接赋值给 cropImage 用于预览
      data = e.target?.result
    }
    option.value.cropImg = data

    cropDialogVisible.value = true
    // previews.value = {} // 重置预览图片，避免上一次预览的图片还在
    // cropperRef.value.reset() // 重置裁剪框位置和大小
  }

  // 转化为base64，用于预览
  reader.readAsDataURL(file.raw)

  // 转化为blob，用于添加到formData上传
  // reader.readAsArrayBuffer(file.raw)
}

const handleHttpRequest = (options): void => {
  // 模拟上传成功
  options.onSuccess('上传成功')
}

const downloadPreView = (): void => {
  const aLink = document.createElement('a')
  aLink.download = 'preview.png'
  aLink.style.display = 'none'
  document.body.appendChild(aLink)

  cropperEl.value.getCropBlob((blob) => {
    aLink.href = window.URL.createObjectURL(blob)
    aLink.click()
    // 清理DOM
    document.body.removeChild(aLink)
    // 清理URL对象
    window.URL.revokeObjectURL(aLink.href)
  })
}

const emit = defineEmits(['getCropImgData'])

const confirmCrop = (): void => {
  // 获取裁剪后的图片数据（blob） 传递给父组件进行预览
  cropperEl.value.getCropBlob((blob) => {
    const base64 = window.URL.createObjectURL(blob)
    emit('getCropImgData', {
      base64,
      blob,
      imgType: currentImageType.value // 图片类型，用于上传时
    })
  })
  cropDialogVisible.value = false
}
</script>

<style scoped></style>
