import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * UI状态管理Store
 * 负责管理界面相关的状态，如侧边栏折叠、主题等
 */
export const useUIStore = defineStore('ui', () => {
  // 状态
  const sidebarCollapsed = ref<boolean>(false)
  const rememberedUsername = ref<string>('')
  const rememberedPassword = ref<string>('')

  // 设置侧边栏折叠状态
  const setSidebarCollapsed = (collapsed: boolean): void => {
    sidebarCollapsed.value = collapsed
  }

  // 切换侧边栏折叠状态
  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置记住的用户名和密码
  const setRememberedCredentials = (username: string, password: string): void => {
    rememberedUsername.value = username
    rememberedPassword.value = password
  }

  // 清除记住的用户名和密码
  const clearRememberedCredentials = (): void => {
    rememberedUsername.value = ''
    rememberedPassword.value = ''
  }

  return {
    // 状态
    sidebarCollapsed,
    rememberedUsername,
    rememberedPassword,

    // 方法
    setSidebarCollapsed,
    toggleSidebar,
    setRememberedCredentials,
    clearRememberedCredentials
  }
}, {
  persist: {
    key: 'ui-store',
    storage: localStorage,
    paths: ['sidebarCollapsed', 'rememberedUsername', 'rememberedPassword']
  }
})