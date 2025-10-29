/// <reference types="@electron-toolkit/preload" />

interface User {
  name: string
  age: number
  hobby: string
}

interface Window {
  electron: import('@electron-toolkit/preload').ElectronAPI
  api: {
    pingFn: () => Promise<string>
    setTitle: (title: string) => void
    onUpdateCounter: (callback: (val: number) => void) => void
    outCounterValue: (value: number) => Promise<number>
  }
  // db: {}
}
