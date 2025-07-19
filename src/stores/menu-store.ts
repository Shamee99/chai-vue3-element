import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from './user-store.ts'
import { buildPermissionTreeNode, getPermissionNodeListApi, transformMenuToRoutes } from '@/router/permission-router.ts'
import type { PermissionNode, PermissionTreeNode } from '@/router/permission-router.types.ts'
import { MenuType } from '@/constants/FreezeConst.ts'

/**
 * 菜单状态管理
 * 负责管理动态路由、菜单数据和权限相关的状态
 */
export const useMenuStore = defineStore('menu', () => {
  // ==================== 状态定义 ====================

  /** 原始菜单数据（从后端获取的扁平化数据） */
  const rawMenuList = ref<PermissionNode[]>([])

  /** 菜单树结构（用于渲染侧边栏） */
  const menuTree = ref<PermissionTreeNode[]>([])

  /** 包含固定dashboard菜单的完整菜单树 */
  const completeMenuTree = computed<PermissionTreeNode[]>(() => {
    // 创建固定的dashboard菜单项
    const dashboardMenu: PermissionTreeNode = {
      id: 'dashboard',
      parentId: null,
      menuName: '首页',
      menuType: MenuType.MENU,
      path: '/dashboard',
      component: '',
      icon: 'Odometer',
      orderNum: 0,
      status: 1,
      isVisible: true,
      keepAlive: false,
      permissions: '',
      remark: '首页',
      children: []
    }

    // 将dashboard菜单放在第一位，然后是动态菜单
    return [dashboardMenu, ...menuTree.value]
  })

  /** 动态路由列表 */
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  /** 是否已加载菜单数据 */
  const isMenuLoaded = ref(false)

  /** 是否已添加动态路由 */
  const isDynamicRoutesAdded = ref(false)

  /** 菜单加载状态 */
  const isLoading = ref(false)

  /** 错误信息 */
  const error = ref<string | null>(null)

  /** 菜单映射表（id -> menu） */
  const menuMap = computed(() => {
    const map = new Map<string, PermissionNode>()
    rawMenuList.value.forEach(menu => {
      map.set(menu.id, menu)
    })
    return map
  })

  /**
   * 加载菜单数据
   * @param forceRefresh 是否强制刷新
   */
  const loadMenuData = async (forceRefresh = false): Promise<void> => {
    // 如果已加载且不强制刷新，直接返回
    if (isMenuLoaded.value && !forceRefresh) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // 获取菜单数据
      const permissionNodes = await getPermissionNodeListApi()

      // 验证数据格式
      if (!Array.isArray(permissionNodes)) {
        throw new Error('菜单数据格式错误：期望数组格式')
      }

      // 保存原始数据
      rawMenuList.value = permissionNodes

      // 构建菜单树
      menuTree.value = buildPermissionTreeNode(permissionNodes)
      // 生成动态路由
      dynamicRoutes.value = transformMenuToRoutes(permissionNodes)

      // 标记已加载
      isMenuLoaded.value = true


    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载菜单数据失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取动态路由
   * @returns 动态路由数组
   */
  const getDynamicRoutes = (): RouteRecordRaw[] => {
    return dynamicRoutes.value
  }

  /**
   * 获取可访问的第一个路由地址
   */
  const getFirstVisibleRoute = (): string => {
    return <string>rawMenuList.value.find((raw: PermissionNode) => raw.menuType === MenuType.MENU)?.path
  }

  /**
   * 根据路径查找菜单
   * @param path 路由路径
   * @returns 菜单项或null
   */
  const findMenuByPath = (path: string): PermissionNode | null => {
    return rawMenuList.value.find(menu => menu.path === path) || null
  }

  /**
   * 根据ID查找菜单
   * @param id 菜单ID
   * @returns 菜单项或null
   */
  const findMenuById = (id: string): PermissionNode | null => {
    return menuMap.value.get(id) || null
  }

  /**
   * 检查用户是否有菜单权限
   * @param menu 菜单项
   * @returns 是否有权限
   */
  const hasMenuPermission = (menu: PermissionNode): boolean => {
    const userStore = useUserStore()

    // 如果没有权限要求，默认有权限
    if (!menu.permissions || menu.permissions.length === 0) {
      return true
    }
    return userStore.hasPermission(menu.permissions)
  }

  /**
   * 获取面包屑导航
   * @param path 当前路径
   * @returns 面包屑数组
   */
  const getBreadcrumb = (path: string): PermissionNode[] => {
    const menu = findMenuByPath(path)
    if (!menu) return []

    const breadcrumb: PermissionNode[] = []
    let currentMenu: PermissionNode | null = menu

    while (currentMenu) {
      breadcrumb.unshift(currentMenu)
      currentMenu = currentMenu.parentId ? findMenuById(currentMenu.parentId) : null
    }

    return breadcrumb
  }

  /**
   * 清除菜单数据
   */
  const clearMenuData = (): void => {
    rawMenuList.value = []
    menuTree.value = []
    dynamicRoutes.value = []
    isMenuLoaded.value = false
    isDynamicRoutesAdded.value = false
    error.value = null
  }

  // /**
  //  * 标记动态路由已添加
  //  */
  // const markDynamicRoutesAdded = (): void => {
  //   isDynamicRoutesAdded.value = true
  // }
  //
  // /**
  //  * 重置动态路由状态
  //  */
  // const resetDynamicRoutesState = (): void => {
  //   isDynamicRoutesAdded.value = false
  // }

  // ==================== 辅助方法 ====================

  // /**
  //  * 过滤可见菜单
  //  * @param menus 菜单树
  //  * @returns 过滤后的菜单树
  //  */
  // const filterVisibleMenus = (menus: MenuTreeNode[]): MenuTreeNode[] => {
  //   return menus.filter(menu => {
  //     // 过滤隐藏菜单
  //     if (!menu.isVisible) return false
  //
  //     // 检查权限
  //     if (!hasMenuPermission(menu)) return false
  //
  //     // 递归过滤子菜单
  //     if (menu.children && menu.children.length > 0) {
  //       menu.children = filterVisibleMenus(menu.children)
  //     }
  //
  //     return true
  //   })
  // }

  // ==================== 返回接口 ====================

  return {
    // 状态
    rawMenuList: readonly(rawMenuList),
    menuTree: readonly(menuTree),
    completeMenuTree: readonly(completeMenuTree),
    dynamicRoutes: readonly(dynamicRoutes),
    isMenuLoaded: readonly(isMenuLoaded),
    isDynamicRoutesAdded: readonly(isDynamicRoutesAdded),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 计算属性
    // visibleMenuTree,
    // allPermissions,
    menuMap,

    // 方法
    loadMenuData,
    getDynamicRoutes,
    getFirstVisibleRoute,
    findMenuByPath,
    findMenuById,
    hasMenuPermission,
    getBreadcrumb,
    clearMenuData
  }
})
