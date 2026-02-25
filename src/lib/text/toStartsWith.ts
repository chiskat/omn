import { OmnError } from '../../misc/OmnError'

/**
 * 确保字符串以指定前缀开头；如果已经以该前缀开头则直接返回，否则添加前缀
 *
 * @param input 字符串输入
 * @param prefix 期望的前缀
 * @returns 以指定前缀开头的字符串
 * @example
 * toStartsWith("hello", "/")   // → "/hello"
 * toStartsWith("/hello", "/")  // → "/hello"
 */
export function toStartsWith(input: string, prefix: string): string {
  if (typeof input !== 'string') {
    throw new OmnError(toStartsWith.name, '参数 "input" 仅支持字符串。')
  } else if (typeof prefix !== 'string') {
    throw new OmnError(toStartsWith.name, '参数 "prefix" 仅支持字符串。')
  }

  if (input.startsWith(prefix)) {
    return input
  }

  return prefix + input
}
