import server from '@renderer/utils/request'

export default {
  /**获取密码列表 */
  getPasswordList: (params = {}) => server.get('/passwords', { params }),
  /**收藏/取消收藏密码 */
  toggleFavorite: (id: string) => server.post('/likes', { passwordId: id }),
  /**查看用户收藏的密码 */
  getUserFavorites: () => server.get('/likes')
}
