/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * 为所有VITE_开头的环境变量提供TypeScript类型支持
 */
interface ImportMetaEnv {
  // 应用基础信息
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  
  // 服务器配置
  readonly VITE_PORT: string
  readonly VITE_HOST: string
  readonly VITE_OPEN_BROWSER: string
  readonly VITE_USE_HTTPS: string
  readonly VITE_HMR: string
  
  // API配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_PROXY: string
  readonly VITE_PROXY_TARGET: string
  
  // 功能开关
  readonly VITE_USE_MOCK: string
  readonly VITE_USE_PWA: string
  readonly VITE_USE_CDN: string
  
  // 路由配置
  readonly VITE_ROUTER_MODE: string
  
  // 构建配置
  readonly VITE_BUILD_GZIP: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCE_MAP: string
  readonly VITE_OUTPUT_DIR: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_BUILD_ANALYZE: string
  
  // CDN配置
  readonly VITE_CDN_URL: string
  
  // 日志配置
  readonly VITE_LOG_LEVEL: string
  readonly VITE_SHOW_ERROR_OVERLAY: string
  
  // 应用配置
  readonly VITE_UPLOAD_SIZE_LIMIT: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_MAX_PAGE_SIZE: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_SIDEBAR_WIDTH: string
  readonly VITE_SIDEBAR_COLLAPSED_WIDTH: string
  readonly VITE_HEADER_HEIGHT: string
  readonly VITE_TABS_HEIGHT: string
  readonly VITE_ENABLE_ROUTE_CACHE: string
  readonly VITE_CACHE_STRATEGY: string
  readonly VITE_CACHE_PREFIX: string
  
  // 测试配置
  readonly VITE_TEST_MODE: string
  readonly VITE_TEST_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * 全局常量类型声明
 */
declare const __APP_VERSION__: string
declare const __APP_TITLE__: string