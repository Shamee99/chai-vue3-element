<template>
  <div class="tabs-view" v-if="tabList.length > 0">
    <div class="tabs-container">
      <!-- 标签页列表 -->
      <div class="tabs-content" ref="tabsContentRef">
        <div
          v-for="tab in tabList"
          :key="tab.fullPath"
          class="tab-item"
          :class="{
            'is-active': activeTab === tab.fullPath,
            'is-affix': tab.affix
          }"
          @click="handleTabClick(tab)"
          @contextmenu.prevent="handleContextMenu($event, tab)"
        >
          <el-icon v-if="tab.icon" class="tab-icon">
            <component :is="tab.icon" />
          </el-icon>
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon
            v-if="!tab.affix && tabList.length > 1"
            class="tab-close"
            @click.stop="handleTabClose(tab.fullPath)"
          >
            <Close />
          </el-icon>
        </div>
      </div>

      <!-- 标签页操作按钮 -->
      <div class="tabs-actions">
        <el-dropdown trigger="click" @command="handleDropdownCommand">
          <el-button type="text" class="action-button">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="refresh" :disabled="!activeTab">
                <el-icon><Refresh /></el-icon>
                刷新当前页
              </el-dropdown-item>
              <el-dropdown-item command="close-current" :disabled="!canCloseCurrent">
                <el-icon><Close /></el-icon>
                关闭当前页
              </el-dropdown-item>
              <el-dropdown-item command="close-others" :disabled="tabList.length <= 1">
                <el-icon><Remove /></el-icon>
                关闭其他页
              </el-dropdown-item>
              <el-dropdown-item command="close-all" :disabled="!hasCloseableTabs">
                <el-icon><CircleClose /></el-icon>
                关闭所有页
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-show="contextMenuVisible"
      class="context-menu"
      :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
      ref="contextMenuRef"
    >
      <div class="context-menu-item" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        <span>刷新</span>
      </div>
      <div
        class="context-menu-item"
        :class="{ disabled: !canCloseContextTab }"
        @click="handleCloseTab"
      >
        <el-icon><Close /></el-icon>
        <span>关闭</span>
      </div>
      <div class="context-menu-item" @click="handleCloseOthers">
        <el-icon><Remove /></el-icon>
        <span>关闭其他</span>
      </div>
      <div
        class="context-menu-item"
        @click="handleCloseLeft"
        :class="{ disabled: !canCloseLeft }"
      >
        <el-icon><Back /></el-icon>
        <span>关闭左侧</span>
      </div>
      <div
        class="context-menu-item"
        @click="handleCloseRight"
        :class="{ disabled: !canCloseRight }"
      >
        <el-icon><Right /></el-icon>
        <span>关闭右侧</span>
      </div>
      <div class="context-menu-item" @click="handleCloseAll">
        <el-icon><CircleClose /></el-icon>
        <span>关闭所有</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore, type TabItem } from '@/stores/tabs-store.ts'
import {
  Close,
  ArrowDown,
  Refresh,
  Remove,
  CircleClose,
  Back,
  Right
} from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// Store
const tabsStore = useTabsStore()

// 响应式数据
const tabsContentRef = ref<HTMLElement>()
const contextMenuRef = ref<HTMLElement>()
const contextMenuVisible = ref(false)
const contextMenuLeft = ref(0)
const contextMenuTop = ref(0)
const contextMenuTab = ref<TabItem | null>(null)

// 计算属性
const tabList = computed(() => tabsStore.tabList)
const activeTab = computed(() => tabsStore.activeTab)

// 是否可以关闭当前标签页
const canCloseCurrent = computed(() => {
  const currentTab = tabList.value.find(tab => tab.fullPath === activeTab.value)
  return currentTab && !currentTab.affix && tabList.value.length > 1
})

// 是否有可关闭的标签页
const hasCloseableTabs = computed(() => {
  return tabList.value.some(tab => !tab.affix)
})

// 右键菜单相关计算属性
const canCloseContextTab = computed(() => {
  return contextMenuTab.value && !contextMenuTab.value.affix
})

const canCloseLeft = computed(() => {
  if (!contextMenuTab.value) return false
  const index = tabList.value.findIndex(tab => tab.fullPath === contextMenuTab.value!.fullPath)
  return index > 0 && tabList.value.slice(0, index).some(tab => !tab.affix)
})

const canCloseRight = computed(() => {
  if (!contextMenuTab.value) return false
  const index = tabList.value.findIndex(tab => tab.fullPath === contextMenuTab.value!.fullPath)
  return index < tabList.value.length - 1 && tabList.value.slice(index + 1).some(tab => !tab.affix)
})

// 方法
const handleTabClick = (tab: TabItem) => {
  if (tab.fullPath !== activeTab.value) {
    router.push(tab.fullPath)
  }
}

const handleTabClose = (fullPath: string) => {
  const nextTab = tabsStore.closeTab(fullPath)
  if (nextTab) {
    router.push(nextTab.fullPath)
  } else if (tabList.value.length === 0) {
    // 如果没有标签页了，跳转到首页
    router.push('/')
  }
}

const handleDropdownCommand = (command: string) => {
  switch (command) {
    case 'refresh':
      handleRefreshCurrent()
      break
    case 'close-current':
      handleCloseCurrent()
      break
    case 'close-others':
      handleCloseOthers()
      break
    case 'close-all':
      handleCloseAll()
      break
  }
}

const handleRefreshCurrent = () => {
  if (activeTab.value) {
    // 通过重新加载当前路由来刷新页面
    const currentPath = router.currentRoute.value.fullPath
    // 使用正确的路径格式，去掉开头的斜杠避免双斜杠
    const redirectPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath
    router.replace(`/redirect/${redirectPath}`)
  }
}

const handleCloseCurrent = () => {
  if (activeTab.value && canCloseCurrent.value) {
    handleTabClose(activeTab.value)
  }
}

const handleCloseOthers = () => {
  if (activeTab.value) {
    tabsStore.closeOtherTabs(activeTab.value)
  }
}

const handleCloseAll = () => {
  const nextTab = tabsStore.closeAllTabs()
  if (nextTab) {
    router.push(nextTab.fullPath)
  } else {
    router.push('/')
  }
}

// 右键菜单相关方法
const handleContextMenu = (event: MouseEvent, tab: TabItem) => {
  contextMenuTab.value = tab
  contextMenuLeft.value = event.clientX
  contextMenuTop.value = event.clientY
  contextMenuVisible.value = true

  nextTick(() => {
    document.addEventListener('click', hideContextMenu)
  })
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
  contextMenuTab.value = null
  document.removeEventListener('click', hideContextMenu)
}

const handleRefresh = () => {
  if (contextMenuTab.value) {
    // 通过重新加载当前路由来刷新页面
    const targetPath = contextMenuTab.value.fullPath
    // 使用正确的路径格式，去掉开头的斜杠避免双斜杠
    const redirectPath = targetPath.startsWith('/') ? targetPath.substring(1) : targetPath
    router.replace(`/redirect/${redirectPath}`)
  }
  hideContextMenu()
}

const handleCloseTab = () => {
  if (contextMenuTab.value && canCloseContextTab.value) {
    handleTabClose(contextMenuTab.value.fullPath)
  }
  hideContextMenu()
}

const handleCloseLeft = () => {
  if (contextMenuTab.value && canCloseLeft.value) {
    tabsStore.closeLeftTabs(contextMenuTab.value.fullPath)
  }
  hideContextMenu()
}

const handleCloseRight = () => {
  if (contextMenuTab.value && canCloseRight.value) {
    tabsStore.closeRightTabs(contextMenuTab.value.fullPath)
  }
  hideContextMenu()
}

// 生命周期
onMounted(() => {
  // 监听点击事件，用于隐藏右键菜单
  document.addEventListener('click', (event) => {
    if (contextMenuVisible.value && contextMenuRef.value && !contextMenuRef.value.contains(event.target as Node)) {
      hideContextMenu()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
</script>

<style scoped>
.tabs-view {
  background: white;
  border-bottom: 1px solid #e8eaec;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.tabs-container {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
}

.tabs-content {
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-content::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
  margin-right: 3px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  user-select: none;
  min-width: 70px;
  font-size: 12px;
}

.tab-item:hover {
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.tab-item.is-active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.tab-item.is-affix {
  background: #f0f9ff;
  border-color: #91d5ff;
}

.tab-item.is-affix.is-active {
  background: #1890ff;
  border-color: #1890ff;
}

.tab-icon {
  margin-right: 4px;
  font-size: 12px;
}

.tab-title {
  font-size: 12px;
  margin-right: 4px;
}

.tab-close {
  font-size: 10px;
  border-radius: 50%;
  padding: 1px;
  transition: all 0.3s;
}

.tab-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.tab-item.is-active .tab-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tabs-actions {
  margin-left: 6px;
}

.action-button {
  padding: 2px 6px;
  font-size: 12px;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  z-index: 9999;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  min-width: 120px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 13px;
}

.context-menu-item:hover:not(.disabled) {
  background: #f5f7fa;
}

.context-menu-item.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.context-menu-item .el-icon {
  margin-right: 8px;
  font-size: 14px;
}
</style>
