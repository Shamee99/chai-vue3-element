import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import JSONbig from 'json-bigint'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user-store.ts'
import router from '@/router'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  transformResponse: [(data) => JSONbig({ storeAsString: true }).parse(data)],
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 如果存在token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message } = response.data

    // 根据后端约定的状态码处理响应
    if (code === 200) {
      return data
    } else if (code === 401) {
      // token过期或无效
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
      return Promise.reject(new Error(message || '登录已过期'))
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    console.error('响应错误:', error)

    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          ElMessage.error('登录已过期，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.message || '服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '网络错误')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      ElMessage.error('网络连接失败，请检查网络')
    }

    return Promise.reject(error)
  },
)

// 封装请求方法
class Request {
  // GET请求
  get<T = any>(url: string, params?: object): Promise<T> {
    return service.get(url, { params })
  }

  // POST请求
  post<T = any>(url: string, data?: object): Promise<T> {
    return service.post(url, data)
  }

  // PUT请求
  put<T = any>(url: string, data?: object): Promise<T> {
    return service.put(url, data)
  }

  // DELETE请求
  delete<T = any>(url: string, params?: object): Promise<T> {
    return service.delete(url, { params })
  }

  // 文件上传
  upload<T = any>(url: string, formData: FormData): Promise<T> {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // 文件下载
  download(url: string, params?: object, filename?: string): Promise<void> {
    return service
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((response: any) => {
        const blob = new Blob([response])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      })
  }
}

export default new Request()
