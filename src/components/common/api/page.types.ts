// 分页响应数据
export interface PageResult<T> {
  records: T[]
  total: number
  pageSize: number
  pageNo: number
  pageCount: number
}

// 统一分页参数接口
export interface PageParams {
  pageNo: number
  pageSize: number
  orderBy?: string
  order?: string
}

export const DEFAULT_PAGINATION = {
  pageNo: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
} as const
