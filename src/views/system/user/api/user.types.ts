import type { PageParams } from '@/components/common/api/page.types.ts'
export interface User {
  id?: string
  avatar?: string
  username: string
  nickname: string
  realName?: string
  gender?: number
  email?: string
  phone?: string
  roleIds?: string[]
  status: number
  createTime: string
  deptId?: string
  password?: string
  confirmPassword?: string
}


// 用户查询参数
export interface UserQueryParams {
  username?: string
  phone?: string
  status?: number
  deptId?: string
  includeChildDept?: boolean
  beginTime?: string
  endTime?: string
}

// 用户列表请求参数
export interface UserListRequest extends PageParams {
  param: UserQueryParams
}

