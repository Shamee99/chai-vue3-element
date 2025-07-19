/**
 * 菜单相关类型定义
 * 基于后端SysMenu实体类的TypeScript类型定义
 */

import type { PageParams } from '@/components/common/api/page.types.ts'

/**
 * 系统菜单实体类型（对应后端SysMenu）
 */
export interface SysMenu {
  /** 菜单ID */
  id: string

  /** 菜单名称 */
  menuName: string

  /** 父菜单ID */
  parentId: string | null

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
  status: number

  /** 是否外链 0-否 1-是 */
  isExternal: number

  /** 是否缓存 0-否 1-是 */
  isKeepalive: number

  /** 是否显示 0-隐藏 1-显示 */
  isVisible: number

  /** 备注 */
  remark: string | null

  /** 创建时间 */
  createTime?: string

  /** 更新时间 */
  updateTime?: string

  // ========== 非数据库字段 ==========

  /** 子菜单列表 */
  children?: SysMenu[]

  /** 父菜单名称 */
  parentName?: string
}

/**
 * 菜单类型枚举
 */
export enum MenuType {
  /** 目录 */
  DIRECTORY = 1,
  /** 菜单 */
  MENU = 2,
  /** 按钮 */
  BUTTON = 3
}

/**
 * 菜单状态枚举
 */
export enum MenuStatus {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}

/**
 * 菜单树节点类型
 */
export interface MenuTree {
  id?: string
  menuName: string
  menuType: number
  icon?: string
  parentId?: string
  children?: MenuTree[]
  [key: string]: any
}

export interface MenuQueryParams {
  menuName?: string
  status?: number
  parentId?: string
}

export interface MenuListRequest extends PageParams {
  param: MenuQueryParams
}
