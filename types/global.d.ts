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
  electronAPI: {
    saveTokens: (token: IToken) => Promise<IResult>
    getTokens: () => Promise<IToken | null>
    removeToken: () => Promise<void>
    loginWindowResize: (channel: string, data: windowProps) => void
  }
}
