<template>
  <div>
    <button @click="triggerError">点击触发错误</button>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    triggerError() {
      // 故意制造一个错误
      throw new Error('这是一个测试错误')
    }
  }
}
</script>
