<script setup lang="ts">
import { objectOmit } from '@vueuse/core'
import { ref, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false
})

const loading = ref(false)

const attrs = useAttrs()
console.log('attrs=>', attrs)
const handleClick = async () => {
  loading.value = true
  // 调用父组件传递的点击事件
  try {
    await attrs.onClick?.()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-button v-bind="objectOmit($attrs, ['onClick'])" :loading="loading" @click="handleClick">
    <slot></slot>
  </el-button>
</template>

<style scoped></style>
