<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="layout-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="@/assets/logo.svg" alt="Logo" class="logo-img" />
          <span v-show="!sidebarCollapsed" class="logo-text">{{ appConfig.title }}</span>
        </div>
      </div>

      <!-- 菜单导航 -->
      <nav class="sidebar-nav">
        <MenuTree :menus="visibleMenus" :collapsed="sidebarCollapsed" />
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="layout-main">
      <!-- 顶部导航栏 -->
      <header class="layout-header">
        <div class="header-left">
          <button
            class="sidebar-toggle"
            @click="toggleSidebar"
            :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
          >
            <el-icon><Operation v-if="!sidebarCollapsed" /><Operation v-else /></el-icon>
          </button>

          <!-- 面包屑导航 -->
          <Breadcrumb />
        </div>

        <div class="header-right">
          <!-- 用户信息 -->
          <UserDropdown />
        </div>
      </header>

      <!-- 标签页 -->
      <TabsView />

      <!-- 内容区域 -->
      <main class="layout-content" :class="{ fullscreen: isFullscreenPage }">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menu-store.ts'
import { useUserStore } from '@/stores/user-store.ts'
import { useUIStore } from '@/stores/ui-store.ts'
import { useTabsStore } from '@/stores/tabs-store.ts'
import { appConfig } from '@/utils/env'
import MenuTree from './components/MenuTree.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import UserDropdown from './components/UserDropdown.vue'
import TabsView from './components/TabsView.vue'
import { Operation } from '@element-plus/icons-vue'

// 路由
const route = useRoute()
const router = useRouter()

// Store
const menuStore = useMenuStore()
const userStore = useUserStore()
const uiStore = useUIStore()
const tabsStore = useTabsStore()

// 侧边栏状态
const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)

// 计算属性
const visibleMenus = computed(() => menuStore.completeMenuTree)

// 检测是否为全屏页面（如dashboard）
const isFullscreenPage = computed(() => {
  const fullscreenPages = ['/']
  return fullscreenPages.includes(route.path)
})

const cachedViews = computed(() => {
  // 使用标签页store的缓存列表
  return tabsStore.cachedTabs
})

// 方法
const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

// 路由监听
watch(
  () => route.fullPath,
  () => {
    // 排除不需要添加标签页的路由
    const excludePaths = ['/login', '/404', '/403', '/500']
    const isRedirectPath = route.path.startsWith('/redirect')
    if (!excludePaths.includes(route.path) && !isRedirectPath && route.meta?.title) {
      tabsStore.addTab(route)
    }
  },
  { immediate: false }, // 改为false，避免在初始化时重复添加
)

// 初始化
onMounted(() => {
  // 初始化用户信息
  userStore.initUserInfo()

  // 初始化固定标签页 - 总是添加dashboard
  const dashboardRoute = {
    path: '/dashboard',
    fullPath: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '首页',
      icon: 'Odometer',
      affix: true
    },
    query: {},
    params: {}
  } as any
  tabsStore.addTab(dashboardRoute)

  // 手动触发一次路由监听，确保当前路由被添加到标签页
  const excludePaths = ['/login', '/404', '/403', '/500']
  const isRedirectPath = route.path.startsWith('/redirect')
  if (!excludePaths.includes(route.path) && !isRedirectPath && route.meta?.title) {
    tabsStore.addTab(route)
  }
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.layout-sidebar {
  width: 240px;
  background: #001529;
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.layout-sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #1f1f1f;
}

.logo {
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  overflow: hidden;
  padding: 16px 0;
}

.layout-sidebar.collapsed .sidebar-nav {
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: 64px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-toggle {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.sidebar-toggle:hover {
  background-color: #f5f5f5;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f0f2f5;
}

.layout-content.fullscreen {
  padding: 0;
  background: #ffffff;
}

/* 路由过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
