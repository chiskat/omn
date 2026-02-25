import { describe, expect, test, vi } from 'vitest'

import { sleep } from '../../src'

describe(`sleep`, () => {
  test(`功能测试`, async () => {
    const callback = vi.fn(() => {})
    vi.useFakeTimers()

    sleep(1000).then(callback)

    await vi.advanceTimersByTimeAsync(999)
    expect(callback).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(callback).toHaveBeenCalled()

    vi.useRealTimers()
  })

  test(`边缘输入`, async () => {
    const callback = vi.fn(() => {})
    vi.useFakeTimers()

    sleep(0).then(callback)
    expect(callback).not.toHaveBeenCalled()
    await vi.runAllTimersAsync()
    expect(callback).toHaveBeenCalled()

    vi.useRealTimers()
  })

  test(`错误输入`, async () => {
    await expect(() => sleep(-1)).rejects.toThrow()
    await expect(() => sleep(-100)).rejects.toThrow()
    await expect(() => sleep(NaN)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => sleep(null)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => sleep(undefined)).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => sleep('100')).rejects.toThrow()
    // @ts-expect-error 测试错误传参
    await expect(() => sleep({})).rejects.toThrow()
  })
})
