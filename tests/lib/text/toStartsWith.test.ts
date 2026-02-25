import { describe, expect, test } from 'vitest'

import { toStartsWith } from '../../../src'

describe(`toStartsWith`, () => {
  test(`通常用法`, () => {
    expect(toStartsWith('hello', '/')).toBe('/hello')
    expect(toStartsWith('/hello', '/')).toBe('/hello')
    expect(toStartsWith('world', 'Hello ')).toBe('Hello world')
    expect(toStartsWith('Hello world', 'Hello ')).toBe('Hello world')
    expect(toStartsWith('', '/')).toBe('/')
    expect(toStartsWith('/', '/')).toBe('/')
    expect(toStartsWith('test', '')).toBe('test')
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => toStartsWith(null, '/')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toStartsWith(123, '/')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toStartsWith('hello', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toStartsWith('hello', 123)).toThrow()
  })
})
