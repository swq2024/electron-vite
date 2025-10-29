import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  pingFn: () => ipcRenderer.invoke('ping2'),
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  // ipcRenderer.send 和 ipcRenderer.invoke 区别在于:
  // [ipcRenderer.send] send => on (单向) 用于发送异步消息，不会等待响应，仅会在主进程收到消息时触发回调函数
  // [ipcRenderer.invoke] invoke <=> handle (双向) 用于发送异步消息，并等待响应，主进程需要使用 handle 方法处理该调用并返回响应
  // 接收来自主进程的消息
  onUpdateCounter: (callback: (val: number) => void) =>
    ipcRenderer.on('update-counter', (_, val) => callback(val)),
  outCounterValue: (value: number) => ipcRenderer.send('counter-value', value)
}
// Database operations API
const dbOperations = {}

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
