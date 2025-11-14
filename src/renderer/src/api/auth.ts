import { apiServices } from '@renderer/utils/request'

export default {
  /**登录 */
  loginApi: (data) => apiServices.post('/auth/login', data)
}
