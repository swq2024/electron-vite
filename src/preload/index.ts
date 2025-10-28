import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  pingFn: () => ipcRenderer.invoke('ping2')
}
// Database operations API
const dbOperations = {
  createUser: (user: User) =>
    ipcRenderer.invoke('user-create', {
      ...user,
      age: import.meta.env.PRELOAD_VITE_KEY // 测试: 测试环境变量(仅预加载脚本可用)在预加载脚本中的使用
    }),
  findAllUsers: () => ipcRenderer.invoke('user-find-all')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('db', dbOperations)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
