import { ipcMain, safeStorage, app } from 'electron'
import fs from 'fs'
import { join } from 'path'

/**
  ipcMain.on 和 ipcMain.handle 的区别在于：
  ipcMain.on 用于监听渲染进程发送的异步消息，不会返回结果给渲染进程。
  ipcMain.handle 用于处理渲染进程发送的请求，并可以返回结果给渲染进程。
  */
const TOKEN_FILE_PATH = join(app.getPath('userData'), 'auth-token.bin')
export const handleTokenOperations = (): void => {
  ipcMain.handle('set-token', (_, token) => {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        console.error('Encryption is not available on this platform')
        return { success: false, error: 'System encryption not available' }
      }

      const encryptedToken = safeStorage.encryptString(token)

      fs.writeFileSync(TOKEN_FILE_PATH, encryptedToken)

      return { success: true }
    } catch (error) {
      console.error('Failed to encrypt and save token:', error)
      return { success: false, error }
    }
  })

  ipcMain.handle('get-token', () => {
    try {
      if (!fs.existsSync(TOKEN_FILE_PATH)) {
        return null
      }
      const encryptedToken = fs.readFileSync(TOKEN_FILE_PATH)
      const token = safeStorage.decryptString(encryptedToken)
      return token
    } catch (error) {
      console.error('Failed to decrypt token:', error)
      // 在读取或解密 token 失败时，可以尝试删除 token 文件
      if (fs.existsSync(TOKEN_FILE_PATH)) {
        fs.unlinkSync(TOKEN_FILE_PATH)
      }
      return null
    }
  })

  ipcMain.handle('remove-token', () => {
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
