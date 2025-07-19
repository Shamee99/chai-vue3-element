import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission-store.ts'
import { useUserStore } from '@/stores/user-store.ts'

/**
 * 按钮权限指令
 * 用法：
 * v-permsDirective-button="'user:add'" - 检查单个权限
 * v-permsDirective-button="['user:add', 'user:edit']" - 检查多个权限（OR关系）
 * v-permsDirective-button="{ permissions: ['user:add'], mode: 'and' }" - 检查多个权限（AND关系）
 * v-permsDirective-button="{ permissions: ['user:add'], action: 'disable' }" - 无权限时禁用而不是隐藏
 */

interface PermissionConfig {
  permissions: string | string[]
  mode?: 'or' | 'and' // 多个权限的判断模式，默认为 'or'
  action?: 'hide' | 'disable' // 无权限时的操作，默认为 'hide'
}

// 检查权限的核心函数
function checkPermission(permissions: string | string[], mode: 'or' | 'and' = 'or'): boolean {
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()

  // 如果是超级管理员，直接返回 true
  if (userStore.isSuperAdmin) {
    return true
  }

  const userPermissions = permissionStore.permissions

  if (typeof permissions === 'string') {
    return userPermissions.includes(permissions)
  }

  if (Array.isArray(permissions)) {
    if (mode === 'and') {
      // AND 模式：所有权限都必须拥有
      return permissions.every(permission => userPermissions.includes(permission))
    } else {
      // OR 模式：拥有任意一个权限即可
      return permissions.some(permission => userPermissions.includes(permission))
    }
  }

  return false
}

// 处理元素显示/隐藏
function handleElementVisibility(el: HTMLElement, hasPermission: boolean, action: 'hide' | 'disable') {
  if (action === 'disable') {
    // 禁用模式
    if (hasPermission) {
      el.removeAttribute('disabled')
      el.style.opacity = '1'
      el.style.cursor = 'pointer'
    } else {
      el.setAttribute('disabled', 'true')
      el.style.opacity = '0.5'
      el.style.cursor = 'not-allowed'
      // 阻止点击事件
      el.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
  } else {
    // 隐藏模式
    if (hasPermission) {
      el.style.display = ''
    } else {
      el.style.display = 'none'
    }
  }
}

// 解析指令值
function parseDirectiveValue(value: any): PermissionConfig {
  if (typeof value === 'string') {
    return {
      permissions: value,
      mode: 'or',
      action: 'hide'
    }
  }

  if (Array.isArray(value)) {
    return {
      permissions: value,
      mode: 'or',
      action: 'hide'
    }
  }

  if (typeof value === 'object' && value !== null) {
    return {
      permissions: value.permissions || [],
      mode: value.mode || 'or',
      action: value.action || 'hide'
    }
  }

  return {
    permissions: [],
    mode: 'or',
    action: 'hide'
  }
}

const permissionButtonDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const config = parseDirectiveValue(binding.value)
    const hasPermission = checkPermission(config.permissions, config.mode)

    // 保存原始配置到元素上，用于后续更新
    ;(el as any).__permissionConfig = config

    handleElementVisibility(el, hasPermission, config.action)
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const config = parseDirectiveValue(binding.value)
    const hasPermission = checkPermission(config.permissions, config.mode)

    // 更新配置
    ;(el as any).__permissionConfig = config

    handleElementVisibility(el, hasPermission, config.action)
  },

  beforeUnmount(el: HTMLElement) {
    // 清理
    delete (el as any).__permissionConfig
  }
}

export default permissionButtonDirective

// 导出检查权限的工具函数，供组件内部使用
export { checkPermission }

// 使用示例：
/*
<!-- 基础用法 -->
<el-button v-permsDirective-button="'user:add'">新增用户</el-button>

<!-- 多个权限（OR关系） -->
<el-button v-permsDirective-button="['user:add', 'user:import']">新增/导入用户</el-button>

<!-- 多个权限（AND关系） -->
<el-button v-permsDirective-button="{ permissions: ['user:add', 'user:manage'], mode: 'and' }">高级新增</el-button>

<!-- 无权限时禁用而不是隐藏 -->
<el-button v-permsDirective-button="{ permissions: 'user:delete', action: 'disable' }">删除用户</el-button>

<!-- 复杂配置 -->
<el-button v-permsDirective-button="{
  permissions: ['user:edit', 'user:manage'],
  mode: 'or',
  action: 'disable'
}">编辑用户</el-button>
*/
