<template>
  <div class="theme-switcher">
    <el-dropdown trigger="click" placement="bottom-end" @command="handleThemeChange">
      <div class="theme-trigger" :title="currentThemeName" @click="handleTriggerClick">
        <div class="theme-preview">
          <div class="color-circle" :style="{ backgroundColor: currentThemeColor }"></div>
          <el-icon class="theme-icon"><Sunny /></el-icon>
        </div>
      </div>

      <template #dropdown>
        <el-dropdown-menu class="theme-dropdown">
          <div class="theme-dropdown-header">
            <span class="theme-dropdown-title">主题切换</span>
            <el-button text size="small" @click.stop="handleResetTheme" class="reset-btn">
              重置
            </el-button>
          </div>

          <!-- 使用 div 而不是 el-dropdown-menu-item -->
          <div
            v-for="theme in availableThemes"
            :key="theme.value"
            :class="{ 'theme-item': true, 'is-active': theme.value === currentTheme }"
            @click="handleThemeChange(theme.value)"
            class="menu-item-wrapper"
          >
            <div class="theme-item-content">
              <div class="theme-color-preview">
                <div
                  class="color-dot"
                  :style="{
                    backgroundColor: themeColors[theme.value]?.['--el-color-primary'] || '#409eff',
                  }"
                ></div>
              </div>
              <div class="theme-info">
                <span class="theme-name">{{ theme.label }}</span>
                <span class="theme-desc">{{ theme.description }}</span>
              </div>
              <el-icon v-if="theme.value === currentTheme" class="check-icon">
                <Check />
              </el-icon>
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Sunny, Check } from '@element-plus/icons-vue'
import { useUIStore } from '@/stores/ui-store'
import { themes, getThemeByKey, type ThemeColors } from '@/utils/theme/theme.config'

// Store
const uiStore = useUIStore()

// 当前主题
const currentTheme = computed(() => uiStore.currentTheme)

// 可用主题列表
const availableThemes = computed(() => uiStore.getAvailableThemes())

// 当前主题名称
const currentThemeName = computed(() => {
  const theme = themes.find((t) => t.key === currentTheme.value)
  return theme?.name || '默认主题'
})

// 当前主题颜色
const currentThemeColor = computed(() => {
  const theme = themes.find((t) => t.key === currentTheme.value)
  return theme?.colors['--el-color-primary'] || '#409eff'
})

// 主题颜色映射（用于预览）
const themeColors = computed(() => {
  const colors: Record<string, ThemeColors> = {} as Record<string, ThemeColors>
  themes.forEach((theme) => {
    colors[theme.key] = theme.colors
  })
  return colors
})

// 切换主题
const handleThemeChange = (themeKey: string) => {
  const theme = getThemeByKey(themeKey)
  if (!theme) {
    ElMessage.error({ message: '主题不存在' })
    return
  }

  uiStore.setTheme(themeKey)
  ElMessage.success({ message: `已切换到${theme.name}` })
}

// 重置主题
const handleResetTheme = () => {
  uiStore.resetTheme()
  ElMessage.success({ message: '已重置为默认主题' })
}

// 监听主题变化
watch(
  currentTheme,
  (newTheme, oldTheme) => {
    // 主题变化处理
  },
  { immediate: true },
)

// 组件挂载时检查初始化状态
onMounted(() => {
  uiStore.initTheme()
})
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
}

.theme-trigger {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.theme-trigger:hover {
  background-color: var(--el-fill-color-light);
}

.theme-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.theme-icon {
  font-size: 18px;
  color: var(--el-text-color-secondary);
  transition: color 0.3s;
}

.theme-dropdown {
  min-width: 280px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-light);
  margin-bottom: 4px;
}

.theme-dropdown-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.reset-btn {
  font-size: 12px;
  color: var(--el-color-primary);
}

.reset-btn:hover {
  color: var(--el-color-primary-dark-2);
}

/* 菜单项样式 */
.menu-item-wrapper {
  cursor: pointer;
  padding: 0;
  margin: 4px 0;
  border-radius: 6px;
  transition: all 0.3s;
}

.menu-item-wrapper:hover {
  background-color: var(--el-fill-color-light);
}

.menu-item-wrapper.is-active {
  background-color: var(--el-color-primary-light-9);
}

.theme-item {
  padding: 10px 12px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.theme-color-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-dot {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.3s,
    transform 0.2s;
}

.menu-item-wrapper:hover .color-dot {
  transform: scale(1.1);
}

.theme-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.theme-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.check-icon {
  font-size: 16px;
  color: var(--el-color-primary);
  transition: all 0.3s;
}

/* 暗色主题适配 */
:root.dark .theme-trigger:hover,
[data-theme='dark'] .theme-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root.dark .menu-item-wrapper:hover,
[data-theme='dark'] .menu-item-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

:root.dark .menu-item-wrapper.is-active,
[data-theme='dark'] .menu-item-wrapper.is-active {
  background-color: rgba(64, 158, 255, 0.15);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .theme-dropdown {
    min-width: 260px;
  }

  .theme-item {
    padding: 8px 10px;
  }

  .color-dot {
    width: 28px;
    height: 28px;
  }

  .theme-name {
    font-size: 13px;
  }

  .theme-desc {
    font-size: 11px;
  }
}
</style>
