/**
 * 菜单相关工具函数
 */
import { MENU_TYPE_TAG_MAP, MENU_TYPE_TEXT_MAP } from '@/constants/FreezeConst.ts'

/**
 * 获取菜单类型标签样式
 */
export const getMenuTypeTag = (type: string): string => {
  return MENU_TYPE_TAG_MAP[type as keyof typeof MENU_TYPE_TAG_MAP] || 'info'
}

/**
 * 获取菜单类型文本
 */
export const getMenuTypeText = (type: string): string => {
  return MENU_TYPE_TEXT_MAP[type as keyof typeof MENU_TYPE_TEXT_MAP] || ''
}
