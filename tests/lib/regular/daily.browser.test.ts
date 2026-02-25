import { beforeEach, describe, expect, test, vi } from 'vitest'

import { daily } from '../../../src'

describe(`daily`, () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  test(`基础用法`, () => {
    const callback = vi.fn(() => {})
    const now = new Date('2024-01-15 10:00:00')
    vi.setSystemTime(now)

    const result1 = daily('test-id', callback)
    expect(result1).toBe(true)
    expect(callback).toHaveBeenCalledTimes(1)

    const result2 = daily('test-id', callback)
    expect(result2).toBe(false)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`跨天触发`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 23:59:00'))

    daily('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    daily('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 跨天到第二天
    vi.setSystemTime(new Date('2024-01-16 00:00:01'))
    daily('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义重置时间`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 08:00:00'))

    // 设置在 12:00:00 重置
    daily('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 同一天 12:00 之前不会再次触发
    vi.setSystemTime(new Date('2024-01-15 11:59:59'))
    daily('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 12:00 之后触发
    vi.setSystemTime(new Date('2024-01-15 12:00:01'))
    daily('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`不同 ID 独立运行`, () => {
    const callback1 = vi.fn(() => {})
    const callback2 = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    daily('id-1', callback1)
    daily('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    daily('id-1', callback1)
    daily('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`localStorage 持久化`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    daily('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 验证 localStorage 中存储了数据
    const key = 'omn__daily:test-id'
    const stored = localStorage.getItem(key)
    expect(stored).not.toBeNull()

    // 再次调用不会触发
    daily('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 ID`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => daily(null, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily(undefined, callback)).toThrow()
    expect(() => daily('', callback)).toThrow()
    expect(() => daily('   ', callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily(123, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily({}, callback)).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效回调函数`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', undefined)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', 'not a function')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', 123)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', {})).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 resetTime`, () => {
    const callback = vi.fn(() => {})

    expect(() => daily('test-id', callback, { resetTime: 'invalid' })).toThrow()
    expect(() => daily('test-id', callback, { resetTime: '25:00:00' })).toThrow()
    expect(() => daily('test-id', callback, { resetTime: '12:60:00' })).toThrow()
    expect(() => daily('test-id', callback, { resetTime: '12:00:60' })).toThrow()
    expect(() => daily('test-id', callback, { resetTime: '12:00' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => daily('test-id', callback, { resetTime: 123 })).toThrow()

    vi.useRealTimers()
  })

  test(`返回值正确`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    const result1 = daily('test-id', callback)
    expect(result1).toBe(true)

    const result2 = daily('test-id', callback)
    expect(result2).toBe(false)

    vi.setSystemTime(new Date('2024-01-16 00:00:01'))
    const result3 = daily('test-id', callback)
    expect(result3).toBe(true)

    vi.useRealTimers()
  })
})
