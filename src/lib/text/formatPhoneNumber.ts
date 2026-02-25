import { escapeRegExp } from 'lodash-es'

import { OmnError } from '../../misc/OmnError'

export interface FormatPhoneNumberOptions {
  /** `"format"` 参数中表示电话号码数字的占位符，默认为 `"x"` */
  placeholder?: string

  /** 如果不能占满所有占位符，用此值来取代剩余占位符，默认为空字符串 `""` */
  paddingWith?: string
}

/**
 * 按给出的模式格式化电话号码，格式化时使用 `"x"` 表示一位电话号码数字
 *
 * 注意：不支持带有区号、国家代号，请先去除这些。
 *
 * @param input 电话号码输入
 * @param format 模式字符串，其中 `"x"` 表示一位电话号码数字，其他字符原样输出
 * @param options 可选的配置参数
 * @returns 格式化完成的电话号码
 * @example
 * formatPhoneNumber("13712341234", "xxx-xxxx-xxxx")
 * // → "137-1234-1234"
 *
 * formatPhoneNumber("13712341234", "xxxx xxx xxxx")
 * // → "1371 234 1234"
 *
 * formatPhoneNumber("13712341234", "xxx****xxxx")
 * // → "137****1234"
 */
export function formatPhoneNumber(input: string, format: string, options?: FormatPhoneNumberOptions): string {
  const { placeholder = 'x', paddingWith = '' } = options || {}

  if (typeof input !== 'string' || input.trim() === '') {
    throw new OmnError(formatPhoneNumber.name, '输入参数不合法，仅支持非空字符串。')
  } else if (!/^\d+$/.test(input)) {
    throw new OmnError(formatPhoneNumber.name, '输入参数不合法，电话号码需为纯数字组成。')
  } else if (typeof format !== 'string' || format.trim() === '') {
    throw new OmnError(formatPhoneNumber.name, '模式参数不合法，仅支持非空字符串。')
  } else if (typeof placeholder !== 'string' || placeholder.trim() === '') {
    throw new OmnError(formatPhoneNumber.name, '参数 "placeholder" 不合法，仅支持非空字符串。')
  } else if (typeof paddingWith !== 'string') {
    throw new OmnError(formatPhoneNumber.name, '参数 "paddingWith" 不合法，仅支持字符串。')
  }

  let result = format
  for (const char of input) {
    result = result.replace(placeholder, char)
  }
  result = result.replace(new RegExp(escapeRegExp(placeholder), 'g'), paddingWith)

  return result
}
