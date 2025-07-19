import type { PageParams } from '@/components/common/api/page.types.ts'

export interface DeptTree {
  id?: string
  deptName: string
  parentId?: string
  children?: DeptTree[]
}

export interface Dept {
  id?: string
  deptName: string
  deptCode: string
  parentId?: string
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status: number
}

// 部门查询参数
export interface DeptQueryParams {
  deptName?: string
  status?: number
  parentId?: string
  leader?: string
  phone?: string
  email?: string
}

export interface DeptListRequest extends PageParams {
  param: DeptQueryParams
}
