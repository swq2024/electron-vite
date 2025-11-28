import server from '@renderer/utils/request'

type LoginParams = {
  username: string
  password: string
}

export default {
  /**登录 */
  loginApi: (data: LoginParams) => server.post('/auth/login', data)
}
