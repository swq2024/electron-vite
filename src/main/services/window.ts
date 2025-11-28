import { ipcMain, BrowserWindow, screen } from 'electron/main'

export const handleWindowOperation = (mainWindow: BrowserWindow): void => {
  /**
   * 登录成功后切换为主应用窗口大小
   */
  ipcMain.on('window:resize', (_, args) => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    if (mainWindow.isMinimized()) mainWindow.restore()

    const minWidth = 300
    const minHeight = 300
    const targetWidth = Math.max(minWidth, args.width)
    const targetHeight = Math.max(minHeight, args.height)

    const display = screen.getDisplayMatching(mainWindow.getBounds()) // 获取窗口当前所在显示器
    const workArea = display.workArea // // 适配显示器的缩放和分辨率，不包含任务栏
    const x = Math.floor(workArea.x + (workArea.width - targetWidth) / 2)
    const y = Math.floor(workArea.y + (workArea.height - targetHeight) / 2)
    mainWindow?.setBounds(
      {
        x,
        y,
        width: targetWidth,
        height: targetHeight
      },
      false // 禁用动画（部分系统默认有动画，可能导致闪烁）
    )
    mainWindow?.setResizable(args.resizable)
  })
  /**
   * 监听最小化窗口的 IPC 事件
   */
  ipcMain.on('window:minimize', () => {
    if (mainWindow) {
      mainWindow.minimize() // 调用窗口最小化方法
    }
  })
  /**
   * 监听关闭窗口的 IPC 事件
   */
  ipcMain.on('window:close', () => {
    if (mainWindow) {
      mainWindow.close() // 调用窗口关闭方法
    }
  })
}
