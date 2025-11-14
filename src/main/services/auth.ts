import { ipcMain, safeStorage, app } from 'electron'
import fs from 'fs'
import { join } from 'path'

/**
  ipcMain.on 和 ipcMain.handle 的区别在于：
  ipcMain.on 用于监听渲染进程发送的异步消息，不会返回结果给渲染进程。
  ipcMain.handle 用于处理渲染进程发送的请求，并可以返回结果给渲染进程。
  */
const TOKEN_FILE_PATH = join(app.getPath('userData'), 'tokens.enc')
export const handleTokenOperations = (): void => {
  ipcMain.handle('auth:saveTokens', (_, tokens) => {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('SafeStorage is not available on this system.')
      }

      const tokensString = JSON.stringify(tokens)
      const encryptedTokenString = safeStorage.encryptString(tokensString)

      fs.writeFileSync(TOKEN_FILE_PATH, encryptedTokenString)

      return { success: true }
    } catch (error) {
      console.error('Failed to save token:', error)
      return { success: false, error }
    }
  })

  ipcMain.handle('auth:getTokens', () => {
    if (!safeStorage.isEncryptionAvailable()) {
      return null
    }
    try {
      if (!fs.existsSync(TOKEN_FILE_PATH)) {
        return null
      }
      const encryptedTokenBuffer = fs.readFileSync(TOKEN_FILE_PATH)
      const tokenString = safeStorage.decryptString(encryptedTokenBuffer)
      return JSON.parse(tokenString)
    } catch (error) {
      console.error('Failed to decrypt token:', error)
      // 在读取或解密 token 失败时，可以尝试删除 token 文件
      // if (fs.existsSync(TOKEN_FILE_PATH)) {
      //   fs.unlinkSync(TOKEN_FILE_PATH)
      // }
      return null
    }
  })

  ipcMain.handle('auth:removeToken', () => {
    try {
      if (fs.existsSync(TOKEN_FILE_PATH)) {
        fs.unlinkSync(TOKEN_FILE_PATH)
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to decrypt token:', error)
      return { success: false, error }
    }
  })
}
