/**
 * 环境变量工具函数
 * 提供便捷的环境变量访问和类型转换方法
 */

/**
 * 获取环境变量值
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值或默认值
 */
export function getEnv(key: keyof ImportMetaEnv, defaultValue?: string): string {
  return import.meta.env[key] ?? defaultValue ?? ''
}

/**
 * 获取布尔类型环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 布尔值
 */
export function getBooleanEnv(key: keyof ImportMetaEnv, defaultValue = false): boolean {
  const value = getEnv(key)
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

/**
 * 获取数字类型环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 数字值
 */
export function getNumberEnv(key: keyof ImportMetaEnv, defaultValue = 0): number {
  const value = getEnv(key)
  if (!value) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 获取数组类型环境变量（逗号分隔）
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 数组值
 */
export function getArrayEnv(key: keyof ImportMetaEnv, defaultValue: string[] = []): string[] {
  const value = getEnv(key)
  if (!value) return defaultValue
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

/**
 * 应用配置对象
 */
export const appConfig = {
  // 应用信息
  title: getEnv('VITE_APP_TITLE', 'Chai Admin'),
  version: getEnv('VITE_APP_VERSION', '1.0.0'),
  description: getEnv('VITE_APP_DESCRIPTION', '后台管理系统'),

  // API配置
  apiBaseUrl: getEnv('VITE_API_BASE_URL', '/api'),

  // 功能开关
  useMock: getBooleanEnv('VITE_USE_MOCK'),
  usePwa: getBooleanEnv('VITE_USE_PWA'),
  useCdn: getBooleanEnv('VITE_USE_CDN'),

  // 路由配置
  routerMode: getEnv('VITE_ROUTER_MODE', 'history') as 'hash' | 'history',

  // CDN配置
  cdnUrl: getEnv('VITE_CDN_URL'),

  // 日志配置
  logLevel: getEnv('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',

  // 开发配置
  showErrorOverlay: getBooleanEnv('VITE_SHOW_ERROR_OVERLAY', true),

  // 上传配置
  uploadSizeLimit: getNumberEnv('VITE_UPLOAD_SIZE_LIMIT', 10),

  // 分页配置
  pagination: {
    defaultPageSize: getNumberEnv('VITE_DEFAULT_PAGE_SIZE', 10),
    pageSizes: [10, 20, 50, 100],
    maxPageSize: getNumberEnv('VITE_MAX_PAGE_SIZE', 1000)
  },

  // 主题配置
  theme: {
    default: getEnv('VITE_DEFAULT_THEME', 'light'),
    themes: ['light', 'dark'],
    primaryColor: getEnv('VITE_PRIMARY_COLOR', '#409EFF')
  },

  // 布局配置
  layout: {
    sidebarWidth: getNumberEnv('VITE_SIDEBAR_WIDTH', 200),
    sidebarCollapsedWidth: getNumberEnv('VITE_SIDEBAR_COLLAPSED_WIDTH', 64),
    headerHeight: getNumberEnv('VITE_HEADER_HEIGHT', 60),
    tabsHeight: getNumberEnv('VITE_TABS_HEIGHT', 40)
  },

  // 缓存配置
  cache: {
    enableRouteCache: getBooleanEnv('VITE_ENABLE_ROUTE_CACHE', true),
    strategy: getEnv('VITE_CACHE_STRATEGY', 'localStorage') as 'localStorage' | 'sessionStorage' | 'memory',
    prefix: getEnv('VITE_CACHE_PREFIX', 'chai_admin_')
  }
}

/**
 * 判断是否为开发环境
 */
export const isDev = import.meta.env.DEV

/**
 * 判断是否为生产环境
 */
export const isProd = import.meta.env.PROD

/**
 * 判断是否为测试环境
 */
export const isTest = import.meta.env.MODE === 'test'

/**
 * 获取当前环境模式
 */
export const mode = import.meta.env.MODE

/**
 * 获取基础URL
 */
export const baseUrl = import.meta.env.BASE_URL

/**
 * 打印环境信息（仅在开发环境）
 */
if (isDev) {
  console.group('🌍 Environment Info')
  console.log('Mode:', mode)
  console.log('Base URL:', baseUrl)
  console.log('API Base URL:', appConfig.apiBaseUrl)
  console.log('App Title:', appConfig.title)
  console.log('App Version:', appConfig.version)
  console.log('Use Mock:', appConfig.useMock)
  console.groupEnd()
}
