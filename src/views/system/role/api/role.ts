/**
 * 角色管理相关的 API 接口
 */

import {
  Role,
  RoleFormData,
  RoleListRequest,
  RolePermissionData,
  RoleQueryParams,
  DataScope,
  DataScopeLabels,
} from './role.types'
import type { PageResult } from '@/components/common/api/page.types.ts'
import request from '@/utils/request.ts'

export const createRoleListParams = (
  pageNo: number = 1,
  pageSize: number = 10,
  queryParams: RoleQueryParams = {},
  orderBy?: string,
  order?: string,
): RoleListRequest => {
  const result: RoleListRequest = {
    pageNo,
    pageSize,
    param: {
      roleName: '',
      ...queryParams,
    },
  }

  if (orderBy !== undefined) {
    result.orderBy = orderBy
  }

  if (order !== undefined) {
    result.order = order
  }

  return result
}

/**
 * 获取角色列表
 * @param params 查询参数
 * @returns 角色列表响应
 */
export const getRoleList = async (params: RoleListRequest): Promise<PageResult<Role>> => {
  return request.post<PageResult<Role>>('/sys/role/page', params)
}

/**
 * 获取可用的角色列表
 */
export const getEnableRoleList = async (): Promise<Role[]> => {
  return request.get<Role[]>('/sys/role/getEnableList')
}

/**
 * 新增角色
 * @param data 角色表单数据
 * @returns 新增结果
 */
export const addRole = async (data: RoleFormData): Promise<boolean> => {
  return request.post('/sys/role/add', data)
}

/**
 * 更新角色
 * @param id 角色ID
 * @param data 角色表单数据
 * @returns 更新结果
 */
export const updateRole = async (data: RoleFormData): Promise<boolean> => {
  return request.put('/sys/role/edit', data)
}

/**
 * 角色详情
 * @param id
 */
export const detail = async (id: string): Promise<Role> => {
  return request.get(`/sys/role/detail/${id}`)
}

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除结果
 */
export const deleteRole = async (id: string): Promise<void> => {
  return request.delete(`/sys/role/delete/${id}`)
}

export const updateRoleStatus = async (id: string, status: number): Promise<boolean> => {
  return request.put(`/sys/role/enable/${id}/${status}`)
}

/**
 * 获取角色权限
 * @param roleId 角色ID
 * @returns 权限ID列表
 */
export const getRolePermissions = async (roleId: string): Promise<string[]> => {
  return request.get(`/sys/role/getPerms/${roleId}`)
}

/**
 * 分配角色权限
 * @param data 角色权限数据
 * @returns 分配结果
 */
export const assignRolePermissions = async (data: RolePermissionData): Promise<void> => {
  return request.post(`/sys/role/assignPerms/${data.roleId}`, data.permissionIds)
}

/**
 * 获取角色数据权限部门ID列表
 * @param roleId 角色ID
 * @returns 部门ID列表
 */
export const getRoleDeptIds = async (roleId: string): Promise<string[]> => {
  return request.get(`/sys/role/getDeptIds/${roleId}`)
}

// 导出数据权限枚举和标签
export { DataScope, DataScopeLabels }
