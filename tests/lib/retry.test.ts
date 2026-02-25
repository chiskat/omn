import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { retry } from '../../src'

describe(`retry`, () => {
  beforeEach(() => void vi.useFakeTimers())
  afterEach(() => void vi.useRealTimers())

  test(`基础用法`, async () => {
    const callback = vi.fn(() => Promise.resolve('success'))
    const result = await retry(callback)

    expect(result.success).toBe(true)
    expect(result.data).toBe('success')
    expect(result.rounds).toBe(1)
    expect(result.history).toEqual(['success'])
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test(`重试`, async () => {
    let callTimes = 0
    const callback = vi.fn(() => {
      callTimes++
      return callTimes < 3 ? Promise.resolve(false) : Promise.resolve(true)
    })

    const promise = retry(callback, { interval: 100 })

    await vi.advanceTimersByTimeAsync(0)
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(50)
    expect(callback).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(100)
    const result = await promise

    expect(result.success).toBe(true)
    expect(result.data).toBe(true)
    expect(result.rounds).toBe(3)
    expect(result.history).toEqual([false, false, true])
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test(`错误处理`, async () => {
    const error = new Error('Error')
    const callback = vi.fn(() => {
      throw error
    })

    const result = await retry(callback)

    expect(result.success).toBe(false)
    expect(result.error).toBe(error)
    expect(result.reason).toBe('error')
    expect(result.rounds).toBe(1)
    expect(result.history).toEqual([error])
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test(`设置执行间隔`, async () => {
    const callback = vi.fn(() => Promise.resolve(false))
    const promise = retry(callback, { interval: 200, maxRounds: 3 })

    await vi.advanceTimersByTimeAsync(0)
    expect(callback).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(200)
    expect(callback).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(200)
    const result = await promise

    expect(result.rounds).toBe(3)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test(`超时时间`, async () => {
    const callback = vi.fn(() => Promise.resolve('done'))
    const promise = retry(callback, { success: () => false, timeout: 500, interval: 100 })

    await vi.advanceTimersByTimeAsync(500)
    const result = await promise

    expect(result.success).toBe(false)
    expect(result.reason).toBe('timeout')
    expect(result.rounds).toBeGreaterThan(0)
    expect(result.history).toEqual(['done', 'done', 'done', 'done', 'done', 'done'])
  })

  test(`最大轮次成功`, async () => {
    let callTimes = 0
    const callback = vi.fn(() => {
      callTimes++
      return Promise.resolve(callTimes >= 2)
    })
    const promise = retry(callback, { maxRounds: 5, interval: 100 })

    await vi.advanceTimersByTimeAsync(200)
    const result = await promise

    expect(result.success).toBe(true)
    expect(result.rounds).toBe(2)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test(`最大轮次失败`, async () => {
    const callback = vi.fn(() => Promise.resolve(false))
    const promise = retry(callback, { maxRounds: 3, interval: 100 })

    await vi.advanceTimersByTimeAsync(300)
    const result = await promise

    expect(result.success).toBe(false)
    expect(result.reason).toBe('maxRounds')
    expect(result.rounds).toBe(3)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test(`自定义结果判断`, async () => {
    const callback = vi.fn(() => false)
    const result = await retry(callback, { success: () => true })

    expect(result.success).toBe(true)
    expect(result.data).toBe(false)
  })

  test(`最大错误容许成功`, async () => {
    let callTimes = 0
    const error = new Error('Error')
    const callback = vi.fn(() => {
      callTimes++
      if (callTimes <= 2) {
        throw error
      }
      return Promise.resolve(true)
    })
    const promise = retry(callback, { maxErrors: 2, interval: 100 })

    await vi.advanceTimersByTimeAsync(300)
    const result = await promise

    expect(result).not.toHaveProperty('error')
    expect(result.success).toBe(true)
    expect(result.rounds).toBe(3)
    expect(result.history).toEqual([error, error, true])
  })

  test(`最大错误容许失败`, async () => {
    const error = new Error('Error')
    const callback = vi.fn(() => {
      throw error
    })
    const promise = retry(callback, { maxErrors: 2, interval: 100 })

    await vi.advanceTimersByTimeAsync(300)
    const result = await promise

    expect(result.success).toBe(false)
    expect(result.reason).toBe('maxErrors')
    expect(result.error).toBe(error)
    expect(result.rounds).toBe(3)
  })

  test(`不限错误次数`, async () => {
    let callTimes = 0
    const error = new Error('Error')
    const callback = vi.fn(() => {
      ++callTimes
      if (callTimes < 5) {
        throw error
      }
      return Promise.resolve(true)
    })
    const promise = retry(callback, { maxErrors: -1, interval: 100 })

    await vi.advanceTimersByTimeAsync(1000)
    const result = await promise

    expect(result.success).toBe(true)
    expect(result.rounds).toBe(5)
    expect(result.history).toEqual([error, error, error, error, true])
  })

  test(`错误输入`, async () => {
    const callback = () => Promise.resolve(true)

    // @ts-expect-error 测试错误传参
    await expect(() => retry(null)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(undefined)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry('')).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(123)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry({})).rejects.toThrow()

    await expect(() => retry(callback, { interval: -1 })).rejects.toThrow()
    await expect(() => retry(callback, { interval: NaN })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { interval: null })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { interval: '100' })).rejects.toThrow()

    await expect(() => retry(callback, { timeout: -1 })).rejects.toThrow()
    await expect(() => retry(callback, { timeout: NaN })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { timeout: null })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { timeout: '100' })).rejects.toThrow()

    await expect(() => retry(callback, { maxRounds: -1 })).rejects.toThrow()
    await expect(() => retry(callback, { maxRounds: 1.5 })).rejects.toThrow()
    await expect(() => retry(callback, { maxRounds: NaN })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { maxRounds: null })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { maxRounds: '5' })).rejects.toThrow()

    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { success: null })).rejects.toThrow()
    await expect(() => retry(callback, { success: undefined })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { success: ' ' })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { success: 111 })).rejects.toThrow()

    await expect(() => retry(callback, { maxErrors: -2 })).rejects.toThrow()
    await expect(() => retry(callback, { maxErrors: 1.5 })).rejects.toThrow()
    await expect(() => retry(callback, { maxErrors: NaN })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { maxErrors: null })).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => retry(callback, { maxErrors: '5' })).rejects.toThrow()
  })
})
