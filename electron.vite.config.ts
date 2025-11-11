import { resolve, join } from 'path'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({
  path: [
    resolve(__dirname, 'env/.env'),
    resolve(__dirname, 'env/.env.development'),
    resolve(__dirname, 'env/.env.production'),
    resolve(__dirname, 'env/.env.test')
  ]
})
/**
 * electron-vite 默认配置
 * externalizeDepsPlugin 插件会将依赖从最终的 bundle 中排除，并保持其作为外部依赖
 * bytecodePlugin 插件会将代码(主进程和预加载脚本)编译为 v8 bytecode，以保护应用程序不被轻易解包
 */

import { defineConfig, loadEnv, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // 在 electron.vite.config.ts 加载当前 mode(包括默认环境变量) 下的环境变量, 供后续的配置使用
  const env = loadEnv(mode, join(__dirname, 'env'))
  if (command === 'serve') {
    return {
      main: {
        resolve: {
          alias: {
            '@root': resolve('src')
          }
        },
        plugins: [externalizeDepsPlugin()]
      },
      preload: {
        plugins: [externalizeDepsPlugin()]
      },
      renderer: {
        resolve: {
          alias: {
            '@renderer': resolve(__dirname, 'src/renderer/src')
          }
        },
        plugins: [vue()],
        server: {
          open: false,
          proxy: {
            '/api': {
              target: env.VITE_BACKEND_URL,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
        },
        base: './',
        build: {
          // 打包时不生成 source map
          // minify: 'terser'
        }
      }
    }
  } else {
    // command === 'build' — ensure plugins used in serve are also applied in build
    return {
      main: {
        resolve: {
          alias: {
            '@root': resolve('src')
          }
        },
        plugins: [externalizeDepsPlugin(), bytecodePlugin()]
      },
      preload: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()]
      },
      renderer: {
        resolve: {
          alias: {
            '@renderer': resolve('src/renderer/src')
          }
        },
        plugins: [vue()]
      }
    }
  }
})
