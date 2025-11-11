import type { App } from 'vue'
import { nextTick } from 'vue'

export const errorHandler = (App: App<Element>): void => {
  App.config.errorHandler = (err, instance, info) => {
    nextTick(() => {
      if (import.meta.env.VITE_NODE_ENV === 'development') {
        console.group('%c >>>>>> 错误信息 >>>>>>', 'color:red')
        console.log(`%c ${info}`, 'color:blue')
        console.groupEnd()
        console.group('%c >>>>>> 发生错误的Vue 实例对象 >>>>>>', 'color:green')
        console.log(instance)
        console.groupEnd()
        console.group('%c >>>>>> 发生错误的原因及位置 >>>>>>', 'color:red')
        console.error(err)
        console.groupEnd()
        // 生产环境下应添加错误上报功能, 将错误信息上报到监控系统, 以便及时发现和修复问题。
      }
    })
  }
}
