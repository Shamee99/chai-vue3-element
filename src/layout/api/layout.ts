

/**
 * 检查路由是否为外链
 */
export const isExternalRoute = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 格式化外链路径
 */
export const formatExternalPath = (path: string): string => {
  if (isExternalRoute(path)) {
    return path
  }

  // 如果不是完整的URL，添加http://前缀
  if (path.includes('.') && !path.startsWith('//')) {
    return `http://${path}`
  }

  return path
}
