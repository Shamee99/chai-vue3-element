import request from '@/utils/request.ts'
import type {
  Dept,
  DeptListRequest,
  DeptQueryParams,
  DeptTree,
} from '@/views/system/dept/api/dept.types'
import type { PageResult } from '@/components/common/api/page.types.ts'

/**
 * 获取部门列表
 * @param params 分页和查询参数
 * @returns 部门列表响应
 */
export const getDeptList = async (params: DeptListRequest): Promise<PageResult<Dept>> => {
  return request.post<PageResult<Dept>>('/sys/dept/page', params)
}

/**
 * 创建部门列表请求参数的辅助函数
 * @param pageNo 页码
 * @param pageSize 每页大小
 * @param queryParams 查询参数
 * @param orderBy 排序字段
 * @param order 排序方式
 * @returns 完整的请求参数
 */
export const createDeptListParams = (
  pageNo: number = 1,
  pageSize: number = 10,
  queryParams: DeptQueryParams = {},
  orderBy?: string,
  order?: string,
): DeptListRequest => {
  return {
    pageNo,
    pageSize,
    orderBy,
    order,
    param: {
      deptName: '',
      parentId: '',
      leader: '',
      phone: '',
      email: '',
      ...queryParams,
    },
  }
}

/**
 * 新增部门
 * @param data 部门数据
 * @returns 响应结果
 */
export const addDept = async (data: Dept): Promise<boolean> => {
  return request.post('/sys/dept/add', data)
}

/**
 * 更新部门
 * @param data 部门数据
 * @returns 响应结果
 */
export const updateDept = async (data: Dept): Promise<boolean> => {
  return request.put('/sys/dept/edit', data)
}

/**
 * 删除部门
 * @param id 部门ID
 * @returns 响应结果
 */
export const deleteDept = async (id: string): Promise<boolean> => {
  return request.delete(`/sys/dept/delete/${id}`)
}

/**
 * 更新部门状态
 * @param id 部门ID
 * @param status 状态值
 * @returns 响应结果
 */
export const updateDeptStatus = async (id: number, status: number): Promise<boolean> => {
  return request.put(`/sys/dept/enable/${id}/${status}`)
}

/**
 * 获取部门树形结构
 * @returns 部门树形数据
 */
export const getDeptTree = async (): Promise<DeptTree[]> => {
  return request.get<DeptTree[]>('/sys/dept/tree')
}

/**
 * 部门水洗
 * @param id
 */
export const getDetail = async (id: string): Promise<Dept> => {
  return request.get<Dept>(`/sys/dept/detail/${id}`)
}
