import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const logDir = path.join(app.getPath('userData'), 'logs')
const logFile = path.join(logDir, 'main.log')

export const log = (message: string, level = 'INFO'): void => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level}] ${message}\n`

  // 在开发环境输出到控制台
  if (app.isPackaged === false) {
    console.log(logMessage.trim())
  }

  // 在打包环境输出到文件
  if (app.isPackaged) {
    fs.appendFileSync(logFile, logMessage, 'utf8')
  }
}
