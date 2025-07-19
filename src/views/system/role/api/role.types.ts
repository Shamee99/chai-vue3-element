/**
 * 角色管理相关的类型定义
 */
import { PageParams } from '@/components/common/api/page.types.ts'

// 角色基础信息接口
export interface Role {
  /** 角色ID */
  id?: string
  /** 角色名称 */
  roleName: string
  roleDesc: string
  /** 角色标识 */
  roleCode: string
  /** 显示顺序 */
  sortOrder: number
  /** 角色状态 (0: 禁用, 1: 启用) */
  status: number
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

// 角色查询参数
export interface RoleQueryParams {
  /** 角色名称（模糊查询） */
  roleName?: string
  /** 角色状态 */
  status?: number | string
  /** 页码 */
  pageNo?: number
  /** 每页大小 */
  pageSize?: number
}

// 表请求参数
export interface RoleListRequest extends PageParams {
  param: RoleQueryParams
}

// 角色表单数据
export interface RoleFormData {
  /** 角色ID（编辑时使用） */
  id?: string
  /** 角色名称 */
  roleName: string
  /** 角色标识 */
  roleCode: string
  /** 显示顺序 */
  sortOrder: number
  /** 角色状态 */
  status: number
  /** 备注 */
  roleDesc: string
}

// 角色权限分配数据
export interface RolePermissionData {
  /** 角色ID */
  roleId: string
  /** 权限ID列表 */
  permissionIds: string[]
}

// 角色状态枚举
export enum RoleStatus {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}
