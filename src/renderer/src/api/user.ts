import servers from '@renderer/utils/request'

export default {
  /**获取个人信息 */
  getProfile: (): Promise<IUserProfile> => servers.get('/users/profile')
}
