<template>
  <!-- 收起状态下的一级菜单（有子菜单） -->
  <el-popover
    v-if="collapsed && hasChildren && isTopLevel"
    placement="right-start"
    :width="200"
    trigger="hover"
    :show-after="100"
    :hide-after="100"
    popper-class="menu-popover"
  >
    <template #reference>
      <el-menu-item
        :index="menu.id.toString()"
        :disabled="!menu.isVisible"
        class="collapsed-menu-item"
      >
        <el-icon v-if="menu.icon">
          <component :is="menu.icon" />
        </el-icon>
        <template #title>
          <span>{{ menu.menuName }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- Popover 内容：子菜单列表 -->
    <div class="popover-menu">
      <div class="popover-title">{{ menu.menuName }}</div>
      <div class="popover-menu-list">
        <template v-for="child in menu.children" :key="child.id">
          <div v-if="child.isVisible" class="popover-menu-item" @click="handleChildClick(child)">
            <el-icon v-if="child.icon" class="menu-icon">
              <component :is="child.icon" />
            </el-icon>
            <span class="menu-text">{{ child.menuName }}</span>
          </div>
        </template>
      </div>
    </div>
  </el-popover>

  <!-- 收起状态下的一级菜单（无子菜单） -->
  <el-menu-item
    v-else-if="collapsed && isTopLevel && isMenuItem"
    :index="menu.path || menu.id.toString()"
    :disabled="!menu.isVisible"
    @click="handleClick"
    class="collapsed-menu-item"
  >
    <el-icon v-if="menu.icon">
      <component :is="menu.icon" />
    </el-icon>
    <template #title>
      <span>{{ menu.menuName }}</span>
    </template>
  </el-menu-item>

  <!-- 展开状态下的有子菜单的目录 -->
  <el-sub-menu
    v-else-if="!collapsed && hasChildren"
    :index="menu.id.toString()"
    :disabled="!menu.isVisible"
  >
    <template #title>
      <el-icon v-if="menu.icon">
        <component :is="menu.icon" />
      </el-icon>
      <span>{{ menu.menuName }}</span>
    </template>

    <template v-for="child in menu.children" :key="child.id">
      <MenuItem
        :menu="child"
        :collapsed="collapsed"
        :level="(level || 0) + 1"
        @menu-click="handleMenuClick"
      />
    </template>
  </el-sub-menu>

  <!-- 展开状态下的单个菜单项 -->
  <el-menu-item
    v-else-if="!collapsed && isMenuItem"
    :index="menu.path || menu.id.toString()"
    :disabled="!menu.isVisible"
    @click="handleClick"
  >
    <el-icon v-if="menu.icon">
      <component :is="menu.icon" />
    </el-icon>
    <template #title>
      <span>{{ menu.menuName }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PermissionTreeNode } from '@/router/permission-router.types.ts'
import { isExternalRoute, formatExternalPath } from '../api/layout.ts'

interface Props {
  menu: PermissionTreeNode
  collapsed?: boolean
  level?: number
}

interface Emits {
  (e: 'menu-click', menu: PermissionTreeNode): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// 计算属性
const hasChildren = computed(() => {
  // 只有目录类型(MenuType.DIRECTORY = 1)且有子菜单时才显示为下拉菜单
  return props.menu.menuType === 1 && props.menu.children && props.menu.children.length > 0
})

const isMenuItem = computed(() => {
  // 菜单类型(MenuType.MENU = 1)或者没有子菜单的目录都显示为可点击的菜单项
  return (
    (props.menu.menuType === 2 ||
      (props.menu.menuType === 1 && (!props.menu.children || props.menu.children.length === 0))) &&
    props.menu.isVisible
  )
})

const isTopLevel = computed(() => {
  // 判断是否为一级菜单（level为0或未定义时表示一级菜单）
  return (props.level || 0) === 0
})

// 方法
const handleClick = () => {
  if (!props.menu.path) return

  // 处理外链
  if (props.menu.isExternal || isExternalRoute(props.menu.path)) {
    const url = formatExternalPath(props.menu.path)
    window.open(url, '_blank')
    return
  }

  // 内部路由跳转
  router.push(props.menu.path)
  emit('menu-click', props.menu)
}

const handleMenuClick = (menu: PermissionTreeNode) => {
  emit('menu-click', menu)
}

const handleChildClick = (child: PermissionTreeNode) => {
  if (!child.path) return

  // 处理外链
  if (child.isExternal || isExternalRoute(child.path)) {
    const url = formatExternalPath(child.path)
    window.open(url, '_blank')
    return
  }

  // 内部路由跳转
  router.push(child.path)
  emit('menu-click', child)
}
</script>

<style scoped>
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  color: var(--sidebar-text-color, rgba(255, 255, 255, 0.85));
  border-radius: 6px;
  width: calc(100% - 0px);
  display: flex;
  align-items: center;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
  color: var(--sidebar-active-text, #fff) !important;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 8px;
  font-size: 16px;
  flex-shrink: 0;
}

/* 修复下拉箭头和文字重叠问题 */
:deep(.el-sub-menu__title) {
  padding-right: 50px !important;
  position: relative;
}

:deep(.el-sub-menu__icon-arrow) {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  margin-left: auto;
  font-size: 12px;
  width: unset !important;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: transparent !important;
  margin-left: 24px;
  width: calc(100% - 40px);
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: var(--sidebar-active-bg, #1890ff) !important;
}

/* 确保菜单项文字不会被箭头遮挡 */
:deep(.el-sub-menu__title span) {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
}

/* 折叠状态下的特殊处理 */
:deep(.el-menu--collapse .el-sub-menu__title) {
  padding-right: 24px !important;
}

:deep(.el-menu--collapse .el-sub-menu__icon-arrow) {
  right: 4px;
}

/* 收起状态下的菜单项样式 */
.collapsed-menu-item {
  justify-content: center !important;
  width: 100% !important;
  overflow: hidden !important;
}

.collapsed-menu-item :deep(.el-menu-item__title) {
  display: none;
}

/* 确保收起状态下不会出现滚动条 */
:deep(.el-menu--collapse) {
  overflow: hidden !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* Popover 菜单样式 */
.popover-menu {
  padding: 0;
}

.popover-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.popover-menu-list {
  padding: 8px 0;
}

.popover-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #606266;
}

.popover-menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.popover-menu-item .menu-icon {
  margin-right: 8px;
  font-size: 16px;
  flex-shrink: 0;
}

.popover-menu-item .menu-text {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style>
/* 全局 Popover 样式 */
.menu-popover {
  padding: 0 !important;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-popover .el-popover__content {
  padding: 0 !important;
}
</style>
