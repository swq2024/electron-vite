import { apiServices } from '@renderer/utils/request'

export default {
  /**获取个人信息 */
  getProfile: () => apiServices.get('/users/profile')
}
