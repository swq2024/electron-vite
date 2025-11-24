import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
// ipcRenderer.send 和 ipcRenderer.invoke 区别在于:
// [ipcRenderer.send] send => on (单向) 用于发送异步消息，不会等待响应，仅会在主进程收到消息时触发回调函数
// [ipcRenderer.invoke] invoke <=> handle (双向) 用于发送异步消息，并等待响应，主进程需要使用 handle 方法处理该调用并返回响应

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 设置认证Token
   * @param {object} tokens 包含accessToken和refreshToken的字符串对象
   * @returns {Promise<void>} 返回一个Promise对象，用于等待主进程的响应
   */
  saveTokens: (tokens) => ipcRenderer.invoke('auth:saveTokens', tokens),
  /**
   * 获取认证Token
   * @returns {Promise<string>} 返回一个Promise对象，用于等待主进程的响应
   */
  getTokens: () => ipcRenderer.invoke('auth:getTokens'),
  /**
   * 删除认证Token
   */
  removeToken: () => ipcRenderer.invoke('auth:removeToken'),
  /**
   * 登录操作
   */
  loginWindowResize: (channel: string, data: windowProps) => {
    // 白名单验证，只允许特定的 IPC 通道
    const allowedChannels = ['resize-window']
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  /**
   * 注册事件监听器
   */
  on: (channel, listener) => {
    // 白名单验证，只允许特定的 IPC 通道
    const validChannels = ['login-failed']
    if (validChannels.includes(channel)) {
      // 避免直接暴露 listener，而是封装一层
      ipcRenderer.on(channel, (event, ...args) => {
        listener(event, ...args)
      })
    }
  }
})
