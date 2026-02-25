import { describe, expect, test } from 'vitest'

import { asList } from '../../src'

describe(`asList`, () => {
  test(`基础值输入`, () => {
    const fn = () => {}
    const obj = {}

    expect(asList(1)).toEqual([1])
    expect(asList([1])).toEqual([1])
    expect(asList([1, 2, 3])).toEqual([1, 2, 3])
    expect(asList('1')).toEqual(['1'])
    expect(asList(['1'])).toEqual(['1'])
    // 此处不能测试 asList(fn)，因为这是 “函数值输入” 的用法
    expect(asList([fn])).toEqual([fn])
    expect(asList(obj)).toEqual([obj])
    expect(asList([obj])).toEqual([obj])
  })

  test(`特殊值输入`, () => {
    expect(asList(undefined)).toEqual([])
    expect(asList(null)).toEqual([null])
    expect(asList(NaN)).toEqual([NaN])
    expect(asList(true)).toEqual([true])
  })

  test(`类数组输入`, () => {
    expect(asList({ length: 0 })).toEqual([])
    expect(asList({ length: 1, 0: 1 })).toEqual([1])
  })

  test(`函数值输入`, () => {
    expect(asList(() => undefined)).toEqual([])
    expect(asList(() => [])).toEqual([])
    expect(asList(() => 1)).toEqual([1])
    expect(asList(() => [1])).toEqual([1])
    expect(asList(() => ({ length: 0 }))).toEqual([])
    expect(asList(() => ({ length: 1, 0: 1 }))).toEqual([1])
    expect(asList(() => ({ length: 1 }))).toEqual([undefined])
  })

  test(`错误调用`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => asList(1, 2, 3)).toThrow()
  })
})
