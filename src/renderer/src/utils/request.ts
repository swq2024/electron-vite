import { useAuthStore } from '@renderer/stores/auth'
import axios, { AxiosRequestConfig } from 'axios'
// import { handleRequestError } from './errorHandler'

const servers = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000
  // onUploadProgress: (progressEvent) => {
  //   // 处理上传进度
  // },
  // onDownloadProgress: (progressEvent) => {
  //   // 处理下载进度
  // }
})

let failedQueues: FailedQueue[] = []

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean // 标记是否已重试
    isRefreshTokenRequest?: boolean // 标记是否是刷新 Token 的请求
  }
}

const processQueue = (error, token): void => {
  failedQueues.forEach((p) => {
    if (error) {
      p.reject(error)
    } else {
      p.resolve(token)
    }
  })
  failedQueues = []
}

const isUnauthorizedError = (error, originalRequest): boolean => {
  return (
    error.response?.status === 401 &&
    originalRequest &&
    /**
     * _retry 的作用是标记一个 “普通的业务请求” 是否已经因为 Token 过期而被重试过。
      它的使用场景是：一个普通的 API 请求（比如获取用户信息）因为 401 失败了，我们把它标记为 _retry: true，
      然后去刷新 Token，刷新成功后再用新 Token 重试这个请求。
      这个标记是为了防止在并发请求时，多个失败的请求同时去触发 Token 刷新。
     */
    !originalRequest._retry &&
    !originalRequest.isRefreshTokenRequest
  )
}

// 生成请求唯一标识（包含method、url、参数）
const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  // 序列化参数（处理对象/数组，避免因参数顺序不同导致key不一致）
  const paramsStr = params ? JSON.stringify(params) : ''
  const dataStr = data ? JSON.stringify(data) : ''
  return `${method?.toUpperCase()}: ${url}?${paramsStr}${dataStr}`
}

// 当用户在请求重试期间导航离开页面或重复发起请求时，未取消 pending 状态的请求，可能导致内存泄漏或无用请求占用资源。
// 存储 pending 请求的控制器 使用 axios 的 AbortController 实现请求取消：
const pendingRequests = new Map<string, AbortController>()

// 添加请求拦截器
servers.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    config.isRefreshTokenRequest ??= false // 仅在undefined/null时才赋值

    // 生成请求的唯一标识，用于取消重复的请求
    const requestKey = getRequestKey(config)
    // 取消相同的 pending 请求控制器
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort() // 取消之前的请求
      pendingRequests.delete(requestKey) // 正确删除对应的pending请求控制器，防止内存泄漏
    }
    // 创建新的 AbortController
    const controller = new AbortController()
    config.signal = controller.signal //  将 signal 附加到请求配置
    pendingRequests.set(requestKey, controller) // 将请求控制器存储在Map中，以便后续取消
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
servers.interceptors.response.use(
  (response) => {
    const requestKey = getRequestKey(response.config)
    pendingRequests.delete(requestKey) // 正确删除对应的pending请求控制器，防止内存泄漏
    // 对响应数据做点什么
    return response.data
  },
  async (error) => {
    const requestKey = error.config ? getRequestKey(error.config) : ''
    pendingRequests.delete(requestKey)

    const originalRequest = error.config

    // 由于AT过期导致401错误 -> 请求A失败【因为该请求不是刷新token请求的接口，所以originalRequest.isRefreshTokenRequest标识默认为 false
    // 即!originalRequest.isRefreshTokenRequest为true 并且此时originalRequest._retry标识并未设置(undefined或null) 所以!originalRequest._retry为true
    // 最终进入响应拦截器的401特殊处理 -> 将originalRequest._retry设置为true, 表示请求A已经在处理】
    // 请求A主要的作用是去触发刷新token请求(请求时会将authStore.isRefreshing设置为true, 防止重复请求刷新token接口)
    // 请求A(作为首个失败请求)第一次进入401处理逻辑时, authStore.isRefreshing为false，所以会进入刷新token的逻辑(trycatch块)
    // 此时请求A通过 await 被阻塞在等待状态(await authStore.refreshAccessToken() 阻塞在等待刷新token的返回结果),
    // 此时如果还有请求B、C、D等都失败了, 进入涌入401的处理逻辑, 会发现authStore.isRefreshing为true(代表正在刷新token中，不要再去请求刷新token的接口了),
    // 所以会将请求B、C、D等都加入队列等待，直到刷新token成功后，processQueues会携带着新的AT，依次执行队列中的请求B、C、D...
    // 如果后续如果请求B、C、D...携带着正确的AT仍发生错误(由于这些请求被originalRequest._retry标识为true, 不会再次进入401处理逻辑)
    // 代表是网络问题或服务器端错误等其他问题，不再进行重试, 直接reject出去
    if (originalRequest && isUnauthorizedError(error, originalRequest)) {
      originalRequest._retry = true // 标记请求为重试

      const authStore = useAuthStore()

      if (authStore.isRefreshing) {
        // 如果已经在刷新token，则将请求加入队列等待
        return new Promise((resolve, reject) => {
          failedQueues.push({
            resolve,
            reject
          })
        })
          .then((token) => {
            // 这里的token就是请求刷新token后返回的新的AT，用于原先失败的请求重新执行
            // 为已添加到队列中的每个失败请求(请求B、C、D...)设置新的header，并重新发起请求
            originalRequest.headers.Authorization = `Bearer ${token}`
            return servers(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      try {
        // 尝试刷新token 这里返回新的AT 在该方法中会对authStore.isRefreshing值的完成修改(true->false)
        const newAccessToken = await authStore.refreshAccessToken()

        // 更新axios实例的全局默认headers, 为所有后续请求做准备
        servers.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

        // 处理队列中的所有失败请求(请求B、C、D...)
        processQueue(null, newAccessToken)

        // 为重试请求A【触发刷新token的失败请求】设置新的header, 并重新发起请求A
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return servers(originalRequest)
      } catch (refreshError) {
        // 如果刷新token失败，处理队列中的请求
        processQueue(refreshError, null)

        // await authStore.logout() // 清除用户信息，跳转到登录页面

        return Promise.reject(refreshError)
      }
    }

    // 响应拦截器错误处理部分（非401错误）
    const status = error.response?.status
    const errorMsgMap = {
      400: '请求参数错误',
      403: '没有权限访问',
      404: '请求地址不存在',
      408: '请求超时',
      500: '服务器内部错误'
      // ...其他状态码
    }
    const errorMsg = errorMsgMap[status] || `请求失败（${status || '未知错误'}）`

    // 排除AbortError（主动取消的请求不提示）
    if (error.name !== 'AbortError') {
      console.error('请求错误:', errorMsg)
      // ElMessage.error(errorMsg); // 需引入UI库的提示组件
    }

    // 使用errorHandler统一处理错误(非401错误)
    // handleRequestError(error)

    // 非401错误，直接返回
    return Promise.reject(error)
  }
)

export default servers
