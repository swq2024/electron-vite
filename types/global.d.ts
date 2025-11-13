/// <reference types="@electron-toolkit/preload" />

interface IResult {
  success: boolean
  error?: unknown
}

interface Window {
  electronAPI: {
    setToken: (token: string) => Promise<IResult>
    getToken: () => Promise<string | null>
    removeToken: () => Promise<void>
  }
}
