import { isArrayLike } from 'lodash-es'

import { OmnError } from '../misc/OmnError'
import { result } from './result'

/**
 * 处理数组类型参数，始终返回数组，自动包装单元素的输入，自动执行函数输入
 * - 输入函数会先执行，用执行结果当做参数输入；
 * - 输入 `undefined` 时返回空数组 `[]`；
 * - 输入数组则直接返回，否则包装为单元素的数组返回；
 * - 自动处理 “Array-like 类数组” 格式，转为常规数组并返回。
 *
 * @param input 输入的参数
 * @returns 始终返回数组
 * @example
 * asList(1)         // → [1]
 * asList([1])       // → [1]
 * asList()          // → []
 * asList("hi")      // → ['hi']
 * asList(null)      // → [null]
 * asList(() => [1]) // → [1]
 * asList({ length: 1, 0: 1 }) // → [1]
 */
export function asList<T>(input: T | T[]): T[]
export function asList<T>(input: ArrayLike<T>): T[]
export function asList<T>(input: (...p: any[]) => T): T[]
export function asList<T>(input: (...p: any[]) => T[]): T[]
export function asList<T>(input: (...p: any[]) => ArrayLike<T>): T[]
export function asList<T>(input: any): T[] {
  input = result(input)

  if (arguments.length > 1) {
    throw new OmnError(asList.name, '仅支持单个参数输入，不支持类似于 "Array.of()" 的调用方式；请阅读文档。')
  } else if (input === undefined) {
    return []
  } else if (Array.isArray(input)) {
    return input
  } else if (typeof input !== 'string' && isArrayLike(input)) {
    return Array.from(input)
  }

  return [input as T]
}
