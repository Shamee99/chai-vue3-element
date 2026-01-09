<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui-store'

// Store
const uiStore = useUIStore()

// 组件挂载时初始化主题
onMounted(() => {
  uiStore.initTheme()
})
</script>

<style>
/* 默认主题变量值 */
:root {
  /* Element Plus 主色调 */
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;

  /* 侧边栏颜色 */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.85);
  --sidebar-active-bg: #1890ff;
  --sidebar-active-text: #ffffff;

  /* 页面背景色 */
  --page-bg-color: #f0f2f5;

  /* 头部背景色 */
  --header-bg-color: #ffffff;
}

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

/* 布局容器 */
.layout-container {
  background-color: var(--page-bg-color, #f0f2f5) !important;
}

/* 侧边栏 */
.layout-sidebar {
  background: var(--sidebar-bg-color, #001529) !important;
  transition: background-color 0.3s ease;
}

/* 主内容区 */
.layout-content {
  background: var(--page-bg-color, #f0f2f5) !important;
  transition: background-color 0.3s ease;
}

/* 头部 */
.layout-header {
  background: var(--header-bg-color, white) !important;
  transition: background-color 0.3s ease;
}

/* Element Plus 菜单样式 */
.el-menu {
  background-color: var(--sidebar-bg-color, #001529) !important;
  border-right: none !important;
}

.el-menu-item,
.el-sub-menu__title {
  color: var(--sidebar-text-color, rgba(255, 255, 255, 0.85)) !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.el-menu-item.is-active {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
  color: var(--sidebar-active-text, #ffffff) !important;
}

/* 子菜单样式 */
.el-sub-menu .el-menu-item {
  background-color: transparent !important;
}

.el-sub-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.el-sub-menu .el-menu-item.is-active {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
}

/* 侧边栏头部 */
.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* 进度条 */
.global-progress .progress-bar {
  background: linear-gradient(
    90deg,
    var(--el-color-primary, #409eff) 0%,
    var(--el-color-primary-light-3, #79bbff) 50%,
    var(--el-color-primary, #409eff) 100%
  ) !important;
  box-shadow: 0 0 10px var(--el-color-primary, #409eff) !important;
}

/* 头部操作按钮 */
.header-action-btn {
  color: var(--el-text-color-regular, #666) !important;
}

.header-action-btn:hover {
  background-color: var(--el-fill-color-light, #f5f5f5) !important;
  color: var(--el-color-primary, #409eff) !important;
}

/* 主题切换器 */
.theme-switcher .reset-btn {
  color: var(--el-color-primary, #409eff) !important;
}

.theme-switcher .reset-btn:hover {
  color: var(--el-color-primary-dark-2, #337ecc) !important;
}

.theme-switcher .theme-item.is-active {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}

.theme-switcher .check-icon {
  color: var(--el-color-primary, #409eff) !important;
}

/* 表格悬停效果 */
:deep(.el-table__body tr:hover > td) {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}

/* 表格表头 */
:deep(.el-table__header-wrapper) {
  background: #fafafa !important;
}

:deep(.el-table th.el-table__cell) {
  background: #fafafa !important;
  color: var(--el-text-color-regular, #606266) !important;
}

/* 按钮类型样式 - 让所有按钮类型都使用主题变量 */
:deep(.el-button--primary) {
  background-color: var(--el-color-primary, #409eff) !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: #fff !important;
}

:deep(.el-button--primary:hover) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

:deep(.el-button--primary:active) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

/* Plain 按钮 */
:deep(.el-button--primary.is-plain),
:deep(.el-button--success.is-plain),
:deep(.el-button--warning.is-plain),
:deep(.el-button--danger.is-plain),
:deep(.el-button--info.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--success.is-plain) {
  border-color: var(--el-color-success, #67c23a) !important;
  color: var(--el-color-success, #67c23a) !important;
}

:deep(.el-button--warning.is-plain) {
  border-color: var(--el-color-warning, #e6a23c) !important;
  color: var(--el-color-warning, #e6a23c) !important;
}

:deep(.el-button--danger.is-plain) {
  border-color: var(--el-color-danger, #f56c6c) !important;
  color: var(--el-color-danger, #f56c6c) !important;
}

:deep(.el-button--info.is-plain) {
  border-color: var(--el-color-info, #909399) !important;
  color: var(--el-color-info, #909399) !important;
}

:deep(.el-button--primary.is-plain:hover),
:deep(.el-button--success.is-plain:hover),
:deep(.el-button--warning.is-plain:hover),
:deep(.el-button--danger.is-plain:hover),
:deep(.el-button--info.is-plain:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

/* Text 按钮 */
:deep(.el-button--primary.is-text) {
  color: var(--el-color-primary, #409eff) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--success.is-text) {
  color: var(--el-color-success, #67c23a) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--warning.is-text) {
  color: var(--el-color-warning, #e6a23c) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--danger.is-text) {
  color: var(--el-color-danger, #f56c6c) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--info.is-text) {
  color: var(--el-color-info, #909399) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--primary.is-text:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

:deep(.el-button--success.is-text:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

:deep(.el-button--warning.is-text:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

:deep(.el-button--danger.is-text:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

:deep(.el-button--info.is-text:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

:deep(.el-button--success) {
  background-color: var(--el-color-success, #67c23a) !important;
  border-color: var(--el-color-success, #67c23a) !important;
  color: #fff !important;
}

:deep(.el-button--success:hover) {
  background-color: var(--el-color-success-dark-2, #529b2e) !important;
  border-color: var(--el-color-success-dark-2, #529b2e) !important;
}

:deep(.el-button--success:active) {
  background-color: var(--el-color-success-dark-2, #529b2e) !important;
  border-color: var(--el-color-success-dark-2, #529b2e) !important;
}

:deep(.el-button--warning) {
  background-color: var(--el-color-warning, #e6a23c) !important;
  border-color: var(--el-color-warning, #e6a23c) !important;
  color: #fff !important;
}

:deep(.el-button--warning:hover) {
  background-color: var(--el-color-warning-dark-2, #b88230) !important;
  border-color: var(--el-color-warning-dark-2, #b88230) !important;
}

:deep(.el-button--warning:active) {
  background-color: var(--el-color-warning-dark-2, #b88230) !important;
  border-color: var(--el-color-warning-dark-2, #b88230) !important;
}

:deep(.el-button--danger) {
  background-color: var(--el-color-danger, #f56c6c) !important;
  border-color: var(--el-color-danger, #f56c6c) !important;
  color: #fff !important;
}

:deep(.el-button--danger:hover) {
  background-color: var(--el-color-danger-dark-2, #c45656) !important;
  border-color: var(--el-color-danger-dark-2, #c45656) !important;
}

:deep(.el-button--danger:active) {
  background-color: var(--el-color-danger-dark-2, #c45656) !important;
  border-color: var(--el-color-danger-dark-2, #c45656) !important;
}

:deep(.el-button--info) {
  background-color: var(--el-color-info, #909399) !important;
  border-color: var(--el-color-info, #909399) !important;
  color: #fff !important;
}

:deep(.el-button--info:hover) {
  background-color: var(--el-color-info-dark-2, #73767a) !important;
  border-color: var(--el-color-info-dark-2, #73767a) !important;
}

:deep(.el-button--info:active) {
  background-color: var(--el-color-info-dark-2, #73767a) !important;
  border-color: var(--el-color-info-dark-2, #73767a) !important;
}

/* 按钮禁用状态 */
:deep(.el-button.is-disabled) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
  border-color: var(--el-border-color-light, #e4e7ed) !important;
  color: var(--el-text-color-disabled, #c0c4cc) !important;
}

/* 链接按钮 */
:deep(.el-button.is-link) {
  color: var(--el-color-primary, #409eff) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--success.is-link) {
  color: var(--el-color-success, #67c23a) !important;
}

:deep(.el-button--warning.is-link) {
  color: var(--el-color-warning, #e6a23c) !important;
}

:deep(.el-button--danger.is-link) {
  color: var(--el-color-danger, #f56c6c) !important;
}

:deep(.el-button--info.is-link) {
  color: var(--el-color-info, #909399) !important;
}

:deep(.el-button.is-link:hover) {
  color: var(--el-color-primary-light-3, #79bbff) !important;
}

:deep(.el-button--success.is-link:hover) {
  color: var(--el-color-success-light-3, #95d475) !important;
}

:deep(.el-button--warning.is-link:hover) {
  color: var(--el-color-warning-light-3, #f0c78c) !important;
}

:deep(.el-button--danger.is-link:hover) {
  color: var(--el-color-danger-light-3, #f89898) !important;
}

:deep(.el-button--info.is-link:hover) {
  color: var(--el-color-info-light-3, #b1b3b8) !important;
}

/* 文本类型按钮 */
:deep(.el-button--default) {
  color: var(--el-color-primary, #409eff) !important;
  background-color: var(--el-bg-color, #fff) !important;
  border-color: var(--el-border-color, #dcdfe6) !important;
}

:deep(.el-button--default:hover) {
  color: var(--el-color-primary-light-3, #79bbff) !important;
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
  border-color: var(--el-color-primary-light-7, #c6e2ff) !important;
}
</style>
