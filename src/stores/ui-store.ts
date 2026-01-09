import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  themes,
  getThemeByKey,
  applyThemeColors,
  DEFAULT_THEME_KEY,
  THEME_STORAGE_KEY,
} from '@/utils/theme/theme.config'

/**
 * UI状态管理Store
 * 负责管理界面相关的状态，如侧边栏折叠、主题等
 */
export const useUIStore = defineStore('ui', () => {
  // 状态
  const sidebarCollapsed = ref<boolean>(false)
  const rememberedUsername = ref<string>('')
  const rememberedPassword = ref<string>('')
  const progressVisible = ref<boolean>(false)
  const progressValue = ref<number>(0)
  const currentTheme = ref<string>(DEFAULT_THEME_KEY)

  // 设置侧边栏折叠状态
  const setSidebarCollapsed = (collapsed: boolean): void => {
    sidebarCollapsed.value = collapsed
    saveStateToStorage()
  }

  // 切换侧边栏折叠状态
  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    saveStateToStorage()
  }

  // 设置记住的用户名和密码
  const setRememberedCredentials = (username: string, password: string): void => {
    rememberedUsername.value = username
    rememberedPassword.value = password
    saveStateToStorage()
  }

  // 清除记住的用户名和密码
  const clearRememberedCredentials = (): void => {
    rememberedUsername.value = ''
    rememberedPassword.value = ''
    saveStateToStorage()
  }

  // 显示进度条
  const showProgress = (): void => {
    progressVisible.value = true
    progressValue.value = 0
  }

  // 隐藏进度条
  const hideProgress = (): void => {
    progressVisible.value = false
    progressValue.value = 0
  }

  // 设置进度值
  const setProgress = (value: number): void => {
    progressValue.value = Math.min(Math.max(value, 0), 100)
  }

  // 增加进度值
  const incrementProgress = (increment: number = 10): void => {
    const newValue = progressValue.value + increment
    setProgress(newValue)
  }

  // 完成进度（设置为100%然后隐藏）
  const finishProgress = (): void => {
    setProgress(100)
    setTimeout(() => {
      hideProgress()
    }, 300)
  }

  // 设置主题
  const setTheme = (themeKey: string): void => {
    currentTheme.value = themeKey

    // 应用主题颜色
    const theme = getThemeByKey(themeKey)
    if (theme) {
      applyThemeColors(theme.colors)
    }

    // 保存到本地存储
    localStorage.setItem(THEME_STORAGE_KEY, themeKey)
  }

  // 切换到下一个主题
  const nextTheme = (): void => {
    const currentIndex = themes.findIndex((theme) => theme.key === currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].key)
  }

  // 切换到上一个主题
  const prevTheme = (): void => {
    const currentIndex = themes.findIndex((theme) => theme.key === currentTheme.value)
    const prevIndex = (currentIndex - 1 + themes.length) % themes.length
    setTheme(themes[prevIndex].key)
  }

  // 初始化主题（从本地存储加载）
  const initTheme = (): void => {
    const savedThemeKey = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedThemeKey) {
      setTheme(savedThemeKey)
    } else {
      setTheme(DEFAULT_THEME_KEY)
    }
  }

  // 重置主题到默认
  const resetTheme = (): void => {
    setTheme(DEFAULT_THEME_KEY)
  }


  // 获取当前主题配置
  const getCurrentThemeConfig = () => {
    return getThemeByKey(currentTheme.value)
  }

  // 获取所有可选主题
  const getAvailableThemes = () => {
    return themes.map((theme) => ({
      label: theme.name,
      value: theme.key,
      description: theme.description,
      type: theme.type,
      icon: theme.icon,
    }))
  }

  // 保存状态到本地存储
  const saveStateToStorage = (): void => {
    const state = {
      sidebarCollapsed: sidebarCollapsed.value,
      rememberedUsername: rememberedUsername.value,
      rememberedPassword: rememberedPassword.value,
      progressVisible: progressVisible.value,
      progressValue: progressValue.value,
      currentTheme: currentTheme.value,
    }
    localStorage.setItem('ui-store', JSON.stringify(state))
  }

  // 从本地存储加载状态
  const loadStateFromStorage = (): void => {
    try {
      const savedState = localStorage.getItem('ui-store')
      if (savedState) {
        const state = JSON.parse(savedState)
        if (state.sidebarCollapsed !== undefined) {
          sidebarCollapsed.value = state.sidebarCollapsed
        }
        if (state.rememberedUsername !== undefined) {
          rememberedUsername.value = state.rememberedUsername
        }
        if (state.rememberedPassword !== undefined) {
          rememberedPassword.value = state.rememberedPassword
        }
        if (state.progressVisible !== undefined) {
          progressVisible.value = state.progressVisible
        }
        if (state.progressValue !== undefined) {
          progressValue.value = state.progressValue
        }
        if (state.currentTheme !== undefined) {
          currentTheme.value = state.currentTheme
          // 应用主题颜色
          const theme = getThemeByKey(state.currentTheme)
          if (theme) {
            applyThemeColors(theme.colors)
          }
        }
      }
    } catch (error) {
      console.error('加载UI状态失败:', error)
    }
  }

  return {
    // 状态
    sidebarCollapsed,
    rememberedUsername,
    rememberedPassword,
    progressVisible,
    progressValue,
    currentTheme,

    // 方法
    setSidebarCollapsed,
    toggleSidebar,
    setRememberedCredentials,
    clearRememberedCredentials,
    showProgress,
    hideProgress,
    setProgress,
    incrementProgress,
    finishProgress,
    setTheme,
    nextTheme,
    prevTheme,
    initTheme,
    resetTheme,
    getCurrentThemeConfig,
    getAvailableThemes,
    saveStateToStorage,
    loadStateFromStorage,
  }
})
