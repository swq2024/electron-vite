import { ElMessage } from 'element-plus'

export enum ErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TIMEOUT = 408,
  INTERNAL_ERROR = 500
}

/**
 * 统一错误处理函数
 * @param error - axios 错误对象
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRequestError(error: any): void {
  // 防止重复弹出提示
  ElMessage.closeAll()

  if (error.response) {
    // 请求已发出，服务器返回状态码
    const { status, data } = error.response
    const errorMessage = data?.message || '请求失败，请稍后再试'

    switch (status) {
      case ErrorCode.UNAUTHORIZED:
        // 401 错误在拦截器中已处理（刷新Token或跳转登录），这里可以不做提示或做特殊提示
        console.warn('用户未授权或Token过期')
        break
      case ErrorCode.FORBIDDEN:
        ElMessage.error('您没有权限执行此操作')
        break
      case ErrorCode.NOT_FOUND:
        ElMessage.error('请求的资源不存在')
        break
      case ErrorCode.INTERNAL_ERROR:
        ElMessage.error('服务器内部错误，请稍后再试')
        // 可以在这里加入错误日志上报逻辑
        // reportErrorToBackend(error);
        break
      default:
        ElMessage.error(errorMessage)
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    // `error.request` 在浏览器中是 XMLHttpRequest 实例，在node.js中是 http.ClientRequest 实例
    ElMessage.error('请求超时，请检查网络连接')
  } else {
    // 在设置请求时发生了错误
    ElMessage.error('请求设置失败，请稍后再试')
  }
}
