<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping1')

// 检查是否可以直接访问 Node.js API
if (window.electron?.ipcRenderer) {
  if ('require' in window || 'process' in window) {
    console.log('Context Isolation 未启用')
  } else {
    console.log('Context Isolation 已启用（通过 contextBridge 暴露的 API）')
  }
} else {
  console.log('未找到 electron API')
}

const fn = async (): Promise<void> => {
  const res = await window.api.pingFn()
  console.log(res)
}
fn()

const createUser = async (): Promise<void> => {
  const res = await window.db.createUser({
    name: 'Alice',
    age: 18,
    hobby: 'Reading'
  })
  console.log('createUser:', res)
}
</script>

<template>
  <Versions />
</template>
