import { beforeEach, describe, expect, test, vi } from 'vitest'

import { monthly } from '../../../src'

describe(`monthly`, () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  test(`基础用法`, () => {
    const callback = vi.fn(() => {})
    const now = new Date('2024-01-15 10:00:00')
    vi.setSystemTime(now)

    const result1 = monthly('test-id', callback)
    expect(result1).toBe(true)
    expect(callback).toHaveBeenCalledTimes(1)

    const result2 = monthly('test-id', callback)
    expect(result2).toBe(false)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`跨月触发 - 默认 1 号重置`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-31 23:59:00'))

    monthly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    monthly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 跨月到 2 月 1 号
    vi.setSystemTime(new Date('2024-02-01 00:00:01'))
    monthly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义 resetDate - 正数`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-10 10:00:00'))

    // 设置 15 号重置
    monthly('test-id', callback, { resetDate: 15 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 14 号不会触发
    vi.setSystemTime(new Date('2024-01-14 23:59:59'))
    monthly('test-id', callback, { resetDate: 15 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 15 号触发
    vi.setSystemTime(new Date('2024-01-15 00:00:01'))
    monthly('test-id', callback, { resetDate: 15 })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义 resetDate - 负数（从月末倒数）`, () => {
    const callback = vi.fn(() => {})
    // 2024-01 有 31 天，-1 表示 31 号
    vi.setSystemTime(new Date('2024-01-30 10:00:00'))

    monthly('test-id', callback, { resetDate: -1 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 30 号不会触发
    vi.setSystemTime(new Date('2024-01-30 23:59:59'))
    monthly('test-id', callback, { resetDate: -1 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 31 号触发
    vi.setSystemTime(new Date('2024-01-31 00:00:01'))
    monthly('test-id', callback, { resetDate: -1 })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`resetDate 超出当月天数 - 默认行为（日期溢出）`, () => {
    const callback = vi.fn(() => {})
    // 2024-02 是闰年，有 29 天
    vi.setSystemTime(new Date('2024-02-28 10:00:00'))

    // 设置 31 号重置，但 2 月只有 29 天
    // date-fns 的 set 会让日期溢出到 3 月 2 日
    monthly('test-id', callback, { resetDate: 31 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 2 月 29 号不会触发（因为重置时间是 3 月 2 日）
    vi.setSystemTime(new Date('2024-02-29 23:59:59'))
    monthly('test-id', callback, { resetDate: 31 })
    expect(callback).toHaveBeenCalledTimes(1)

    // 3 月 2 日触发
    vi.setSystemTime(new Date('2024-03-02 00:00:01'))
    monthly('test-id', callback, { resetDate: 31 })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`allowOutOfMonth 选项`, () => {
    const callback = vi.fn(() => {})
    // 2024-01 有 31 天
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    // 设置 31 号重置，开启 allowOutOfMonth
    monthly('test-id', callback, { resetDate: 31, allowOutOfMonth: true })
    expect(callback).toHaveBeenCalledTimes(1)

    // 1 月 30 号不会触发
    vi.setSystemTime(new Date('2024-01-30 23:59:59'))
    monthly('test-id', callback, { resetDate: 31, allowOutOfMonth: true })
    expect(callback).toHaveBeenCalledTimes(1)

    // 1 月 31 号触发
    vi.setSystemTime(new Date('2024-01-31 00:00:01'))
    monthly('test-id', callback, { resetDate: 31, allowOutOfMonth: true })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`自定义重置时间`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-01 08:00:00'))

    // 设置在 12:00:00 重置
    monthly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 同一天 12:00 之前不会再次触发
    vi.setSystemTime(new Date('2024-01-01 11:59:59'))
    monthly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(1)

    // 下月 1 号 12:00 之后触发
    vi.setSystemTime(new Date('2024-02-01 12:00:01'))
    monthly('test-id', callback, { resetTime: '12:00:00' })
    expect(callback).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  test(`不同 ID 独立运行`, () => {
    const callback1 = vi.fn(() => {})
    const callback2 = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    monthly('id-1', callback1)
    monthly('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    monthly('id-1', callback1)
    monthly('id-2', callback2)

    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`localStorage 持久化`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    monthly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // 验证 localStorage 中存储了数据
    const key = 'omn__monthly:test-id'
    const stored = localStorage.getItem(key)
    expect(stored).not.toBeNull()

    // 再次调用不会触发
    monthly('test-id', callback)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 ID`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => monthly(null, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly(undefined, callback)).toThrow()
    expect(() => monthly('', callback)).toThrow()
    expect(() => monthly('   ', callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly(123, callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly({}, callback)).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效回调函数`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', undefined)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', 'not a function')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', 123)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', {})).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 resetTime`, () => {
    const callback = vi.fn(() => {})

    expect(() => monthly('test-id', callback, { resetTime: 'invalid' })).toThrow()
    expect(() => monthly('test-id', callback, { resetTime: '25:00:00' })).toThrow()
    expect(() => monthly('test-id', callback, { resetTime: '12:60:00' })).toThrow()
    expect(() => monthly('test-id', callback, { resetTime: '12:00:60' })).toThrow()
    expect(() => monthly('test-id', callback, { resetTime: '12:00' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', callback, { resetTime: 123 })).toThrow()

    vi.useRealTimers()
  })

  test(`错误输入 - 无效 resetDate`, () => {
    const callback = vi.fn(() => {})

    // 注意：resetDate: 0 会被 || 1 处理成 1，不会抛出错误
    expect(() => monthly('test-id', callback, { resetDate: 32 })).toThrow()
    expect(() => monthly('test-id', callback, { resetDate: -29 })).toThrow()
    expect(() => monthly('test-id', callback, { resetDate: 1.5 })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => monthly('test-id', callback, { resetDate: 'first' })).toThrow()

    vi.useRealTimers()
  })

  test(`返回值正确`, () => {
    const callback = vi.fn(() => {})
    vi.setSystemTime(new Date('2024-01-15 10:00:00'))

    const result1 = monthly('test-id', callback)
    expect(result1).toBe(true)

    const result2 = monthly('test-id', callback)
    expect(result2).toBe(false)

    // 跨月到 2 月 1 号
    vi.setSystemTime(new Date('2024-02-01 00:00:01'))
    const result3 = monthly('test-id', callback)
    expect(result3).toBe(true)

    vi.useRealTimers()
  })
})
