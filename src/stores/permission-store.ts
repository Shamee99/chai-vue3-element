import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuPermissionResult, PermissionNode } from '../router/permission-router.types.ts'

/**
 * 权限管理Store
 * 负责管理用户权限、角色和权限检查
 */
export const usePermissionStore = defineStore('permission', () => {
  // 状态
  const permissions = ref<string[]>([])
  const roles = ref<string[]>([])
  const permissionLoaded = ref(false)

  // 计算属性
  const hasAnyPermission = computed(() => permissions.value.length > 0)
  const hasAnyRole = computed(() => roles.value.length > 0)
  const isAdmin = computed(() => roles.value.includes('admin') || permissions.value.includes('*'))

  // 设置权限数据
  const setPermissions = (userPermissions: string[]): void => {
    permissions.value = userPermissions || []
    permissionLoaded.value = true
  }

  // 设置角色数据
  const setRoles = (userRoles: string[]): void => {
    roles.value = userRoles || []
  }

  // 检查单个权限
  const hasPermission = (permission: string): boolean => {
    if (!permission) return true
    if (isAdmin.value) return true
    return permissions.value.includes(permission)
  }

  // 检查多个权限（任一匹配）
  const hasAnyPermissions = (permissionList: string[]): boolean => {
    if (!permissionList || permissionList.length === 0) return true
    if (isAdmin.value) return true
    return permissionList.some(permission => permissions.value.includes(permission))
  }

  // 检查多个权限（全部匹配）
  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (!permissionList || permissionList.length === 0) return true
    if (isAdmin.value) return true
    return permissionList.every(permission => permissions.value.includes(permission))
  }

  // 检查角色
  const hasRole = (role: string): boolean => {
    if (!role) return true
    if (isAdmin.value) return true
    return roles.value.includes(role)
  }

  // 检查多个角色（任一匹配）
  const hasAnyRoles = (roleList: string[]): boolean => {
    if (!roleList || roleList.length === 0) return true
    if (isAdmin.value) return true
    return roleList.some(role => roles.value.includes(role))
  }

  // 检查多个角色（全部匹配）
  const hasAllRoles = (roleList: string[]): boolean => {
    if (!roleList || roleList.length === 0) return true
    if (isAdmin.value) return true
    return roleList.every(role => roles.value.includes(role))
  }

  // 检查路由权限
  const checkRoutePermission = (route: RouteRecordRaw): boolean => {
    const routePermissions = route.meta?.permissions as string[]
    if (!routePermissions || routePermissions.length === 0) return true
    return hasAnyPermissions(routePermissions)
  }

  // 清除权限数据
  const clearPermissions = (): void => {
    permissions.value = []
    roles.value = []
    permissionLoaded.value = false
  }

  // 从用户信息初始化权限
  const initPermissionsFromUser = (userInfo: any): void => {
    setPermissions(userInfo?.permissions || [])
    setRoles(userInfo?.roles || [])
  }

  return {
    // 状态
    permissions,
    roles,
    permissionLoaded,

    // 计算属性
    hasAnyPermission,
    hasAnyRole,
    isAdmin,

    // 方法
    setPermissions,
    setRoles,
    hasPermission,
    hasAnyPermissions,
    hasAllPermissions,
    hasRole,
    hasAnyRoles,
    hasAllRoles,
    checkRoutePermission,
    clearPermissions,
    initPermissionsFromUser
  }
})
