import { describe, expect, test } from 'vitest'

import { formatPhoneNumber } from '../../../src'

describe(`formatPhoneNumber`, () => {
  test(`通常用法`, () => {
    expect(formatPhoneNumber('13111111111', 'xxx xxxx xxxx')).toBe('131 1111 1111')
    expect(formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx')).toBe('131-1111-1111')
    expect(formatPhoneNumber('13111111111', 'xxx****xxxx')).toBe('131****1111')
    expect(formatPhoneNumber('13111111111', '+86 xxxxxxxxxxx')).toBe('+86 13111111111')
    expect(formatPhoneNumber('13111111111', 'tel: xxxxxxxxxxx')).toBe('tel: 13111111111')

    expect(formatPhoneNumber('1', 'xxx-xxxx-xxxx')).toBe('1--')
    expect(formatPhoneNumber('13', 'xxx-xxxx-xxxx')).toBe('13--')
    expect(formatPhoneNumber('1311', 'xxx-xxxx-xxxx')).toBe('131-1-')
    expect(formatPhoneNumber('1311111', 'xxx-xxxx-xxxx')).toBe('131-1111-')
  })

  test(`替换占位符`, () => {
    expect(formatPhoneNumber('13111111111', '### #### ####', { placeholder: '#' })).toBe('131 1111 1111')
    expect(formatPhoneNumber('13111111111', 'xxx ###########', { placeholder: '#' })).toBe('xxx 13111111111')
  })

  test(`补全字符`, () => {
    // 默认不补全（空字符串）
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx')).toBe('131 1111 11')

    // 用单字符补全
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx', { paddingWith: '-' })).toBe('131 1111 11--')
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx', { paddingWith: ' ' })).toBe('131 1111 11  ')
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx', { paddingWith: '0' })).toBe('131 1111 1100')

    // 用多字符补全，每个占位符都替换为完整的 paddingWith 字符串
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx', { paddingWith: '**' })).toBe('131 1111 11****')

    // 显式传入空字符串，与默认行为一致
    expect(formatPhoneNumber('131111111', 'xxx xxxx xxxx', { paddingWith: '' })).toBe('131 1111 11')

    // 输入位数恰好填满所有占位符，paddingWith 不生效
    expect(formatPhoneNumber('13111111111', 'xxx xxxx xxxx', { paddingWith: '-' })).toBe('131 1111 1111')

    // 输入位数超出占位符数量，多余数字被忽略，paddingWith 不生效
    expect(formatPhoneNumber('131111111111111', 'xxx xxxx xxxx', { paddingWith: '-' })).toBe('131 1111 1111')

    // 输入位数极短，格式中含有分隔符时，分隔符原样保留，剩余占位符被补全
    expect(formatPhoneNumber('131', 'xxx-xxxx-xxxx')).toBe('131--')
    expect(formatPhoneNumber('131', 'xxx-xxxx-xxxx', { paddingWith: '0' })).toBe('131-0000-0000')
    expect(formatPhoneNumber('1', 'xxx-xxxx-xxxx', { paddingWith: '0' })).toBe('100-0000-0000')
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber(undefined, 'xxx-xxxx-xxxx')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber(null, 'xxx-xxxx-xxxx')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber([], 'xxx-xxxx-xxxx')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber({}, 'xxx-xxxx-xxxx')).toThrow()
    expect(() => formatPhoneNumber('', 'xxx-xxxx-xxxx')).toThrow()
    expect(() => formatPhoneNumber('  ', 'xxx-xxxx-xxxx')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', {})).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', [])).toThrow()
    expect(() => formatPhoneNumber('13111111111', '')).toThrow()
    expect(() => formatPhoneNumber('13111111111', ' ')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { placeholder: null })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { placeholder: [] })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { placeholder: {} })).toThrow()
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { placeholder: '' })).toThrow()
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { placeholder: '  ' })).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { paddingWith: null })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { paddingWith: [] })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => formatPhoneNumber('13111111111', 'xxx-xxxx-xxxx', { paddingWith: {} })).toThrow()
  })
})
