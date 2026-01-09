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
  /* Element Plus 主色调 - 调整为更柔和的蓝色 */
  --el-color-primary: #4f86f7;
  --el-color-primary-light-3: #70a3f5;
  --el-color-primary-light-5: #8db9f3;
  --el-color-primary-light-7: #a9cef0;
  --el-color-primary-light-8: #b8d9f2;
  --el-color-primary-light-9: #c6e4f5;
  --el-color-primary-dark-2: #3b73e0;

  /* 侧边栏颜色 */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.85);
  --sidebar-active-bg: #1890ff;
  --sidebar-active-text: #ffffff;
  --sidebar-border-color: rgba(0, 0, 0, 0.08);
  --sidebar-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.04);

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
  border-right: 1px solid var(--sidebar-border-color, rgba(0, 0, 0, 0.08)) !important;
  box-shadow: var(--sidebar-shadow, 1px 0 0 0 rgba(0, 0, 0, 0.04)) !important;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
  transition: all 0.3s ease !important;
}

.el-menu-item:last-child,
.el-sub-menu__title:last-child {
  border-bottom: none !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}

.el-menu-item.is-active {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
  color: var(--sidebar-active-text, #ffffff) !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
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
  background: var(--el-fill-color-light, #fafafa) !important;
  color: var(--el-text-color-regular, #606266) !important;
}

/* ===== UI 界面整体优化 ===== */

/* 卡片样式优化 */
.el-card,
:deep(.el-card) {
  border: 1px solid var(--el-border-color-light, #e4e7ed) !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
  transition: all 0.3s ease !important;
}

.el-card:hover,
:deep(.el-card:hover) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  border-color: var(--el-color-primary-light-7, #c6e2ff) !important;
}

.el-card__header,
:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5) !important;
  padding: 16px 20px !important;
  font-weight: 600 !important;
  background-color: var(--el-bg-color, #ffffff) !important;
}

.el-card__body,
:deep(.el-card__body) {
  padding: 20px !important;
}

/* 输入框样式优化 */
.el-input__wrapper,
:deep(.el-input__wrapper) {
  border-radius: 6px !important;
  box-shadow: 0 0 0 1px var(--el-border-color, #dcdfe6) inset !important;
  transition: all 0.3s ease !important;
}

.el-input__wrapper:hover,
:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-3, #79bbff) inset !important;
}

.el-input__wrapper.is-focus,
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary, #409eff) inset !important;
}

/* 选择器样式优化 */
.el-select .el-input__wrapper,
:deep(.el-select .el-input__wrapper) {
  border-radius: 6px !important;
  transition: all 0.3s ease !important;
}

/* 表单间距优化 */
.el-form-item,
:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

/* 表格间距优化 */
.el-table,
:deep(.el-table) {
  border-radius: 8px !important;
  overflow: hidden !important;
}

.el-table td,
:deep(.el-table td) {
  padding: 12px 0 !important;
}

/* 分页器样式优化 */
.el-pagination,
:deep(.el-pagination) {
  padding: 8px 0 !important;
}

.el-pagination.is-background .el-pager li,
:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 6px !important;
  transition: all 0.3s ease !important;
}

/* 按钮间距优化 */
.el-button + .el-button,
:deep(.el-button + .el-button) {
  margin-left: 12px !important;
}

/* 对话框样式优化 */
.el-dialog,
:deep(.el-dialog) {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.el-dialog__header,
:deep(.el-dialog__header) {
  padding: 20px 24px !important;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5) !important;
  margin: 0 !important;
}

.el-dialog__body,
:deep(.el-dialog__body) {
  padding: 24px !important;
}

.el-dialog__footer,
:deep(.el-dialog__footer) {
  padding: 16px 24px 24px !important;
  border-top: 1px solid var(--el-border-color-lighter, #ebeef5) !important;
}

/* 标签样式优化 */
.el-tag,
:deep(.el-tag) {
  border-radius: 6px !important;
  padding: 4px 12px !important;
  font-weight: 500 !important;
}

/* 开关样式优化 */
.el-switch,
:deep(.el-switch) {
  height: 24px !important;
}

.el-switch.is-checked .el-switch__core,
:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--el-color-primary, #409eff) !important;
}

/* 进度条样式优化 */
.el-progress-bar__outer,
:deep(.el-progress-bar__outer) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
  border-radius: 12px !important;
}

.el-progress-bar__inner,
:deep(.el-progress-bar__inner) {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

/* 下拉菜单样式优化 */
.el-dropdown-menu,
:deep(.el-dropdown-menu) {
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  padding: 4px !important;
}

.el-dropdown-menu__item,
:deep(.el-dropdown-menu__item) {
  border-radius: 6px !important;
  margin: 2px 4px !important;
  transition: all 0.2s ease !important;
}

.el-dropdown-menu__item:hover,
:deep(.el-dropdown-menu__item:hover) {
  background-color: var(--el-fill-color-light, #f5f7fa) !important;
}

/* 提示框样式优化 */
.el-message,
:deep(.el-message) {
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  padding: 12px 20px !important;
}

/* 通知样式优化 */
.el-notification,
:deep(.el-notification) {
  border-radius: 8px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  padding: 16px 20px !important;
}

/* 抽屉样式优化 */
.el-drawer,
:deep(.el-drawer) {
  border-radius: 8px !important;
}

.el-drawer__header,
:deep(.el-drawer__header) {
  padding: 20px 24px !important;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5) !important;
  margin: 0 !important;
}

/* 侧边栏收起状态优化 */
.layout-sidebar.collapsed .logo-text {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* 过渡动画优化 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .el-card__body,
  :deep(.el-card__body) {
    padding: 12px !important;
  }

  .el-dialog__body,
  :deep(.el-dialog__body) {
    padding: 16px !important;
  }

  .el-dialog__footer,
  :deep(.el-dialog__footer) {
    padding: 12px 16px !important;
  }
}

/* ===== 按钮类型样式 - 使用更高优先级确保主题变量生效 ===== */

/* 主要按钮 */
:deep(.el-button--primary:not(.is-plain):not(.is-text):not(.is-link)) {
  background-color: var(--el-color-primary, #409eff) !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: #fff !important;
}

:deep(.el-button--primary:not(.is-plain):not(.is-text):not(.is-link):hover) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

:deep(.el-button--primary:not(.is-plain):not(.is-text):not(.is-link):active) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

/* 成功按钮 - 使用主题主色 */
:deep(.el-button--success:not(.is-plain):not(.is-text):not(.is-link)) {
  background-color: var(--el-color-primary, #409eff) !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: #fff !important;
}

:deep(.el-button--success:not(.is-plain):not(.is-text):not(.is-link):hover) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

:deep(.el-button--success:not(.is-plain):not(.is-text):not(.is-link):active) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

/* 警告按钮 */
:deep(.el-button--warning:not(.is-plain):not(.is-text):not(.is-link)) {
  background-color: var(--el-color-warning, #e6a23c) !important;
  border-color: var(--el-color-warning, #e6a23c) !important;
  color: #fff !important;
}

:deep(.el-button--warning:not(.is-plain):not(.is-text):not(.is-link):hover) {
  background-color: var(--el-color-warning-dark-2, #b88230) !important;
  border-color: var(--el-color-warning-dark-2, #b88230) !important;
}

:deep(.el-button--warning:not(.is-plain):not(.is-text):not(.is-link):active) {
  background-color: var(--el-color-warning-dark-2, #b88230) !important;
  border-color: var(--el-color-warning-dark-2, #b88230) !important;
}

/* 危险按钮 - 使用主题主色 */
:deep(.el-button--danger:not(.is-plain):not(.is-text):not(.is-link)) {
  background-color: var(--el-color-primary, #409eff) !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: #fff !important;
}

:deep(.el-button--danger:not(.is-plain):not(.is-text):not(.is-link):hover) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

:deep(.el-button--danger:not(.is-plain):not(.is-text):not(.is-link):active) {
  background-color: var(--el-color-primary-dark-2, #337ecc) !important;
  border-color: var(--el-color-primary-dark-2, #337ecc) !important;
}

/* 信息按钮 */
:deep(.el-button--info:not(.is-plain):not(.is-text):not(.is-link)) {
  background-color: var(--el-color-info, #909399) !important;
  border-color: var(--el-color-info, #909399) !important;
  color: #fff !important;
}

:deep(.el-button--info:not(.is-plain):not(.is-text):not(.is-link):hover) {
  background-color: var(--el-color-info-dark-2, #73767a) !important;
  border-color: var(--el-color-info-dark-2, #73767a) !important;
}

:deep(.el-button--info:not(.is-plain):not(.is-text):not(.is-link):active) {
  background-color: var(--el-color-info-dark-2, #73767a) !important;
  border-color: var(--el-color-info-dark-2, #73767a) !important;
}

/* Plain 按钮 */
:deep(.el-button--primary.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--success.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--warning.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-warning, #e6a23c) !important;
  color: var(--el-color-warning, #e6a23c) !important;
}

:deep(.el-button--danger.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-primary, #409eff) !important;
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--info.is-plain) {
  background-color: transparent !important;
  border-color: var(--el-color-info, #909399) !important;
  color: var(--el-color-info, #909399) !important;
}

:deep(.el-button--primary.is-plain:hover),
:deep(.el-button--success.is-plain:hover),
:deep(.el-button--warning.is-plain:hover),
:deep(.el-button--danger.is-plain:hover),
:deep(.el-button--info.is-plain:hover) {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}

/* Text 按钮 */
:deep(.el-button--primary.is-text) {
  color: var(--el-color-primary, #409eff) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--success.is-text) {
  color: var(--el-color-primary, #409eff) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--warning.is-text) {
  color: var(--el-color-warning, #e6a23c) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--danger.is-text) {
  color: var(--el-color-primary, #409eff) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--info.is-text) {
  color: var(--el-color-info, #909399) !important;
  background: transparent !important;
  border: none !important;
}

:deep(.el-button--primary.is-text:hover),
:deep(.el-button--success.is-text:hover),
:deep(.el-button--warning.is-text:hover),
:deep(.el-button--danger.is-text:hover) {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}

:deep(.el-button--info.is-text:hover) {
  background-color: var(--el-color-info-light-9, #f4f4f5) !important;
}

/* 默认按钮 */
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
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--warning.is-link) {
  color: var(--el-color-warning, #e6a23c) !important;
}

:deep(.el-button--danger.is-link) {
  color: var(--el-color-primary, #409eff) !important;
}

:deep(.el-button--info.is-link) {
  color: var(--el-color-info, #909399) !important;
}

:deep(.el-button.is-link:hover) {
  color: var(--el-color-primary-light-3, #79bbff) !important;
}

:deep(.el-button--success.is-link:hover) {
  color: var(--el-color-primary-light-3, #79bbff) !important;
}

:deep(.el-button--warning.is-link:hover) {
  color: var(--el-color-warning-light-3, #f0c78c) !important;
}

:deep(.el-button--danger.is-link:hover) {
  color: var(--el-color-primary-light-3, #79bbff) !important;
}

:deep(.el-button--info.is-link:hover) {
  color: var(--el-color-info-light-3, #b1b3b8) !important;
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
