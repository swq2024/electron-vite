import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    // 这里定义自定义的 API 接口
    // 为什么要用 FunctionMap？ 因为我们希望 api 对象的每个属性都是一个函数
    api: FunctionMap
  }
}
