import { mapValues, pickBy } from 'lodash-es'

import { OmnError } from '../misc/OmnError'

export interface NoNullOptions {
  /** 跳过处理某些字段 */
  ignoreFields?: string[]

  /** 递归处理所有深层次字段，默认 `false` */
  deep?: boolean
}

/**
 * 返回一个新对象，相比于原对象输入而言去除了值为 `null` 的浅层字段
 *
 * 如果对象存在 `null` 字段，解构时赋默认值的操作对于 `null` 字段而言无效，这会导致后续代码中出现 NPE；使用此方法处理对象后，会移除所有 `null` 字段，避免上述情况的发生。
 *
 * 注意：对数组和数组元素不起作用，即使开启了 `deep` 也一样。
 *
 * @param input 对象输入
 * @param options 可选的配置参数
 * @returns 基于输入对象已剔除 `null` 字符的新对象
 * @example
 * // 未使用 `noNull` 时
 * // 解构赋默认值时，如果 `mode` 字段为 `null`，此时赋默认值 "default" 会失败，后续将导致 NPE
 * const { mode = "default" } = setting
 * console.log(mode) // → null
 *
 * // 使用 `noNull` 进行处理
 * // 此时即使 `mode` 字段被误设置为 `null` 也能正确赋默认值，避免 NPE
 * const { mode = "default" } = noNull(setting)
 * console.log(mode) // → "default"
 */
export function noNull<T extends object>(input: T, options?: NoNullOptions): T {
  const deep = options?.deep || false
  const { ignoreFields = [] } = options || {}

  if (typeof input !== 'object' || !input) {
    throw new OmnError(noNull.name, '输入参数仅支持对象类型。')
  } else if (
    Array.isArray(ignoreFields) ? ignoreFields.some(item => typeof item !== 'string') : ignoreFields !== undefined
  ) {
    throw new OmnError(noNull.name, '参数 "ignoreFields" 仅支持字符串数组。')
  }

  const pickByPredicate = (value: any, key: string) => ignoreFields.includes(key) || value !== null

  if (!deep) {
    return pickBy(input, pickByPredicate) as T
  }

  function recursionNoNull(objectInput: any): any {
    return mapValues(pickBy(objectInput, pickByPredicate), value =>
      typeof value === 'object' && value && !Array.isArray(value) ? recursionNoNull(value) : value
    )
  }

  return recursionNoNull(input) as T
}
