/**
 * 全局类型定义
 * 提供项目中通用的类型定义，增强类型安全性
 */

// ==================== 基础类型 ====================

/** 基础实体接口 */
export interface BaseEntity {
  id: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
}

/** API 响应基础结构 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

/** 分页请求参数 */
export interface PageRequest {
  page: number
  size: number
  sort?: string
  order?: 'asc' | 'desc'
}

/** 分页响应数据 */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}

// ==================== 组件类型 ====================

/** 表格列配置 */
export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any) => string
  align?: 'left' | 'center' | 'right'
}

/** 表单项配置 */
export interface FormItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea'
  required?: boolean
  rules?: any[]
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  span?: number
}

/** 搜索表单配置 */
export interface SearchForm {
  items: FormItem[]
  labelWidth?: string
  inline?: boolean
}

// ==================== 业务类型 ====================

/** 用户状态枚举 */
export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  LOCKED = -1
}

/** 操作类型枚举 */
export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  QUERY = 'QUERY',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

/** 日志级别枚举 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// ==================== 工具类型 ====================

/** 深度只读 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/** 可选字段 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 必需字段 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** 键值对 */
export type KeyValue<T = any> = Record<string, T>

/** 函数类型 */
export type Fn<T = any> = (...args: any[]) => T

/** 异步函数类型 */
export type AsyncFn<T = any> = (...args: any[]) => Promise<T>

// ==================== 环境变量类型 ====================

export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_MOCK: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_APP_VERSION: string
}

// ==================== 路由类型扩展 ====================

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    permissions?: string[]
    roles?: string[]
    breadcrumb?: boolean
    affix?: boolean
  }
}

// ==================== Vue 组件类型扩展 ====================

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: any
    $confirm: any
    $loading: any
  }
}