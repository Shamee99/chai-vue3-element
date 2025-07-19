/**
 * 应用日志系统
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static instance: Logger
  private logLevel: LogLevel = LogLevel.INFO
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  setLogLevel(level: LogLevel) {
    this.logLevel = level
  }
  
  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }
  
  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level}] ${message}${contextStr}`
  }
  
  debug(message: string, context?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, context))
    }
  }
  
  info(message: string, context?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context))
    }
  }
  
  warn(message: string, context?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context))
    }
  }
  
  error(message: string, error?: Error, context?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, context))
      if (error) {
        console.error('Error details:', error)
      }
    }
  }
}

/**
 * 全局日志实例
 */
export const logger = Logger.getInstance()

/**
 * 错误边界处理器
 */
export class ErrorHandler {
  /**
   * 处理菜单加载错误
   */
  static handleMenuLoadError(error: Error, context?: any): void {
    logger.error('菜单加载失败', error, context)
    
    // 可以在这里添加错误上报逻辑
    // 例如发送到错误监控服务
  }
  
  /**
   * 处理路由加载错误
   */
  static handleRouteLoadError(error: Error, routePath?: string): void {
    logger.error(`路由加载失败: ${routePath}`, error, { routePath })
  }
  
  /**
   * 处理组件加载错误
   */
  static handleComponentLoadError(error: Error, componentPath?: string): void {
    logger.error(`组件加载失败: ${componentPath}`, error, { componentPath })
  }
}