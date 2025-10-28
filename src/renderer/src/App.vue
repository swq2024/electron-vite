<script setup lang="ts">
import Versions from './components/Versions.vue'

// No args to send
const ipcSend1 = (): void => window.electron.ipcRenderer.send('ping1')
// Send a message to the main process with no response
const ipcSend2 = (): void => window.electron.ipcRenderer.send('electron:say', 'Hello from renderer')

// Send a message to the main process with the response asynchronously
const ipcInvoke = async (): Promise<void> => {
  const res = await window.electron.ipcRenderer.invoke('electron:doAThing', 'Say something')
  console.log(res)
}

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
</script>

<template>
  <button @click="ipcSend1">ipcSend1</button>
  <br />
  <button @click="ipcSend2">ipcSend2</button>
  <br />
  <button @click="ipcInvoke">ipcInvoke</button>
  <br />
  <hr />
  <RouterView />
  <Versions />
</template>

<style scoped>
hr {
  margin: 20px;
  border: 2px solid #ccc;
  width: 50vw;
}
</style>
