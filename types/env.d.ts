/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_KEY: number
  readonly MAIN_VITE_NODE_ENV: string
  readonly PRELOAD_VITE_KEY: number
  readonly RENDERER_VITE_KEY: number
  readonly VITE_NODE_ENV: string
  readonly VITE_BACKEND_URL: string
  readonly VITE_ELECTRON_BACKEND_PORT: number
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
