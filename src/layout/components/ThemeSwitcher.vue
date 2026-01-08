<template>
  <div class="theme-switcher">
    <el-dropdown
      trigger="click"
      placement="bottom-end"
      @command="handleThemeChange"
      @visible-change="handleDropdownVisible"
    >
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

          <el-dropdown-menu-item
            v-for="theme in availableThemes"
            :key="theme.value"
            :command="theme.value"
            :class="{ 'is-active': theme.value === currentTheme }"
            class="theme-item"
            @click.native="handleItemClick(theme.value)"
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
          </el-dropdown-menu-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Sunny, Check } from '@element-plus/icons-vue'
import { useUIStore } from '@/stores/ui-store'
import {
  themes,
  getThemeByKey,
  applyThemeColors,
  DEFAULT_THEME_KEY,
} from '@/utils/theme/theme.config'

console.log('🎨 ThemeSwitcher component loaded')

// Store
const uiStore = useUIStore()

// 调试状态
const debugInfo = ref({
  currentTheme: '',
  availableThemesCount: 0,
  uiStoreInitialized: false,
})

// 当前主题
const currentTheme = computed(() => {
  const theme = uiStore.currentTheme
  debugInfo.value.currentTheme = theme
  console.log('🎨 Current theme:', theme)
  return theme
})

// 可用主题列表
const availableThemes = computed(() => {
  const themesList = uiStore.getAvailableThemes()
  debugInfo.value.availableThemesCount = themesList.length
  console.log('🎨 Available themes:', themesList)
  return themesList
})

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
  const colors: Record<string, any> = {}
  themes.forEach((theme) => {
    colors[theme.key] = theme.colors
  })
  console.log('🎨 Theme colors:', colors)
  return colors
})

// 切换主题
const handleThemeChange = (themeKey: string) => {
  console.log('🎨 =====================')
  console.log('🎨 Theme change triggered')
  console.log('🎨 New theme key:', themeKey)
  console.log('🎨 Current theme before change:', currentTheme.value)

  try {
    // 检查主题是否存在
    const theme = getThemeByKey(themeKey)
    if (!theme) {
      console.error('🎨 Theme not found:', themeKey)
      ElMessage.error('主题不存在')
      return
    }

    console.log('🎨 Theme found:', theme)
    console.log('🎨 Theme colors:', theme.colors)

    // 强制刷新：先清除所有主题样式
    console.log('🎨 Force clearing all theme styles')
    const root = document.documentElement
    Object.keys(theme.colors).forEach((property) => {
      console.log(
        '🎨 Clearing property:',
        property,
        'Old value:',
        root.style.getPropertyValue(property),
      )
      root.style.removeProperty(property)
    })

    // 强制重绘
    void root.offsetWidth

    // 应用主题
    console.log('🎨 Applying theme colors...')
    uiStore.setTheme(themeKey)

    console.log('🎨 Theme set successfully')
    ElMessage.success(`已切换到${theme.name}`)

    // 立即检查CSS变量
    setTimeout(() => {
      console.log('🎨 Checking CSS variables immediately...')
      const primaryColor = root.style.getPropertyValue('--el-color-primary')
      const sidebarBg = root.style.getPropertyValue('--sidebar-bg-color')
      const pageBg = root.style.getPropertyValue('--page-bg-color')

      console.log('🎨 CSS variables after theme change:')
      console.log('  --el-color-primary:', primaryColor)
      console.log('  --sidebar-bg-color:', sidebarBg)
      console.log('  --page-bg-color:', pageBg)
      console.log('🎨 Expected values:')
      console.log('  --el-color-primary:', theme.colors['--el-color-primary'])
      console.log('  --sidebar-bg-color:', theme.colors['--sidebar-bg-color'])
      console.log('  --page-bg-color:', theme.colors['--page-bg-color'])
    }, 100)

    // 二次延迟检查
    setTimeout(() => {
      const allComputed = window.getComputedStyle(root)
      console.log('🎨 Computed styles (window.getComputedStyle):')
      Object.keys(theme.colors).forEach((property) => {
        const computed = allComputed.getPropertyValue(property)
        console.log(`  ${property}:`, computed)
      })
    }, 200)
  } catch (error) {
    console.error('🎨 Theme change error:', error)
    ElMessage.error('主题切换失败')
  }
}

// 处理下拉菜单可见性
const handleDropdownVisible = (visible: boolean) => {
  console.log('🎨 Dropdown visible:', visible)
  if (visible) {
    console.log('🎨 Current theme when dropdown opens:', currentTheme.value)
  }
}

// 处理触发按钮点击
const handleTriggerClick = () => {
  console.log('🎨 Trigger button clicked')
  console.log('🎨 Current theme:', currentTheme.value)
  console.log('🎨 Available themes count:', availableThemes.value.length)
}

// 处理菜单项点击
const handleItemClick = (themeKey: string) => {
  console.log('🎨 Theme item clicked:', themeKey)
}

// 重置主题
const handleResetTheme = () => {
  console.log('🎨 =====================')
  console.log('🎨 Reset theme triggered')

  try {
    uiStore.resetTheme()
    ElMessage.success('已重置为默认主题')
    console.log('🎨 Theme reset successfully')

    // 延迟检查CSS变量
    setTimeout(() => {
      const root = document.documentElement
      const primaryColor = root.style.getPropertyValue('--el-color-primary')
      console.log('🎨 CSS variable after reset:', primaryColor)
    }, 500)
  } catch (error) {
    console.error('🎨 Theme reset error:', error)
    ElMessage.error('主题重置失败')
  }
}

// 监听主题变化，用于调试
watch(currentTheme, (newTheme, oldTheme) => {
  console.log('🎨 =====================')
  console.log('🎨 Theme changed')
  console.log('🎨 From:', oldTheme)
  console.log('🎨 To:', newTheme)
  console.log('🎨 =====================')
})

// 组件挂载时检查初始化状态
onMounted(() => {
  console.log('🎨 =====================')
  console.log('🎨 ThemeSwitcher mounted')
  console.log('🎨 UI Store initialized')

  // 检查当前CSS变量
  const root = document.documentElement
  const currentPrimary = root.style.getPropertyValue('--el-color-primary')
  console.log('🎨 Current CSS variable:', currentPrimary)

  // 初始化主题
  uiStore.initTheme()

  debugInfo.value.uiStoreInitialized = true
  console.log('🎨 Theme initialized')
  console.log('🎨 =====================')
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

.theme-item {
  padding: 0;
  margin: 4px 0;
  border-radius: 6px;
  transition: all 0.3s;
}

.theme-item:hover {
  background-color: var(--el-fill-color-light);
}

.theme-item.is-active {
  background-color: var(--el-color-primary-light-9);
}

.theme-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
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

.theme-item:hover .color-dot {
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

/* 深色主题适配 */
:root.dark .theme-trigger:hover,
[data-theme='dark'] .theme-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

:root.dark .theme-item:hover,
[data-theme='dark'] .theme-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

:root.dark .theme-item.is-active,
[data-theme='dark'] .theme-item.is-active {
  background-color: rgba(64, 158, 255, 0.15);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .theme-dropdown {
    min-width: 260px;
  }

  .theme-item-content {
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
