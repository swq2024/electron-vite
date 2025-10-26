import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    // 为什么这里还需要 externalizeDepsPlugin？因为有些依赖无法被打包进 asar 包，需要外部化
    // 为什么还需要 swcPlugin？因为某些依赖使用了装饰器语法，需要 swc 来编译
    // 什么叫做装饰器语法？比如 TypeORM 里面的 @Entity()、@Column() 等等，这些都是装饰器语法
    // 如何使用装饰器语法？需要在 tsconfig.json 里面开启 "experimentalDecorators": true 和 "emitDecoratorMetadata": true
    // 为什么需要开启这两个选项？因为装饰器语法不是 TypeScript 的标准语法，所以需要开启这个选项才能使用
    // 开启这两个选项有什么副作用？会导致编译后的代码体积变大，因为编译器会额外生成一些元数据
    // 如何解决这个问题？可以使用 swc 插件来编译，swc 会自动去掉这些元数据
    // 为什么要使用 swc？因为 vite-plugin-electron-renderer 插件不支持装饰器语法，所以需要使用 swc 来编译
    resolve: {
      alias: {
        '@root': resolve('src')
      }
    },
    plugins: [externalizeDepsPlugin(), swcPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
