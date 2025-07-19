import request from '@/utils/request.ts'
import {
  MenuListRequest,
  MenuQueryParams,
  MenuTree,
  SysMenu,
} from '@/views/system/menu/api/menu.types.ts'
import type { PageResult } from '@/components/common/api/page.types.ts'

export const getMenuTree = async (): Promise<MenuTree[]> => {
  return request.get<MenuTree[]>('/sys/menu/tree')
}
export const getMenuPage = async (params: MenuListRequest): Promise<PageResult<SysMenu>> => {
  return request.post<PageResult<SysMenu>>('/sys/menu/page', params)
}
export const detail = async (id: string): Promise<SysMenu> => {
  return request.get<SysMenu>(`/sys/menu/detail/${id}`)
}

export const addMenu = async (data: SysMenu): Promise<boolean> => {
  return request.post('/sys/menu/add', data)
}

export const editMenu = async (data: SysMenu): Promise<boolean> => {
  return request.put('/sys/menu/edit', data)
}

export const deleteMenu = async (id: string): Promise<boolean> => {
  return request.delete(`/sys/menu/delete/${id}`)
}

export const updateMenuStatus = async (id: number, status: number): Promise<boolean> => {
  return request.put(`/sys/menu/enable/${id}/${status}`)
}

export const filterMenuTreeAsync = async (
  menuTrees: MenuTree[],
  shouldFilter: (menu: MenuTree) => Promise<boolean>,
): Promise<MenuTree[]> => {
  const results = await Promise.all(
    menuTrees.map(async (menu) => {
      const keep = !(await shouldFilter(menu))
      if (!keep) return null

      return {
        ...menu,
        children: menu.children
          ? await filterMenuTreeAsync(menu.children, shouldFilter)
          : undefined,
      }
    }),
  )

  return results.filter((menu): menu is MenuTree => menu !== null)
}

/**
 * 创建菜单列表请求参数的辅助函数
 * @param pageNo 页码
 * @param pageSize 每页大小
 * @param queryParams 查询参数
 * @param orderBy 排序字段
 * @param order 排序方式
 * @returns 完整的请求参数
 */
export const createMenuListParams = (
  pageNo: number = 1,
  pageSize: number = 10,
  queryParams: MenuQueryParams = {},
  orderBy?: string,
  order?: string,
): MenuListRequest => {
  return {
    pageNo,
    pageSize,
    orderBy,
    order,
    param: {
      menuName: '',
      status: undefined,
      parentId: undefined,
      ...queryParams,
    },
  }
}
