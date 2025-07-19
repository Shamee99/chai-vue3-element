import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
  /** 标签页标题 */
  title: string
  /** 路由路径 */
  path: string
  /** 完整路径（包含查询参数） */
  fullPath: string
  /** 路由名称 */
  name?: string | symbol
  /** 是否固定标签页（不可关闭） */
  affix?: boolean
  /** 图标 */
  icon?: string
  /** 查询参数 */
  query?: Record<string, any>
  /** 路由参数 */
  params?: Record<string, any>
}

export const useTabsStore = defineStore('tabs', () => {
  // 状态
  const tabList = ref<TabItem[]>([])
  const activeTab = ref<string>('')
  
  // 计算属性
  const visitedTabs = computed(() => tabList.value)
  const cachedTabs = computed(() => 
    tabList.value
      .filter(tab => tab.name)
      .map(tab => tab.name as string)
  )
  
  /**
   * 添加标签页
   * @param route 路由对象
   */
  const addTab = (route: RouteLocationNormalized) => {
    // 检查是否已存在（优先按fullPath匹配，其次按path匹配）
    const existingTab = tabList.value.find(tab => 
      tab.fullPath === route.fullPath || 
      (tab.path === route.path && tab.name === route.name)
    )
    
    if (existingTab) {
      // 如果存在相同的标签页，更新为当前路由的fullPath
      existingTab.fullPath = route.fullPath
      existingTab.query = route.query
      existingTab.params = route.params
      activeTab.value = route.fullPath
      return
    }
    
    // 创建新标签页
    const newTab: TabItem = {
      title: (route.meta?.title as string) || route.name?.toString() || '未命名页面',
      path: route.path,
      fullPath: route.fullPath,
      name: route.name,
      affix: route.meta?.affix as boolean || false,
      icon: route.meta?.icon as string,
      query: route.query,
      params: route.params
    }
    
    tabList.value.push(newTab)
    activeTab.value = route.fullPath
  }
  
  /**
   * 关闭标签页
   * @param targetPath 要关闭的标签页路径
   */
  const closeTab = (targetPath: string) => {
    const index = tabList.value.findIndex(tab => tab.fullPath === targetPath)
    if (index === -1) return null
    
    const tab = tabList.value[index]
    
    // 固定标签页不能关闭
    if (tab.affix) {
      return null
    }
    
    // 移除标签页
    tabList.value.splice(index, 1)
    
    // 如果关闭的是当前激活的标签页，需要切换到其他标签页
    if (activeTab.value === targetPath && tabList.value.length > 0) {
      // 优先切换到右边的标签页，如果没有则切换到左边的
      const nextTab = tabList.value[index] || tabList.value[index - 1]
      if (nextTab) {
        activeTab.value = nextTab.fullPath
        return nextTab
      }
    }
    
    return null
  }
  
  /**
   * 关闭其他标签页
   * @param targetPath 保留的标签页路径
   */
  const closeOtherTabs = (targetPath: string) => {
    const targetTab = tabList.value.find(tab => tab.fullPath === targetPath)
    if (!targetTab) return
    
    // 保留固定标签页和目标标签页
    tabList.value = tabList.value.filter(tab => 
      tab.affix || tab.fullPath === targetPath
    )
    
    activeTab.value = targetPath
  }
  
  /**
   * 关闭所有标签页
   */
  const closeAllTabs = () => {
    // 只保留固定标签页
    const affixTabs = tabList.value.filter(tab => tab.affix)
    tabList.value = affixTabs
    
    // 如果有固定标签页，激活第一个
    if (affixTabs.length > 0) {
      activeTab.value = affixTabs[0].fullPath
      return affixTabs[0]
    }
    
    activeTab.value = ''
    return null
  }
  
  /**
   * 关闭左侧标签页
   * @param targetPath 目标标签页路径
   */
  const closeLeftTabs = (targetPath: string) => {
    const targetIndex = tabList.value.findIndex(tab => tab.fullPath === targetPath)
    if (targetIndex === -1) return
    
    // 保留固定标签页和目标标签页右侧的标签页
    tabList.value = tabList.value.filter((tab, index) => 
      tab.affix || index >= targetIndex
    )
  }
  
  /**
   * 关闭右侧标签页
   * @param targetPath 目标标签页路径
   */
  const closeRightTabs = (targetPath: string) => {
    const targetIndex = tabList.value.findIndex(tab => tab.fullPath === targetPath)
    if (targetIndex === -1) return
    
    // 保留固定标签页和目标标签页左侧的标签页
    tabList.value = tabList.value.filter((tab, index) => 
      tab.affix || index <= targetIndex
    )
  }
  
  /**
   * 设置活动标签页
   * @param path 标签页路径
   */
  const setActiveTab = (path: string) => {
    activeTab.value = path
  }
  
  /**
   * 刷新标签页
   * @param targetPath 要刷新的标签页路径
   */
  const refreshTab = (targetPath: string) => {
    const tab = tabList.value.find(tab => tab.fullPath === targetPath)
    return tab
  }
  
  /**
   * 初始化固定标签页
   */
  const initAffixTabs = (routes: RouteLocationNormalized[]) => {
    routes.forEach(route => {
      if (route.meta?.affix) {
        addTab(route)
      }
    })
  }
  
  /**
   * 清空所有标签页
   */
  const clearTabs = () => {
    tabList.value = []
    activeTab.value = ''
  }
  
  return {
    // 状态
    tabList,
    activeTab,
    
    // 计算属性
    visitedTabs,
    cachedTabs,
    
    // 方法
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeLeftTabs,
    closeRightTabs,
    setActiveTab,
    refreshTab,
    initAffixTabs,
    clearTabs
  }
})