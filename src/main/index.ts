import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import 'reflect-metadata' // 引入 reflect-metadata 以启用装饰器元数据支持
import { AppDataSource } from './database/data-source'
import { User } from './database/entities/user/user'

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
  // 打开开发者工具，并将其分离为一个单独的窗口
  // mainWindow.webContents.openDevTools({
  //   mode: 'detach',
  //   activate: true
  // })

  // HMR for renderer base on electron-vite cli.
  // 热更新基于 electron-vite cli。
  // Load the remote URL for development or the local html file for production.
  // 中文注释: 对于开发环境，加载远程 URL；对于生产环境，加载本地 HTML 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
  }
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
  // 处理来自渲染进程的 'ping2' 请求，并返回 'pong from main process' 字符串作为响应
  ipcMain.handle('ping2', () => 'pong from main process')
  // 处理来自渲染进程的 'electron:doAThing' 请求，并返回渲染进程携带的参数 'arg' 与字符串 'from main process' 的拼接结果作为响应
  ipcMain.handle('electron:doAThing', (_, arg) => {
    return arg + ' from main process'
  })

  // 初始化数据库连接
  try {
    await AppDataSource.initialize()
    console.log('Data Source has been initialized!')
  } catch (err) {
    console.error('Error during Data Source initialization:', err)
    // 按需决定是否退出 app
    // process.exit(1)
  }

  const userRepository = AppDataSource.getRepository(User)
  const newUser = userRepository.create({
    name: 'Alice',
    age: 18,
    hobby: 'Reading'
  })
  // 新增用户
  const user = await userRepository.findOneBy({ name: newUser.name })
  if (!user) {
    await userRepository.save(newUser)
    console.log('New user saved:', newUser)
  } else {
    console.log('User already exists:', newUser.name)
  }
  // 查询所有用户
  const users = await userRepository.find()
  if (users.length > 0) {
    console.log('Users:', users)
  } else {
    console.log('No users found in the database.')
  }
  // 更新用户
  const userToUpdate = await userRepository.findOneBy({ name: 'Alice' })
  if (userToUpdate) {
    userToUpdate.age = 20
    await userRepository.save(userToUpdate)
    console.log('User updated:', userToUpdate)
  } else {
    console.log('No user found to update with name:', 'Alice')
  }

  // 删除用户
  // const res = await userRepository.delete({ name: 'Alice' })
  // if (res.affected && res.affected > 0) {
  //   console.log('User deleted:', 'Alice')
  // } else {
  //   console.log('No user found to delete with name:', 'Alice')
  // }
  // 暴露数据库操作 API 给渲染进程
  ipcMain.handle('user-create', async (_, payload) => {
    const user = userRepository.create(payload)
    return await userRepository.save(user)
  })
  ipcMain.handle('user-find-all', async () => {
    return await userRepository.find()
  })
  createWindow()

  // 在 macOS 上，当点击 Dock 图标并且没有其他窗口打开时，通常会重新创建一个窗口。
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
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
