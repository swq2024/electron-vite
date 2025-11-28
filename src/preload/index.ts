import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
// ipcRenderer.send 和 ipcRenderer.invoke 区别在于:
// [ipcRenderer.send] send => on (单向) 用于发送异步消息，不会等待响应，仅会在主进程收到消息时触发回调函数
// [ipcRenderer.invoke] invoke <=> handle (双向) 用于发送异步消息，并等待响应，主进程需要使用 handle 方法处理该调用并返回响应

contextBridge.exposeInMainWorld('authAPI', {
  /**
   * 设置认证Token
   * @param {object} tokens 包含accessToken和refreshToken的字符串对象
   * @returns {Promise<void>} 返回一个Promise对象, 用于等待主进程的响应
   */
  saveTokens: (tokens: { accessToken: string; refreshToken: string }): Promise<void> => {
    return ipcRenderer.invoke('auth:saveTokens', tokens)
  },
  /**
   * 获取认证Token
   * @returns {Promise<IToken | null>} 返回一个Promise对象，用于等待主进程的响应
   */
  getTokens: (): Promise<IToken | null> => ipcRenderer.invoke('auth:getTokens'),
  /**
   * 删除认证Token
   */
  removeToken: (): Promise<void> => {
    return ipcRenderer.invoke('auth:removeToken')
  },
  /**
   * 登录操作
   */
  windowResize: (data: windowProps): void => {
    return ipcRenderer.send('window:resize', data)
  },
  /**
   * 最小化窗口
   */
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  /**
   * 关闭窗口
   */
  closeWindow: () => ipcRenderer.send('window:close')
})
