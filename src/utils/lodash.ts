/**
 * Lodash 工具函数封装
 * 提供常用的 lodash 函数和项目特定的工具函数
 */

import _ from 'lodash'

// 导出常用的 lodash 函数
export {
  // 数组操作
  chunk,
  compact,
  concat,
  difference,
  drop,
  dropRight,
  fill,
  findIndex,
  findLastIndex,
  flatten,
  flattenDeep,
  fromPairs,
  head,
  indexOf,
  initial,
  intersection,
  join,
  last,
  lastIndexOf,
  nth,
  pull,
  pullAll,
  pullAllBy,
  pullAllWith,
  pullAt,
  remove,
  reverse,
  slice,
  sortedIndex,
  sortedIndexBy,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexBy,
  sortedLastIndexOf,
  sortedUniq,
  sortedUniqBy,
  tail,
  take,
  takeRight,
  takeRightWhile,
  takeWhile,
  union,
  unionBy,
  unionWith,
  uniq,
  uniqBy,
  uniqWith,
  unzip,
  unzipWith,
  without,
  xor,
  xorBy,
  xorWith,
  zip,
  zipObject,
  zipObjectDeep,
  zipWith,

  // 集合操作
  countBy,
  every,
  filter,
  find,
  findLast,
  flatMap,
  flatMapDeep,
  flatMapDepth,
  forEach,
  forEachRight,
  groupBy,
  includes,
  invokeMap,
  keyBy,
  map,
  orderBy,
  partition,
  reduce,
  reduceRight,
  reject,
  sample,
  sampleSize,
  shuffle,
  size,
  some,
  sortBy,

  // 函数操作
  after,
  ary,
  before,
  bind,
  bindKey,
  curry,
  curryRight,
  debounce,
  defer,
  delay,
  flip,
  memoize,
  negate,
  once,
  overArgs,
  partial,
  partialRight,
  rearg,
  rest,
  spread,
  throttle,
  unary,
  wrap,

  // 语言操作
  castArray,
  clone,
  cloneDeep,
  cloneDeepWith,
  cloneWith,
  conformsTo,
  eq,
  gt,
  gte,
  isArguments,
  isArray,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBoolean,
  isBuffer,
  isDate,
  isElement,
  isEmpty,
  isEqual,
  isEqualWith,
  isError,
  isFinite,
  isFunction,
  isInteger,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  lt,
  lte,
  toArray,
  toFinite,
  toInteger,
  toLength,
  toNumber,
  toPlainObject,
  toSafeInteger,
  toString,

  // 数学操作
  add,
  ceil,
  divide,
  floor,
  max,
  maxBy,
  mean,
  meanBy,
  min,
  minBy,
  multiply,
  round,
  subtract,
  sum,
  sumBy,

  // 数字操作
  clamp,
  inRange,
  random,

  // 对象操作
  assign,
  assignIn,
  assignInWith,
  assignWith,
  at,
  create,
  defaults,
  defaultsDeep,
  entries,
  entriesIn,
  extend,
  extendWith,
  findKey,
  findLastKey,
  forIn,
  forInRight,
  forOwn,
  forOwnRight,
  functions,
  functionsIn,
  get,
  has,
  hasIn,
  invert,
  invertBy,
  invoke,
  keys,
  keysIn,
  mapKeys,
  mapValues,
  merge,
  mergeWith,
  omit,
  omitBy,
  pick,
  pickBy,
  result,
  set,
  setWith,
  toPairs,
  toPairsIn,
  transform,
  unset,
  update,
  updateWith,
  values,
  valuesIn,

  // 字符串操作
  camelCase,
  capitalize,
  deburr,
  endsWith,
  escape,
  escapeRegExp,
  kebabCase,
  lowerCase,
  lowerFirst,
  pad,
  padEnd,
  padStart,
  parseInt,
  repeat,
  replace,
  snakeCase,
  split,
  startCase,
  startsWith,
  template,
  toLower,
  toUpper,
  trim,
  trimEnd,
  trimStart,
  truncate,
  unescape,
  upperCase,
  upperFirst,
  words
} from 'lodash'

// 项目特定的工具函数

/**
 * 深度合并对象，常用于合并配置
 * @param target 目标对象
 * @param sources 源对象
 * @returns 合并后的对象
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  return _.mergeWith(target, ...sources, (objValue, srcValue) => {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
  })
}

/**
 * 安全获取对象属性值，支持默认值
 * @param obj 对象
 * @param path 属性路径
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export const safeGet = <T = any>(
  obj: any,
  path: string | string[],
  defaultValue?: T
): T => {
  return _.get(obj, path, defaultValue)
}

/**
 * 防抖函数，常用于搜索输入
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 选项
 * @returns 防抖后的函数
 */
export const createDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300,
  options?: _.DebounceSettings
): _.DebouncedFunc<T> => {
  return _.debounce(func, wait, options)
}

/**
 * 节流函数，常用于滚动事件
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 选项
 * @returns 节流后的函数
 */
export const createThrottle = <T extends (...args: any[]) => any>(
  func: T,
  wait = 100,
  options?: _.ThrottleSettings
): _.DebouncedFunc<T> => {
  return _.throttle(func, wait, options)
}

/**
 * 数组去重，支持对象数组
 * @param array 数组
 * @param iteratee 迭代函数或属性名
 * @returns 去重后的数组
 */
export const uniqueArray = <T>(
  array: T[],
  iteratee?: ((value: T) => any) | keyof T
): T[] => {
  if (!iteratee) {
    return _.uniq(array)
  }
  return _.uniqBy(array, iteratee)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param chars 字符集
 * @returns 随机字符串
 */
export const randomString = (
  length = 8,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 树形数据扁平化
 * @param tree 树形数据
 * @param childrenKey 子节点键名
 * @returns 扁平化数组
 */
export const flattenTree = <T extends Record<string, any>>(
  tree: T[],
  childrenKey = 'children'
): T[] => {
  const result: T[] = []
  
  const flatten = (nodes: T[]) => {
    nodes.forEach(node => {
      result.push(node)
      if (node[childrenKey] && _.isArray(node[childrenKey])) {
        flatten(node[childrenKey])
      }
    })
  }
  
  flatten(tree)
  return result
}

/**
 * 数组转树形结构
 * @param array 扁平数组
 * @param options 配置选项
 * @returns 树形结构
 */
export const arrayToTree = <T extends Record<string, any>>(
  array: T[],
  options: {
    idKey?: string
    parentIdKey?: string
    childrenKey?: string
    rootValue?: any
  } = {}
): T[] => {
  const {
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey = 'children',
    rootValue = null
  } = options
  
  const tree: T[] = []
  const map = new Map<any, T>()
  
  // 创建映射
  array.forEach(item => {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  })
  
  // 构建树形结构
  array.forEach(item => {
    const node = map.get(item[idKey])!
    const parentId = item[parentIdKey]
    
    if (parentId === rootValue || parentId === undefined || parentId === null) {
      tree.push(node)
    } else {
      const parent = map.get(parentId)
      if (parent) {
        parent[childrenKey].push(node)
      }
    }
  })
  
  return tree
}

// 导出 lodash 实例
export default _