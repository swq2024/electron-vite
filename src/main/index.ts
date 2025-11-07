import { app, shell, BrowserWindow, ipcMain, Menu, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import 'reflect-metadata' // 引入 reflect-metadata 以启用装饰器元数据支持
import { ChildProcess, spawn } from 'child_process'

let backendChildProcess: ChildProcess | null = null

function startBackendService(): void {
  // 后端入口文件路径（区分开发/生产环境）
  const backendEntry = app.isPackaged
    ? join(process.resourcesPath, 'backend', 'bin', 'www') // 打包后路径
    : join(__dirname, '../../../backend-service/bin/www') // 开发环境路径（根据实际项目调整）

  // 端口（可动态检测是否占用，这里简化为固定值）
  const port = 3000

  // 启动后端子进程，传入端口参数作为命令行参数，并设置标准输出和错误输出的处理方式
  backendChildProcess = spawn('node', [backendEntry, port.toString()], {
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

function handleSetTitle(event: Electron.IpcMainEvent, title: string): void {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.setTitle(title)
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // 设置为 false 以在窗口创建时隐藏它，以便在准备好后再显示。
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}), // 设置窗口图标，仅在 Linux 上有效
    webPreferences: {
      // 这里为什么使用.js 文件而不是 .ts 文件？
      // 详情参见：https://cn.electron-vite.org/guide/typescript-decorator
      // 需要通过构建工具(这里使用由 swc[https://swc.rs/] 驱动 swcPlugin 插件)将其转换为 JavaScript。
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, // 设置为 false 以启用 Node.js 支持，以便在渲染器进程中访问 Node.js API
      webSecurity: false, // 设置为 false 以禁用 Web 安全策略，以便在渲染器进程中加载本地文件或执行 Node.js API
      devTools: import.meta.env.VITE_NODE_ENV === 'development', // 设置为 true 以在开发模式下启用开发者工具
      scrollBounce: process.platform === 'darwin' // 设置滚动反弹效果(橡皮动画)，仅在 macOS 上有效
      // contextIsolation: false, // 设置为 false 以禁用上下文隔离，以便在渲染器进程中直接访问 Node.js 模块 强烈不推荐
      // nodeIntegration: true // 启用 Node.js 集成 以允许在渲染器进程中使用 Node.js 模块 同样不推荐
    }
  })
  // 当窗口准备好时显示它
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 阻止新窗口的创建，而是使用默认浏览器打开链接
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 主进程到渲染器进程, 主要是构建一个由原生操作系统菜单控制的数字计数器。
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    },
    {
      label: 'DevTools',
      click: () => mainWindow.webContents.openDevTools({ mode: 'bottom' }),
      accelerator: 'F12'
    }
  ])
  Menu.setApplicationMenu(menu)

  // HMR for renderer base on electron-vite cli.
  // 热更新基于 electron-vite cli。
  // Load the remote URL for development or the local html file for production.
  // 中文注释: 对于开发环境，加载远程 URL；对于生产环境，加载本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
  }

  // 打开开发者工具，并将其分离为一个单独的窗口
  // mainWindow.webContents.openDevTools({
  //   mode: 'bottom'
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 某些 API 只能在此事件发生后使用。
app.whenReady().then(async () => {
  // Set app user model id for windows
  // 设置 Windows 的应用用户模型 ID，以便在 Windows 任务栏上正确显示图标。
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  // 默认在开发环境下通过 F12 打开或关闭开发者工具
  // 在生产环境下忽略 CommandOrControl + R 刷新快捷键。
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  try {
    startBackendService() // 启动后端服务函数
  } catch (error) {
    console.error('Failed to start server', error)
  }

  /**
  ipcMain.on 和 ipcMain.handle 的区别在于：
  ipcMain.on 用于监听渲染进程发送的异步消息，不会返回结果给渲染进程。
  ipcMain.handle 用于处理渲染进程发送的请求，并可以返回结果给渲染进程。
  */

  // 监听来自渲染进程的 'ping' 消息，并在终端打印出 'pong'
  ipcMain.on('ping1', () => console.log('pong'))
  // 监听来自渲染进程的 'electron:say' 消息，并在终端打印出渲染进程携带的参数 'arg', 此处是 'Hello from renderer' 字符串
  ipcMain.on('electron:say', (_, arg) => {
    console.log('electron:say', arg)
  })
  // 监听来自渲染进程的 'set-title' 消息，并设置窗口标题为传递过来的参数
  ipcMain.on('set-title', handleSetTitle)
  // 监听来自渲染进程的 'counter-value' 消息，并在终端打印出传递过来的参数
  ipcMain.on('counter-value', (_, value) => {
    console.log('counter-value', value)
  })

  // 处理来自渲染进程的 'ping2' 请求，并返回 'pong from main process' 字符串作为响应
  ipcMain.handle('ping2', () => 'pong from main process')
  // 处理来自渲染进程的 'electron:doAThing' 请求，并返回渲染进程携带的参数 'arg' 与字符串 'from main process' 的拼接结果作为响应
  ipcMain.handle('electron:doAThing', (_, arg) => {
    return arg + ' from main process'
  })

  // 在创建窗口之前, 启动后端服务器

  createWindow()

  // 在 macOS 上，当点击 Dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口。
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll() // 注销所有全局快捷键
  if (backendChildProcess) {
    backendChildProcess.kill('SIGTERM') // 发送 SIGTERM 信号以优雅地关闭后端服务
    backendChildProcess = null // 清除后端子进程的引用
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// 当所有窗口关闭时退出应用程序，除了在 macOS 上。因为在 macOS 上，应用程序和菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 在这个文件中，你可以包含你的应用程序的其余特定主进程代码。
// 你也可以将它们放在单独的文件中并在这里引用它们。
