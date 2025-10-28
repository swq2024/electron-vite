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
  }
  db: {
    createUser: (user: User) => Promise<User>
    // 可以添加其他数据库操作方法，比如：
    findAllUsers: () => Promise<User[]>
    updateUser: (id: number, user: Partial<User>) => Promise<User>
    deleteUser: (id: number) => Promise<void>
  }
}
