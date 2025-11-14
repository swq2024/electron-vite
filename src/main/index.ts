import { app, shell, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ChildProcess, spawn } from 'child_process'
import { registerIcpHandlers } from './services'
import { log } from './utils/logger'

log('Application starting...')

let backendChildProcess: ChildProcess | null = null

// 单实例锁定
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  // 如果未能获取锁，说明已经有实例在运行，直接退出当前实例
  app.quit()
} else {
  // 如果成功获取锁，则监听第二个实例的启动事件
  app.on('second-instance', () => {
    // 试图运行第二个实例时，应该聚焦到窗口
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function startBackendService(): void {
  // 后端入口文件路径（区分开发/生产环境）
  const backendEntry = app.isPackaged
    ? join(process.resourcesPath, 'backend', 'bin', 'www') // 打包后路径
    : join(__dirname, '../../../backend-service/bin/www') // 开发环境路径

  const port = process.env.VITE_ELECTRON_BACKEND_PORT || 3000

  // 启动后端子进程
  backendChildProcess = spawn('node', [backendEntry], {
    stdio: app.isPackaged ? 'pipe' : 'inherit' // 开发环境日志输出到控制台
  })

  // 监听后端输出日志 (仅在打包时有效)
  if (app.isPackaged) {
    backendChildProcess.stdout?.on('data', (data) => {
      console.log(`[backend-service]: ${data}`)
    })
    backendChildProcess.stderr?.on('data', (data) => {
      console.error(`[backend-error]: ${data}`)
    })
  }

  console.log(`backend is started, listening on port: ${port}`)
}

function createWindow(): void {
  try {
    startBackendService()
  } catch (error) {
    console.error('Failed to start server', error)
  }

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
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
    mainWindow.show()
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
    registerIcpHandlers()
    createWindow()
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
  try {
    if (backendChildProcess) {
      backendChildProcess.kill('SIGTERM')
      backendChildProcess = null
    }
  } catch (error) {
    console.error('Failed to kill backend process', error)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
