/**
 * 表信息
 */
export interface TableInfo {
  tableName: string
  tableComment: string
  createTime: string
}

/**
 * 代码生成请求
 */
export interface GeneratorRequest {
  tableName: string
  moduleName: string
  packageName: string
  author: string
  generateFrontend: boolean
  tablePrefix?: string
  overwrite: boolean
}

/**
 * 代码生成结果
 */
export interface GeneratorResult {
  entity: string
  mapper: string
  service: string
  serviceImpl: string
  controller: string
  dtoQueryRequest: string
  dtoSaveRequest: string
  dtoEditRequest: string
  dtoPageResp: string
  view?: string
  api?: string
  apiTypes?: string
  componentAdd?: string
  componentEdit?: string
}

