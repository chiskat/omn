import { OmnError } from '../../misc/OmnError'

export interface LengthOfEnOptions {
  /** 开启此配置项后，全角标点符号将不会被当做 2 个字符长度，默认 `false` */
  excludePunctuation?: boolean
}

/**
 * 返回给定字符串的英文字符长度，即将中日韩文字（CJK）当做 2 个字符长度，默认也包括全角标点符号
 *
 * @param input 字符串输入
 * @param options 可选的配置项
 * @returns 字符串按英文字符串计算的长度
 * @example
 * "你好".length      // → 2
 * lengthOfEn("你好") // → 4
 */
export function lengthOfEn(input: string, options?: LengthOfEnOptions): number {
  const excludePunctuation = options?.excludePunctuation || false

  if (typeof input !== 'string') {
    throw new OmnError(lengthOfEn.name, '参数输入不合法，仅支持字符串。')
  }

  let length = 0
  for (const char of [...input]) {
    const code = char.codePointAt(0)!
    // 以下判断条件由 AI 多次组合生成
    if (
      // 汉字范围
      (code >= 0x4e00 && code <= 0x9fff) || // 基本汉字
      (code >= 0x3400 && code <= 0x4dbf) || // CJK 扩展 A 区
      (code >= 0x20000 && code <= 0x2a6df) || // CJK 扩展 B 区
      (code >= 0x2a700 && code <= 0x2b73f) || // CJK 扩展 C 区
      (code >= 0x2b740 && code <= 0x2b81f) || // CJK 扩展 D 区
      (code >= 0x2b820 && code <= 0x2ceaf) || // CJK 扩展 E 区
      (code >= 0x2ceb0 && code <= 0x2ebef) || // CJK 扩展 F 区
      (code >= 0xf900 && code <= 0xfaff) || // CJK 兼容表意文字
      (code >= 0x2f800 && code <= 0x2fa1f) || // CJK 兼容表意文字补充
      // 韩文范围
      (code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
      (code >= 0x3130 && code <= 0x318f) || // Hangul Compatibility Jamo
      (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
      (code >= 0xa960 && code <= 0xa97f) || // Hangul Jamo Extended-A
      (code >= 0xd7b0 && code <= 0xd7ff) || // Hangul Jamo Extended-B
      // 日文范围
      (code >= 0x3040 && code <= 0x309f) || // 平假名
      (code >= 0x30a0 && code <= 0x30ff) || // 片假名
      (code >= 0x31f0 && code <= 0x31ff) ||
      // 全角标点符号
      (excludePunctuation
        ? false
        : (code >= 0xff01 && code <= 0xff5e) || // ASCII 字符全角版本
          (code >= 0xffe0 && code <= 0xffee) || // 全角符号
          (code >= 0x3000 && code <= 0x303f) || // 中日韩符号和标点
          code === 0x3000) // 全角空格
    ) {
      length += 2
    } else {
      length += 1
    }
  }

  return length
}
