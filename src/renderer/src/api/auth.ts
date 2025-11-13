import servers from '@renderer/utils/request'

export default {
  /**登录 */
  loginApi: (data) => servers.post('/auth/login', data)
}
