import server from '@renderer/utils/request'

export default {
  /**登录 */
  loginApi: (data) => server.post('/auth/login', data)
}
