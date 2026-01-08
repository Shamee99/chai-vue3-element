<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui-store'

console.log('🎨 App component loaded')

// Store
const uiStore = useUIStore()

// 组件挂载时初始化主题
onMounted(() => {
  console.log('🎨 App mounted, initializing theme...')
  console.log('🎨 Current theme from store:', uiStore.currentTheme)

  // 确保主题已初始化（因为ui-store会在首次使用时自动初始化）
  const theme = uiStore.getCurrentThemeConfig()
  console.log('🎨 Theme config:', theme)

  console.log('🎨 Checking CSS variables...')
  const root = document.documentElement
  const primaryColor = root.style.getPropertyValue('--el-color-primary')
  console.log('🎨 Current CSS variable --el-color-primary:', primaryColor)

  if (!primaryColor) {
    console.warn('🎨 CSS variable --el-color-primary is not set, applying theme colors...')
    uiStore.initTheme()
  } else {
    console.log('🎨 CSS variables are already set')
  }
})
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: var(--el-text-color-primary, #333);
  background-color: var(--page-bg-color, #f0f2f5);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus 样式覆盖 */
.el-menu {
  border-right: none !important;
  background-color: transparent !important;
}

.el-menu-item,
.el-sub-menu__title {
  color: var(--sidebar-text-color, rgba(255, 255, 255, 0.85)) !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

.el-menu-item.is-active {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
  color: var(--sidebar-active-text, #fff) !important;
}
</style>
