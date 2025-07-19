import request from '@/utils/request.ts'
import type { PermissionNode, PermissionTreeNode, MenuBuildOptions, RouteMetaInfo } from '@/router/permission-router.types.ts'
import { type RouteRecordRaw } from 'vue-router'
import { MenuType } from '@/constants/FreezeConst.ts'

/**
 * 获取菜单列表API
 * @returns Promise<PermissionNode[]>
 */
export const getPermissionNodeListApi = async (): Promise<PermissionNode[]> => {
  const response = await request.get<PermissionNode[]>('/sys/menu/router')
  // 验证API返回的数据格式
  if (!response || !Array.isArray(response)) {
    throw new Error('API返回数据错误，请确认')
  }
  // 数据标准化处理
  return __normalizeMenuData(response)
}

/**
 * 将扁平化菜单数据转换为树形结构
 * @param permissionNodeList 扁平化菜单数组
 * @param options 构建选项
 * @returns 菜单树
 */
export const buildPermissionTreeNode = (permissionNodeList: PermissionNode[], options: MenuBuildOptions = {}): PermissionTreeNode[] => {
  const {
    filterHidden = false,
    filterDisabled = false,
    maxDepth = 10,
    sortBy = 'sortOrder',
    sortOrder = 'asc'
  } = options

  // 过滤菜单
  let filteredMenus = permissionNodeList.filter(perm => {
    if (filterHidden && !perm.isVisible) return false
    return !(filterDisabled && perm.status === 0);

  })

  // 排序
  filteredMenus = __sortPermissionMenu(filteredMenus, sortBy, sortOrder)

  // 构建映射表
  const permissionMenuMap = new Map<string, PermissionTreeNode>()
  const rootPermissionMenus: PermissionTreeNode[] = []

  // 初始化所有菜单节点
  filteredMenus.forEach(menu => {
    const treeNode: PermissionTreeNode = {
      ...menu,
      children: [],
      level: 0
    }
    permissionMenuMap.set(menu.id, treeNode)
  })

  // 构建树形结构
  filteredMenus.forEach(menu => {
    const currentNode = permissionMenuMap.get(menu.id)!

    if (menu.parentId === null || menu.parentId === '0') {
      // 根节点
      rootPermissionMenus.push(currentNode)
    } else {
      // 子节点
      const parentNode = permissionMenuMap.get(menu.parentId)
      if (parentNode && currentNode.level! < maxDepth) {
        currentNode.level = (parentNode.level || 0) + 1
        parentNode.children.push(currentNode)
      }
    }
  })

  return rootPermissionMenus
}


/**
 * 将菜单数据转换为Vue Router路由配置
 * @param permissionNodeList 菜单数组
 * @returns 路由配置数组
 */
export function transformMenuToRoutes(permissionNodeList: PermissionNode[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  // 过滤出菜单类型的项（排除按钮）
  const menuItems = permissionNodeList.filter(menu => {
    return menu.menuType !== MenuType.BUTTON &&
      menu.status === 1 &&
      menu.isVisible
  })

  // 构建路由映射
  const routeMap = new Map<string, RouteRecordRaw>()

  menuItems.forEach(menu => {
    const route = createRouteFromMenu(menu)
    routeMap.set(menu.id, route)

    // 如果是根菜单，直接添加到routes
    if (menu.parentId === null || menu.parentId === '0') {
      routes.push(route)
    }
  })

  // 建立父子关系
  menuItems.forEach(menu => {
    if (menu.parentId && menu.parentId !== '0') {
      const parentRoute = routeMap.get(menu.parentId)
      const currentRoute = routeMap.get(menu.id)

      if (parentRoute && currentRoute) {
        if (!parentRoute.children) {
          parentRoute.children = []
        }
        parentRoute.children.push(currentRoute)
      }
    }
  })
  return routes
}


/**
 * 从菜单项创建路由配置
 * @param menu 菜单项
 * @returns 路由配置
 */
function createRouteFromMenu(menu: PermissionNode): RouteRecordRaw {
  const route: RouteRecordRaw = {
    path: formatRoutePath(menu.path),
    name: menu.menuName,
    meta: createRouteMeta(menu)
  }

  // 处理组件
  if (menu.component) {
    if (menu.isExternal) {
      // 外链处理
      route.meta!.link = menu.component
    } else {
      // 动态导入组件
      route.component = createAsyncComponent(menu.component)
    }
  }

  if (menu.menuType === MenuType.DIRECTORY && menu.children && menu.children.length > 0) {
    const firstChild = menu.children.find(child => child.menuType === MenuType.MENU)
    if (firstChild) {
      route.redirect = firstChild.path
    }
  }

  return route
}

/**
 * 创建路由元信息
 * @param menu 菜单项
 * @returns 路由元信息
 */
function createRouteMeta(menu: PermissionNode): RouteMetaInfo {
  return {
    title: menu.menuName,
    icon: menu.icon || undefined,
    hidden: !menu.isVisible,
    keepAlive: menu.isKeepalive,
    permissions: menu.permissions,
    breadcrumb: true,
    affix: false,
    sort: menu.sortOrder,
    menuId: menu.id,
    parentId: menu.parentId,
    link: menu.isExternal ? menu.component || undefined : undefined
  }
}

// 缓存模块映射，避免重复执行 import.meta.glob
const moduleCache = import.meta.glob('../views/**/*.vue')

// 组件路径解析缓存
const pathResolveCache = new Map<string, string>()

// 组件实例缓存
const componentInstanceCache = new Map<string, any>()

/**
 * 解析组件路径
 * @param componentPath 原始组件路径
 * @returns 解析后的模块路径
 */
function resolveComponentPath(componentPath: string): string | null {
  // 检查缓存
  if (pathResolveCache.has(componentPath)) {
    return pathResolveCache.get(componentPath)!
  }

  // 标准化路径
  const normalizedPath = componentPath
    .replace(/^\/+/, '') // 移除开头的斜杠
    .replace(/\.vue$/, '') // 移除.vue后缀

  // 构建可能的路径
  const possiblePaths = [
    `../views/${normalizedPath}.vue`,
    `../views/${normalizedPath}/index.vue`,
    `../views/${normalizedPath}View.vue`
  ]

  // 尝试找到匹配的模块路径
  for (const path of possiblePaths) {
    if (moduleCache[path]) {
      pathResolveCache.set(componentPath, path)
      return path
    }
  }

  // 未找到时缓存 null
  pathResolveCache.set(componentPath, null as any)
  return null
}

/**
 * 创建异步组件
 * @param componentPath 组件路径
 * @returns 异步组件函数
 */
function createAsyncComponent(componentPath: string) {
  console.log(`📦 [createAsyncComponent] 创建异步组件函数，路径: ${componentPath}`)

  return async () => {
    console.log(`🚀 [createAsyncComponent] 异步组件函数被调用，开始加载: ${componentPath}`)

    try {
      // 检查组件实例缓存
      if (componentInstanceCache.has(componentPath)) {
        console.log(`⚡ [createAsyncComponent] 使用缓存的组件实例: ${componentPath}`)
        return componentInstanceCache.get(componentPath)
      }

      // 解析组件路径
      const resolvedPath = resolveComponentPath(componentPath)

      if (resolvedPath) {
        console.log(`✅ [createAsyncComponent] 找到组件: ${resolvedPath}`)
        const component = await moduleCache[resolvedPath]()

        // 缓存组件实例
        componentInstanceCache.set(componentPath, component)
        return component
      }

      // 如果没有找到，抛出错误
      throw new Error(`组件未找到: ${componentPath}`)

    } catch (error) {
      console.error(`❌ [createAsyncComponent] 组件加载失败: ${componentPath}`, error)

      // 返回404页面作为fallback
      try {
        const fallbackPath = '../views/error/404View.vue'
        if (moduleCache[fallbackPath]) {
          console.log(`🔄 [createAsyncComponent] 使用404组件作为fallback`)

          // 检查404组件缓存
          const fallbackCacheKey = '__404_fallback__'
          if (componentInstanceCache.has(fallbackCacheKey)) {
            return componentInstanceCache.get(fallbackCacheKey)
          }

          const fallbackComponent = await moduleCache[fallbackPath]()
          componentInstanceCache.set(fallbackCacheKey, fallbackComponent)
          return fallbackComponent
        }
      } catch (fallbackError) {
        console.error(`❌ [createAsyncComponent] 404组件也加载失败:`, fallbackError)
      }

      // 最后的fallback：返回一个简单的错误组件
      const errorComponent = {
        default: {
          template: `<div style="padding: 20px; text-align: center; color: #f56565;">\n            <h3>组件加载失败</h3>\n            <p>路径: {{ componentPath }}</p>\n            <p>错误: {{ error }}</p>\n          </div>`,
          setup() {
            return {
              componentPath,
              error: error.message
            }
          }
        }
      }

      // 缓存错误组件
      componentInstanceCache.set(componentPath, errorComponent)
      return errorComponent
    }
  }
}

/**
 * 格式化路由路径
 * @param path 原始路径
 * @returns 格式化后的路径
 */
function formatRoutePath(path: string): string {
  if (!path) return '/'

  // 确保路径以/开头
  if (!path.startsWith('/')) {
    path = '/' + path
  }

  // 移除重复的斜杠
  path = path.replace(/\/+/g, '/')

  // 移除末尾的斜杠（除非是根路径）
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return path
}

/**
 * 菜单排序
 * @param permissionNodes 菜单数组
 * @param sortBy 排序字段
 * @param sortOrder 排序方向
 * @returns 排序后的菜单数组
 */
function __sortPermissionMenu(
  permissionNodes: PermissionNode[],
  sortBy: string,
  sortOrder: string,
): PermissionNode[] {
  return [...permissionNodes].sort((a, b) => {
    let aValue: number | string
    let bValue: number | string

    switch (sortBy) {
      case 'sortOrder':
        aValue = a.sortOrder || 0
        bValue = b.sortOrder || 0
        break
      default:
        aValue = a.sortOrder || 0
        bValue = b.sortOrder || 0
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
  })
}

/**
 * 标准化菜单数据
 * @param menuList 原始菜单数据
 * @returns 标准化后的菜单数据
 */
function __normalizeMenuData(menuList: PermissionNode[]): PermissionNode[] {
  return menuList.map(menu => ({
    id: menu.id,
    menuName: String(menu.menuName || ''),
    parentId: menu.parentId,
    menuType: Number(menu.menuType || 1),
    path: String(menu.path || ''),
    component: menu.component ? String(menu.component) : null,
    permissions: menu.permissions,
    icon: menu.icon ? String(menu.icon) : null,
    sortOrder: Number(menu.sortOrder || 0),
    status: Number(menu.status ?? 1),
    isExternal: menu.isExternal,
    isKeepalive: menu.isKeepalive,
    isVisible: menu.isVisible, // 默认显示
    children: Array.isArray(menu.children) ? __normalizeMenuData(menu.children) : undefined,
  }))
}
