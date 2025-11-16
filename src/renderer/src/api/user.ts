import servers from '@renderer/utils/request'

export default {
  /**获取个人信息 */
  getProfile: () => servers.get('/users/profile')
}
