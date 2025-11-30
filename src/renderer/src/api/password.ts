import server from '@renderer/utils/request'

export default {
  /**获取密码列表 */
  getPasswordList: (params = {}) => server.get('/passwords', { params }),
  /**收藏/取消收藏密码 */
  toggleFavorite: (id: string) => server.post('/likes', { passwordId: id }),
  /**查看当前用户收藏的密码 */
  getUserFavorites: () => server.get('/likes'),
  /**创建密码 */
  createPassword: (data) => server.post('/passwords', data),
  /**更新密码 */
  updatePassword: (id: string, data) => server.put(`/passwords/${id}`, data),
  /**删除密码 */
  deletePassword: (id: string) => server.delete(`/passwords/${id}`),
  /**获取回收站中的密码 */
  getTrashPasswords: () => server.get('/passwords/trash'),
  /**恢复密码 */
  restorePassword: (id: string) => server.post(`/passwords/${id}/restore`),
  /**批量恢复 */
  restorePasswords: (ids: string[]) => server.post('/passwords/restore', { ids }),
  /**彻底删除 */
  forceDeletePassword: (id: string) => server.delete(`/passwords/${id}/permanently`),
  /**批量彻底删除 */
  forceDeletePasswords: (ids: string[]) => server.post('/passwords/permanently', { ids }),
  /**彻底删除当前用户的所有密码(包括未删除和回收站中的) */
  emptyTrash: () => server.delete('/passwords/permanently-all')
}
