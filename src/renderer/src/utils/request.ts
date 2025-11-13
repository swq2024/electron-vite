import { useUserStore } from '@renderer/stores/user'
import axios from 'axios'

const servers = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000
})

// 定义一个变量，用来标记当前环境中是否在刷新token
let isRefreshing = false
let failedQueues: FailedQueue[] = []

const processQueue = (error, token = null): void => {
  failedQueues.forEach((p) => {
    if (error) {
      p.reject(error)
    } else {
      p.resolve(token)
    }
  })
  failedQueues = []
}

// 添加请求拦截器
servers.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
servers.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const userStore = useUserStore()

    // 如果是401错误，并且不是刷新token的请求本身，则进入刷新逻辑
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果已经在刷新token，则将请求加入队列等待
        return new Promise((resolve, reject) => {
          failedQueues.push({
            resolve,
            reject
          })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}` // 为重试请求设置新的header
            return servers(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true // 标记正在刷新token
      originalRequest._retry = true // 标记请求为重试

      try {
        // 调整刷新token
        // 注意: 这里直接调用 axios 是为了不经过拦截器，避免循环调用拦截器导致死循环
        const { data } = await axios.post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${userStore.token}` // 刷新token需要旧的token作为凭证
            }
          }
        )
        const newToken = data.token

        // 更新token
        await userStore.setToken(newToken)

        // 更新axios实例的默认headers, 为所有后续请求做准备
        servers.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

        // 处理队列中的所有失败请求
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}` // 为重试请求设置新的header
        return servers(originalRequest) // 重试请求
      } catch (refreshError) {
        // 如果刷新token失败，处理队列中的请求
        processQueue(refreshError, null)

        userStore.logout() // 清除用户信息，跳转到登录页面

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false // 刷新完成，重置标记
      }
    }

    // 非401错误，直接返回
    return Promise.reject(error)
  }
)

export default servers
