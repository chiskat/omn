import { beforeEach, describe, expect, test, vi } from 'vitest'

import { weekly } from '../../../src'

describe(`weekly`, () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  test(`基础用法`, () => {
    const callback = vi.fn(() => {})
    // 2024-01-15 是周一
    const now = new Date('2024-01-15 10:00:00')
    expect(now.getDay()).toBe(1)

    vi.setSystemTime(now)

    const result1 = weekly('test-id', callback)
    expect(result1).toBe(true)
    expect(callback).toHaveBeenCalledTimes(1)

    const result2 = weekly('test-id', callback)
    expect(result2).toBe(false)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`跨周触发 - 默认周日重置`, () => {
    const callback = vi.fn(() => {})
    // 2024-01-13 是周六
    vi.setSystemTime(new Date('2024-01-13 23:59:00'))

    weekly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    weekly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 跨周到周日
    vi.setSystemTime(new Date('2024-01-14 00:00:01'))
    weekly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义 resetDayOfWeek`, () => {
    const callback = vi.fn(() => {})
    // 2024-01-15 是周一
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    // 设置周三重置 (resetDayOfWeek: 3)
    weekly('test-id', callback, { resetDayOfWeek: 3 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 周二不会触发
    vi.setSystemTime(new Date('2024-01-16 10:00:00'))
    weekly('test-id', callback, { resetDayOfWeek: 3 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 周三触发
    vi.setSystemTime(new Date('2024-01-17 00:00:01'))
    weekly('test-id', callback, { resetDayOfWeek: 3 })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义重置时间`, () => {
    const callback = vi.fn(() => {})
    // 2024-01-14 是周日
    vi.setSystemTime(new Date('2024-01-14 08:00:00'))

    // 设置在 12:00:00 重置
    weekly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 同一天 12:00 之前不会再次触发
    vi.setSystemTime(new Date('2024-01-14 11:59:59'))
    weekly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 下周日 12:00 之后触发
    vi.setSystemTime(new Date('2024-01-21 12:00:01'))
    weekly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`不同 ID 独立运行`, () => {
    const callback1 = vi.fn(() => {})
    const callback2 = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    weekly('id-1', callback1)
    weekly('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    weekly('id-1', callback1)
    weekly('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`localStorage 持久化`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    weekly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 验证 localStorage 中存储了数据
    const key = 'omn__weekly:test-id'
    const stored = localStorage.getItem(key)
    expect(stored).not.toBeNull()

    // 再次调用不会触发
    weekly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 ID`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => weekly(null, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly(undefined, callback)).toThrow()
    expect(() => weekly('', callback)).toThrow()
    expect(() => weekly('   ', callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly(123, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly({}, callback)).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效回调函数`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', undefined)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', 'not a function')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', 123)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', {})).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 resetTime`, () => {
    const callback = vi.fn(() => {})

    expect(() => weekly('test-id', callback, { resetTime: 'invalid' })).toThrow()
    expect(() => weekly('test-id', callback, { resetTime: '25:00:00' })).toThrow()
    expect(() => weekly('test-id', callback, { resetTime: '12:60:00' })).toThrow()
    expect(() => weekly('test-id', callback, { resetTime: '12:00:60' })).toThrow()
    expect(() => weekly('test-id', callback, { resetTime: '12:00' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', callback, { resetTime: 123 })).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 resetDayOfWeek`, () => {
    const callback = vi.fn(() => {})

    expect(() => weekly('test-id', callback, { resetDayOfWeek: -1 })).toThrow()
    expect(() => weekly('test-id', callback, { resetDayOfWeek: 7 })).toThrow()
    expect(() => weekly('test-id', callback, { resetDayOfWeek: 1.5 })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => weekly('test-id', callback, { resetDayOfWeek: 'monday' })).toThrow()

    vi.useRealTimers()
  })

  test(`返回值正确`, () => {
    const callback = vi.fn(() => {})
    // 2024-01-13 是周六
    vi.setSystemTime(new Date('2024-01-13 10:00:00'))

    const result1 = weekly('test-id', callback)
    expect(result1).toBe(true)

    const result2 = weekly('test-id', callback)
    expect(result2).toBe(false)

    // 跨周到周日
    vi.setSystemTime(new Date('2024-01-14 00:00:01'))
    const result3 = weekly('test-id', callback)
    expect(result3).toBe(true)

    vi.useRealTimers()
  })
})
