import { BrowserWindow } from 'electron/main'
import { handleTokenOperations } from './auth'
import { handleWindowOperation } from './window'
import { handlePasswordOperation } from './password'
// 导入其他所有处理器

/**
  ipcMain.on 和 ipcMain.handle 的区别在于：
  ipcMain.on 用于监听渲染进程发送的异步消息，不会返回结果给渲染进程。
  ipcMain.handle 用于处理渲染进程发送的请求，并可以返回结果给渲染进程。
  */

export const registerIcpHandlers = (mainWindow: BrowserWindow | null): void => {
  console.log('Registering all IPC handlers...')
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.log('mainWindow is not available')
    return
  }

  // 注册所有模块的 IPC 处理器
  handleTokenOperations()
  handlePasswordOperation()
  handleWindowOperation(mainWindow)

  console.log('All IPC handlers registered.')
}
