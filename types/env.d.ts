/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_KEY: number
  readonly MAIN_VITE_NODE_ENV: string
  readonly PRELOAD_VITE_KEY: number
  readonly RENDERER_VITE_KEY: number
  readonly VITE_NODE_ENV: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
