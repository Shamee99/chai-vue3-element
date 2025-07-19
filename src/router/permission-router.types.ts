/**
 * 菜单相关类型定义
 * 基于后端SysMenu实体类的TypeScript类型定义
 */

import { MenuStatus, MenuType } from '@/constants/FreezeConst.ts'

/**
 * 系统菜单实体类型（对应后端SysMenu）
 */
export interface PermissionNode {
  /** 菜单ID */
  id: string

  /** 菜单名称 */
  menuName: string

  /** 父菜单ID */
  parentId: string | '0'

  /** 菜单类型 0-目录 1-菜单 2-按钮 */
  menuType: MenuType

  /** 路由路径 */
  path: string

  /** 组件路径 */
  component: string | null

  /** 权限标识列表 */
  permissions: string

  /** 菜单图标 */
  icon: string | null

  /** 排序 */
  sortOrder: number

  /** 状态 0-禁用 1-启用 */
  status: MenuStatus

  /** 是否外链 0-否 1-是 */
  isExternal: number

  /** 是否缓存 0-否 1-是 */
  isKeepalive: number

  /** 是否显示 0-隐藏 1-显示 */
  isVisible: number

  /** 子菜单列表 */
  children?: PermissionNode[]
}




/**
 * 菜单树节点类型（继承SysMenu，用于树形结构展示）
 */
export interface PermissionTreeNode extends PermissionNode {
  /** 子节点 */
  children: PermissionTreeNode[]

  /** 节点层级 */
  level?: number

  /** 是否展开 */
  expanded?: boolean

  /** 是否选中 */
  selected?: boolean
}

/**
 * 路由元信息类型
 */
export interface RouteMetaInfo {
  /** 页面标题 */
  title: string

  /** 菜单图标 */
  icon?: string

  /** 是否隐藏 */
  hidden?: boolean

  /** 是否缓存 */
  keepAlive?: boolean

  /** 权限标识 */
  permissions?: string

  /** 面包屑 */
  breadcrumb?: boolean

  /** 是否固定在标签页 */
  affix?: boolean

  /** 外链地址 */
  link?: string

  /** 菜单排序 */
  sort?: number

  /** 菜单ID */
  menuId?: string

  /** 父菜单ID */
  parentId?: string | null
}

/**
 * 菜单API响应类型
 */
export interface MenuListResponse {
  /** 状态码 */
  code: number

  /** 响应消息 */
  message: string

  /** 菜单数据 */
  data: PermissionNode[]

  /** 时间戳 */
  timestamp?: number
}

/**
 * 菜单查询参数
 */
export interface MenuQueryParams {
  /** 菜单名称（模糊查询） */
  menuName?: string

  /** 菜单状态 */
  status?: MenuStatus

  /** 菜单类型 */
  menuType?: MenuType

  /** 父菜单ID */
  parentId?: number

  /** 页码 */
  pageNum?: number

  /** 页大小 */
  pageSize?: number
}

/**
 * 菜单表单数据类型
 */
export interface MenuFormData {
  /** 菜单ID（编辑时使用） */
  id?: number

  /** 菜单名称 */
  menuName: string

  /** 父菜单ID */
  parentId: number | null

  /** 菜单类型 */
  menuType: MenuType

  /** 路由路径 */
  path: string

  /** 组件路径 */
  component?: string

  /** 权限标识 */
  permissions: string

  /** 菜单图标 */
  icon?: string

  /** 排序 */
  sortOrder: number

  /** 状态 */
  status: MenuStatus

  /** 是否外链 */
  isExternal: number

  /** 是否缓存 */
  isKeepalive: number

  /** 是否显示 */
  isVisible: number

  /** 备注 */
  remark?: string
}

/**
 * 菜单权限检查结果
 */
export interface MenuPermissionResult {
  /** 是否有权限 */
  hasPermission: boolean

  /** 缺失的权限列表 */
  missingPermissions: string[]

  /** 检查的菜单 */
  menu: PermissionNode
}

/**
 * 动态路由配置
 */
export interface DynamicRouteConfig {
  /** 是否启用动态路由 */
  enabled: boolean

  /** 路由缓存策略 */
  cacheStrategy: 'memory' | 'localStorage' | 'sessionStorage'

  /** 权限检查模式 */
  permissionMode: 'strict' | 'loose'

  /** 默认重定向路径 */
  defaultRedirect: string

  /** 404页面路径 */
  notFoundPath: string
}

/**
 * 菜单构建选项
 */
export interface MenuBuildOptions {
  /** 是否过滤隐藏菜单 */
  filterHidden?: boolean

  /** 是否过滤禁用菜单 */
  filterDisabled?: boolean

  /** 是否检查权限 */
  checkPermission?: boolean

  /** 最大层级深度 */
  maxDepth?: number

  /** 排序字段 */
  sortBy?: 'sortOrder' | 'createTime' | 'menuName'

  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}
