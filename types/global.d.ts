/// <reference types="@electron-toolkit/preload" />

interface IResult {
  success: boolean
  error?: unknown
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
    saveTokens: (token: IToken) => Promise<IResult>
    getTokens: () => Promise<IToken | null>
    removeToken: () => Promise<void>
    windowResize: (data: windowProps) => Promise<void>
    minimizeWindow: () => Promise<void>
    closeWindow: () => Promise<void>
  }
}
