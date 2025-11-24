import { handleTokenOperations } from './auth'
import { handleLoginOperation } from './login'
import { handlePasswordOperation } from './password'
// 导入其他所有处理器

/**
  ipcMain.on 和 ipcMain.handle 的区别在于：
  ipcMain.on 用于监听渲染进程发送的异步消息，不会返回结果给渲染进程。
  ipcMain.handle 用于处理渲染进程发送的请求，并可以返回结果给渲染进程。
  */

export const registerIcpHandlers = (): void => {
  console.log('Registering all IPC handlers...')

  // 注册所有模块的 IPC 处理器
  handleTokenOperations()
  handlePasswordOperation()
  handleLoginOperation()

  console.log('All IPC handlers registered.')
}
