import type { Directive, DirectiveBinding } from 'vue'

/**
 * 权限指令（已禁用前端权限检查）
 * 用法：v-permsDirective="'system:user:add'"
 * 或者：v-permsDirective="['system:user:add', 'system:user:edit']"
 *
 * 注意：根据业务需求，菜单点击权限已交由后端接口过滤，
 * 前端不再进行权限判断，所有元素默认显示
 */
export const permsDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 权限检查已移至后端，前端不再隐藏元素
    // 保留指令结构以便将来需要时快速恢复
    if (import.meta.env.DEV) {
      const { value } = binding
      console.log(`🔓 权限指令已禁用，元素将显示。权限标识: ${JSON.stringify(value)}`)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 权限检查已移至后端，前端不再隐藏元素
    if (import.meta.env.DEV) {
      const { value } = binding
      console.log(`🔓 权限指令已禁用，元素将显示。权限标识: ${JSON.stringify(value)}`)
    }
  }
}

/**
 * 角色指令（已禁用前端角色检查）
 * 用法：v-role="'admin'"
 * 或者：v-role="['admin', 'user']"
 *
 * 注意：根据业务需求，角色权限已交由后端接口过滤，
 * 前端不再进行角色判断，所有元素默认显示
 */
export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 角色检查已移至后端，前端不再隐藏元素
    if (import.meta.env.DEV) {
      const { value } = binding
      console.log(`🔓 角色指令已禁用，元素将显示。角色标识: ${JSON.stringify(value)}`)
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 角色检查已移至后端，前端不再隐藏元素
    if (import.meta.env.DEV) {
      const { value } = binding
      console.log(`🔓 角色指令已禁用，元素将显示。角色标识: ${JSON.stringify(value)}`)
    }
  }
}

// 默认导出所有指令
export default {
  permission: permsDirective,
  role
}
