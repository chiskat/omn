/** OmnError 构造参数 */
export interface OmnErrorOptions {
  /** 原始错误，用于错误链追踪 */
  cause?: Error
}

/** 自定义错误类，提供错误链支持 */
export class OmnError extends Error {
  /** 原始错误 */
  readonly cause?: Error

  constructor(lib: string, message: string, options?: OmnErrorOptions) {
    super(`omn: ${lib}: ${message}`)

    this.name = OmnError.name
    this.cause = options?.cause

    Object.setPrototypeOf(this, new.target.prototype)
  }

  /** 判断是否是 OmnError 实例 */
  static isOmnError(error: unknown): error is OmnError {
    return error instanceof OmnError
  }
}
