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
  /** 数据权限范围 1-全部数据 2-本部门及子部门数据 3-本部门数据 4-仅本人数据 5-自定义数据 */
  dataScope?: number
  /** 数据权限部门ID列表（当dataScope为自定义数据时使用） */
  deptIds?: string[]
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
  /** 数据权限范围 1-全部数据 2-本部门及子部门数据 3-本部门数据 4-仅本人数据 5-自定义数据 */
  dataScope?: number
  /** 数据权限部门ID列表（当dataScope为自定义数据时使用） */
  deptIds?: string[]
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
  ENABLED = 1,
}

// 数据权限范围枚举
export enum DataScope {
  /** 全部数据权限 */
  ALL = 1,
  /** 本部门数据权限 */
  DEPT = 2,
  /** 本部门及以下数据权限 */
  DEPT_AND_CHILD = 3,
  /** 仅本人数据权限 */
  SELF = 4,
  /** 自定义数据权限 */
  CUSTOM = 5,
}

// 数据权限范围显示标签
export const DataScopeLabels: Record<DataScope, string> = {
  [DataScope.ALL]: '全部数据',
  [DataScope.DEPT]: '本部门数据',
  [DataScope.DEPT_AND_CHILD]: '本部门及以下数据',
  [DataScope.SELF]: '仅本人数据',
  [DataScope.CUSTOM]: '自定义数据',
}
