import server from '@renderer/utils/request'

type LoginParams = {
  username: string
  password: string
}

export default {
  /**登录 */
  loginApi: (data: LoginParams): Promise<ILoginResponse> => server.post('/auth/login', data),
  /**登出 */
  logoutApi: (): Promise<ILogoutResponse> => server.post('/auth/logout')
}
