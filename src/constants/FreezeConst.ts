/**
 * 冻结的 状态选项
 */
export const STATUS_OPTIONS = [
  { label: '正常', value: '1' as const },
  { label: '停用', value: '0' as const }
] as const


/**
 * 菜单类型选项
 */
export const MENU_TYPE_OPTIONS = [
  { label: '目录', value: '1' as const },
  { label: '菜单', value: '2' as const },
  { label: '按钮', value: '3' as const }
] as const

/**
 * 菜单类型标签映射
 */
export const MENU_TYPE_TAG_MAP = {
  '1': 'primary',
  '2': 'success',
  '3': 'warning'
} as const

/**
 * 菜单类型文本映射
 */
export const MENU_TYPE_TEXT_MAP = {
  '1': '目录',
  '2': '菜单',
  '3': '按钮'
} as const

/**
 * 菜单类型枚举
 */
export enum MenuType {
  /** 目录 */
  DIRECTORY = 1,
  /** 菜单 */
  MENU = 2,
  /** 按钮 */
  BUTTON = 3
}

/**
 * 菜单状态枚举
 */
export enum MenuStatus {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}
