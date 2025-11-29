interface FailedQueue {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}
interface ILoginResponse {
  status: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
  errors?: string[]
}

interface ILogoutResponse {
  status: boolean
  message: string
  data?: null
  errors?: string[]
}
