import { isPlainObject } from 'lodash-es'

import { OmnError } from '../misc/OmnError'

export interface ShallowOptions {
  /** 保留的对象层级深度，仅支持正整数，根对象为第 1 层，默认为 `1` */
  depth?: number
}

/**
 * 从普通对象中提取指定深度内的属性，返回一个新对象
 *
 * 默认仅保留根对象中值不为对象的属性，`null` 和函数也会保留；增大 `depth` 可多保留若干层嵌套对象。
 * 仅递归处理普通对象；Date、Array、Set、Map 等非普通对象超出深度时被排除，否则整体保留原引用。
 * 仅处理自身可枚举的字符串属性，不会修改输入对象。
 *
 * @template T 输入对象的类型
 * @param input 普通对象输入
 * @param options 可选的配置参数
 * @returns 提取指定深度内属性的新对象，部分属性可能被移除
 * @example
 * const input = { name: 'omn', fields: { value: 100, nested: { enabled: true } }, tags: ['utils'] }
 *
 * shallow(input)
 * // → { name: 'omn' }
 *
 * shallow(input, { depth: 2 })
 * // → { name: 'omn', fields: { value: 100 }, tags: ['utils'] }
 */
export function shallow<T extends object>(input: T, options?: ShallowOptions): Partial<T> {
  if (!isPlainObject(input)) {
    throw new OmnError(shallow.name, '输入参数仅支持普通对象类型。')
  } else if (options !== undefined && !isPlainObject(options)) {
    throw new OmnError(shallow.name, '配置项参数仅支持普通对象输入。')
  }

  const { depth = 1 } = options || {}

  if (!Number.isInteger(depth) || depth < 1) {
    throw new OmnError(shallow.name, '配置项 "depth" 仅支持正整数类型。')
  }

  function recursionShallow(objectInput: object, remainingDepth: number): object {
    return Object.fromEntries(
      Object.entries(objectInput)
        .filter(([, value]) => value === null || typeof value !== 'object' || remainingDepth > 1)
        .map(([key, value]) => [key, isPlainObject(value) ? recursionShallow(value, remainingDepth - 1) : value])
    )
  }

  return recursionShallow(input, depth) as Partial<T>
}
