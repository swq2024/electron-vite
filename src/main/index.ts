import { app, shell, globalShortcut } from 'electron'
import { BrowserWindow } from 'electron/main'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerIcpHandlers } from './services'
import { log } from './utils/logger'

log('Application starting...')

let mainWindow: BrowserWindow | null = null

// 单实例锁定
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  // 如果未能获取锁，说明已经有实例在运行，直接退出当前实例
  app.quit()
} else {
  // 如果成功获取锁，则监听第二个实例的启动事件
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 500, // 初始宽度（登录页大小）
    height: 500, // 初始高度（登录页大小）
    resizable: false, // 禁止窗口调整大小
    frame: false, // 去除窗口边框
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    ...(process.platform === 'linux' ? { icon } : {}),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: join(__dirname, '../preload/index.js'),
      devTools: app.isPackaged ? false : true,
      scrollBounce: process.platform === 'darwin'
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url) // 使用默认浏览器打开链接
    return { action: 'deny' } // 阻止在应用内打开新窗口
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
  }
}

app.whenReady().then(async () => {
  try {
    createWindow()
    if (!mainWindow) {
      throw new Error('Failed to create main window')
    }
    registerIcpHandlers(mainWindow)
  } catch (error) {
    console.error('Failed to create main window', error)
    app.quit()
  }

  electronApp.setAppUserModelId('com.yuhuo.keyvault-desktop')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
