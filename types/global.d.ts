/// <reference types="@electron-toolkit/preload" />

interface IResult {
  success: boolean
  error?: unknown
}

interface IToken {
  accessToken: string
  refreshToken: string
}

interface Window {
  electronAPI: {
    saveTokens: (token: IToken) => Promise<IResult>
    getTokens: () => Promise<IToken | null>
    removeToken: () => Promise<void>
  }
}
