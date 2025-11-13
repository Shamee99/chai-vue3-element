import request from '@/utils/request'
import type { TableInfo, GeneratorRequest, GeneratorResult } from './generator.types'

/**
 * 获取数据库表列表
 */
export const getTableListApi = () => {
  return request.get<TableInfo[]>('/generator/tables')
}

/**
 * 生成代码
 */
export const generateCodeApi = (data: GeneratorRequest) => {
  return request.post<GeneratorResult>('/generator/generate', data)
}

/**
 * 批量生成代码
 */
export const batchGenerateCodeApi = (data: {
  tableNames: string[]
  moduleName: string
  packageName: string
  author: string
  generateFrontend: boolean
  tablePrefix?: string
  overwrite: boolean
}) => {
  return request.post<Record<string, GeneratorResult>>('/generator/batch-generate', data)
}

