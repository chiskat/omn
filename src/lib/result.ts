/**
 * 通常用于解析参数输入，接受值或者返回值的函数，始终返回最终的值
 *
 * @param input 输入值或一个返回值的函数
 * @returns 始终返回需要的值
 * @example
 * // 处理参数输入，支持值输入或者函数输入
 * // 曾经
 * const input = typeof options.input === "function"
 *   ? options.input()
 *   : options.input
 *
 * // 现在，使用此函数
 * const input = result(options.input)
 */
export function result<T>(input: T | (() => T)): T {
  if (typeof input === 'function') {
    return (input as () => T)()
  }

  return input
}
