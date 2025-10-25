<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping1')

interface ElectronWindow extends Window {
  require?: unknown
  process?: { pid: number; type: string } // 使用最基本的 process 属性
}

if (window.electron?.ipcRenderer) {
  // 检查是否可以直接访问 require 或 process
  if ((window as ElectronWindow).require || (window as ElectronWindow).process) {
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
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <Versions />
</template>
