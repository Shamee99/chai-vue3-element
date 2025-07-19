import request from '@/utils/request.ts'
import type { User, UserListRequest, UserQueryParams } from '@/views/system/user/api/user.types'
import type { PageResult } from '@/components/common/api/page.types.ts'
import type { Dept } from '@/views/system/dept/api/dept.types.ts'

/**
 * 获取用户列表
 * @param params 分页和查询参数
 * @returns 用户列表响应
 */
export const getUserList = async (params: UserListRequest): Promise<PageResult<User>> => {
  return request.post<PageResult<User>>('/sys/user/page', params)
}

/**
 * 创建用户列表请求参数的辅助函数
 * @param pageNo 页码
 * @param pageSize 每页大小
 * @param queryParams 查询参数
 * @param orderBy 排序字段
 * @param order 排序方式
 * @returns 完整的请求参数
 */
export const createUserListParams = (
  pageNo: number = 1,
  pageSize: number = 10,
  queryParams: UserQueryParams = {},
  orderBy?: string,
  order?: string
): UserListRequest => {
  return {
    pageNo,
    pageSize,
    orderBy,
    order,
    param: {
      username: '',
      phone: '',
      status: undefined,
      deptId: undefined,
      includeChildDept: true,
      beginTime: '',
      endTime: '',
      ...queryParams
    }
  }
}

/**
 * 新增用户
 * @param data 用户数据
 * @returns
 */
export const addUser = async (data: User): Promise<boolean> => {
  return request.post('/sys/user/add', data)
}

/**
 * 获取用户详情
 * @param id
 */
export const detail = async (id: string): Promise<User> => {
  return request.get(`/sys/user/detail/${id}`)
}
/**
 * 更新用户
 * @param data 用户数据
 * @returns
 */
export const updateUser = async (data: User): Promise<boolean> => {
  return request.put('/sys/user/edit', data)
}

/**
 * 删除用户
 * @param id 用户ID
 * @returns
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  return request.delete(`/sys/user/delete/${id}`)
}

/**
 * 重置用户密码
 * @param id 用户ID
 * @returns
 */
export const resetUserPassword = async (id: number): Promise<boolean> => {
  return request.put(`/sys/user/resetPassword/${id}`)
}

/**
 * 更新用户状态
 * @param id 用户ID
 * @param status 状态
 * @returns
 */
export const updateUserStatus = async (id: number, status: number): Promise<boolean> => {
  return request.put(`/sys/user/enable/${id}/${status}`)
}
