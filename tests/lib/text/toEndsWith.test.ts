import { describe, expect, test } from 'vitest'

import { toEndsWith } from '../../../src'

describe(`toEndsWith`, () => {
  test(`通常用法`, () => {
    expect(toEndsWith('src', '/')).toBe('src/')
    expect(toEndsWith('src/', '/')).toBe('src/')
    expect(toEndsWith('hello', ' world')).toBe('hello world')
    expect(toEndsWith('hello world', ' world')).toBe('hello world')
    expect(toEndsWith('', '/')).toBe('/')
    expect(toEndsWith('/', '/')).toBe('/')
    expect(toEndsWith('test', '')).toBe('test')
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => toEndsWith(null, '/')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toEndsWith(123, '/')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toEndsWith('hello', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => toEndsWith('hello', 123)).toThrow()
  })
})
