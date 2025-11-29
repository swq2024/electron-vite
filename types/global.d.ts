/// <reference types="@electron-toolkit/preload" />
interface IUserProfile {
  status: boolean
  message: string
  data: {
    user: {
      id: string
      username: string
      email: string
      avatar: string | null
      role: string
      isActive: boolean
      failedLoginAttempts: number
      lockedUntil: Date | null
      masterPasswordHint: string | null
      twoFactorEnabled: boolean
      lastLogin: Date | null
      createdAt: Date
      updatedAt: Date
    }
  }
}

interface IToken {
  accessToken: string
  refreshToken: string
}

interface windowProps {
  width: number
  height: number
  resizable: boolean
}

interface Window {
  authAPI: {
    saveTokens: (token: IToken) => Promise<void>
    getTokens: () => Promise<IToken | null>
    removeTokens: () => Promise<void>
    windowResize: (data: windowProps) => Promise<void>
    minimizeWindow: () => Promise<void>
    closeWindow: () => Promise<void>
  }
}
