import { OmnError } from '../../misc/OmnError'

/**
 * 确保字符串以指定后缀结尾；如果已经以该后缀结尾则直接返回，否则添加后缀
 *
 * @param input 字符串输入
 * @param suffix 期望的后缀
 * @returns 以指定后缀结尾的字符串
 * @example
 * toEndsWith("src", "/")   // → "src/"
 * toEndsWith("src/", "/")  // → "src/"
 */
export function toEndsWith(input: string, suffix: string): string {
  if (typeof input !== 'string') {
    throw new OmnError(toEndsWith.name, '参数 "input" 仅支持字符串。')
  } else if (typeof suffix !== 'string') {
    throw new OmnError(toEndsWith.name, '参数 "suffix" 仅支持字符串。')
  }

  if (input.endsWith(suffix)) {
    return input
  }

  return input + suffix
}
