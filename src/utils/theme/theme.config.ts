/**
 * 主题配置文件
 * 定义支持的主题颜色方案和主题相关配置
 */

/**
 * 主题颜色配置接口
 */
export interface ThemeColors {
  // Element Plus 主色调
  '--el-color-primary': string
  '--el-color-primary-light-3': string
  '--el-color-primary-light-5': string
  '--el-color-primary-light-7': string
  '--el-color-primary-light-8': string
  '--el-color-primary-light-9': string
  '--el-color-primary-dark-2': string

  // 侧边栏背景色
  '--sidebar-bg-color': string
  '--sidebar-text-color': string
  '--sidebar-active-bg': string
  '--sidebar-active-text': string

  // 页面背景色
  '--page-bg-color': string

  // 头部背景色
  '--header-bg-color': string
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  /** 主题名称 */
  name: string
  /** 主题标识 */
  key: string
  /** 主题类型：light-亮色, dark-暗色 */
  type: 'light' | 'dark'
  /** 主题颜色配置 */
  colors: ThemeColors
  /** 主题图标 */
  icon?: string
  /** 主题描述 */
  description?: string
}

/**
 * 预定义的主题列表
 */
export const themes: ThemeConfig[] = [
  {
    name: '默认蓝',
    key: 'default',
    type: 'light',
    description: '默认蓝色主题',
    colors: {
      '--el-color-primary': '#409eff',
      '--el-color-primary-light-3': '#79bbff',
      '--el-color-primary-light-5': '#a0cfff',
      '--el-color-primary-light-7': '#c6e2ff',
      '--el-color-primary-light-8': '#d9ecff',
      '--el-color-primary-light-9': '#ecf5ff',
      '--el-color-primary-dark-2': '#337ecc',
      '--sidebar-bg-color': '#001529',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#1890ff',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#f0f2f5',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '天空蓝',
    key: 'sky',
    type: 'light',
    description: '清新的天空蓝色主题',
    colors: {
      '--el-color-primary': '#1890ff',
      '--el-color-primary-light-3': '#5ac8ff',
      '--el-color-primary-light-5': '#85dcff',
      '--el-color-primary-light-7': '#b0eeff',
      '--el-color-primary-light-8': '#c4f5ff',
      '--el-color-primary-light-9': '#d9fbff',
      '--el-color-primary-dark-2': '#1373cc',
      '--sidebar-bg-color': '#0a1a3a',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#1890ff',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#f0f5ff',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '翡翠绿',
    key: 'emerald',
    type: 'light',
    description: '自然清新的翡翠绿色主题',
    colors: {
      '--el-color-primary': '#52c41a',
      '--el-color-primary-light-3': '#7ed375',
      '--el-color-primary-light-5': '#a4e595',
      '--el-color-primary-light-7': '#c9f5b3',
      '--el-color-primary-light-8': '#daface2',
      '--el-color-primary-light-9': '#ebfbf0',
      '--el-color-primary-dark-2': '#429d15',
      '--sidebar-bg-color': '#002814',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#52c41a',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#f0fff4',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '活力橙',
    key: 'orange',
    type: 'light',
    description: '充满活力的橙色主题',
    colors: {
      '--el-color-primary': '#fa8c16',
      '--el-color-primary-light-3': '#fbb84c',
      '--el-color-primary-light-5': '#fcd675',
      '--el-color-primary-light-7': '#fdf29b',
      '--el-color-primary-light-8': '#ffdfb3',
      '--el-color-primary-light-9': '#ffeeca',
      '--el-color-primary-dark-2': '#c87f12',
      '--sidebar-bg-color': '#2f1a00',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#fa8c16',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#fff7e6',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '樱花粉',
    key: 'pink',
    type: 'light',
    description: '温柔浪漫的粉色主题',
    colors: {
      '--el-color-primary': '#eb2f96',
      '--el-color-primary-light-3': '#f05eb6',
      '--el-color-primary-light-5': '#f681cf',
      '--el-color-primary-light-7': '#f9a4e8',
      '--el-color-primary-light-8': '#fbb8f1',
      '--el-color-primary-light-9': '#fcd6f6',
      '--el-color-primary-dark-2': '#be2679',
      '--sidebar-bg-color': '#2f0023',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#eb2f96',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#fff0f8',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '暗夜黑',
    key: 'dark',
    type: 'dark',
    description: '护眼舒适的暗色主题',
    colors: {
      '--el-color-primary': '#409eff',
      '--el-color-primary-light-3': '#66b1ff',
      '--el-color-primary-light-5': '#8cc5ff',
      '--el-color-primary-light-7': '#b3d9ff',
      '--el-color-primary-light-8': '#c9e6ff',
      '--el-color-primary-light-9': '#e0f3ff',
      '--el-color-primary-dark-2': '#337ecc',
      '--sidebar-bg-color': '#001529',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#1890ff',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#141414',
      '--header-bg-color': '#1a1a1a',
    },
  },
  {
    name: '极简灰',
    key: 'gray',
    type: 'light',
    description: '低调优雅的灰色主题',
    colors: {
      '--el-color-primary': '#595959',
      '--el-color-primary-light-3': '#8c8c8c',
      '--el-color-primary-light-5': '#bfbfbf',
      '--el-color-primary-light-7': '#dedede',
      '--el-color-primary-light-8': '#e8e8e8',
      '--el-color-primary-light-9': '#f2f2f2',
      '--el-color-primary-dark-2': '#474747',
      '--sidebar-bg-color': '#1f1f1f',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#595959',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#f5f5f5',
      '--header-bg-color': '#ffffff',
    },
  },
  {
    name: '深紫',
    key: 'purple',
    type: 'light',
    description: '神秘高贵的紫色主题',
    colors: {
      '--el-color-primary': '#722ed1',
      '--el-color-primary-light-3': '#9255de',
      '--el-color-primary-light-5': '#b37fea',
      '--el-color-primary-light-7': '#d3adf5',
      '--el-color-primary-light-8': '#e3bcf8',
      '--el-color-primary-light-9': '#f3d9fb',
      '--el-color-primary-dark-2': '#5b25a7',
      '--sidebar-bg-color': '#120338',
      '--sidebar-text-color': 'rgba(255, 255, 255, 0.85)',
      '--sidebar-active-bg': '#722ed1',
      '--sidebar-active-text': '#ffffff',
      '--page-bg-color': '#f9f0ff',
      '--header-bg-color': '#ffffff',
    },
  },
]

/**
 * 默认主题key
 */
export const DEFAULT_THEME_KEY = 'default'

/**
 * 本地存储的主题key
 */
export const THEME_STORAGE_KEY = 'chai-admin-theme'

/**
 * 根据主题key获取主题配置
 * @param themeKey 主题key
 * @returns 主题配置，如果不存在则返回默认主题
 */
export function getThemeByKey(themeKey: string): ThemeConfig {
  return (
    themes.find((theme) => theme.key === themeKey) ||
    themes.find((theme) => theme.key === DEFAULT_THEME_KEY)!
  )
}

/**
 * 判断主题是否为暗色主题
 * @param themeKey 主题key
 * @returns 是否为暗色主题
 */
export function isDarkTheme(themeKey: string): boolean {
  const theme = getThemeByKey(themeKey)
  return theme.type === 'dark'
}

/**
 * 将主题颜色应用到文档
 * @param colors 主题颜色配置
 */
export function applyThemeColors(colors: ThemeColors): void {
  const root = document.documentElement
  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}
