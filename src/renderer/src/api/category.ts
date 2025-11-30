import server from '@renderer/utils/request'

export default {
  /**获取分类列表 */
  getCategoryList: () => server.get('/categories'),
  /**创建分类 */
  createCategory: (payload) => server.post('/categories', payload),
  /**更新分类 */
  updateCategory: (id: string, payload) => server.put(`/categories/${id}`, payload),
  /**删除分类 */
  deleteCategory: (id: string) => server.delete(`/categories/${id}`),
  /**设置默认分类 */
  setDefaultCategory: (id: string) => server.put(`/categories/${id}/default`)
}
