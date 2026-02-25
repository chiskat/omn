import { describe, expect, test, vi } from 'vitest'

import { regular } from '../../../src'

describe(`regular`, () => {
  test(`常规用法`, () => {
    const callback = vi.fn(() => {})
    let recorder = 0

    const action = () => {
      regular(callback, {
        shouldRun: () => recorder <= 0,
        recordRun: () => {
          recorder = 1
        },
      })
    }

    expect(callback).not.toBeCalled()
    action()
    expect(callback).toBeCalledTimes(1)
    action()
    expect(callback).toBeCalledTimes(1)
    recorder = 0
    action()
    expect(callback).toBeCalledTimes(2)
  })

  test(`返回值`, () => {
    const callback = vi.fn(() => {})
    let shouldRunFlag = true

    const result1 = regular(callback, {
      shouldRun: () => shouldRunFlag,
      recordRun: () => {
        shouldRunFlag = false
      },
    })
    expect(result1).toBe(true)

    const result2 = regular(callback, {
      shouldRun: () => shouldRunFlag,
      recordRun: () => {},
    })
    expect(result2).toBe(false)
  })

  test(`不执行回调`, () => {
    const callback = vi.fn(() => {})
    const recordRun = vi.fn(() => {})

    regular(callback, {
      shouldRun: () => false,
      recordRun,
    })

    expect(callback).not.toBeCalled()
    expect(recordRun).not.toBeCalled()
  })

  test(`执行回调`, () => {
    const callback = vi.fn(() => {})
    const recordRun = vi.fn(() => {})

    regular(callback, { shouldRun: () => true, recordRun })

    expect(callback).toBeCalledTimes(1)
    expect(recordRun).toBeCalledTimes(1)
  })

  test(`shouldRun 返回值会被转换为布尔值`, () => {
    const callback = vi.fn(() => {})
    const recordRun = vi.fn(() => {})

    // truthy 值
    // @ts-expect-error 测试 truthy 值
    regular(callback, { shouldRun: () => 1, recordRun })
    expect(callback).toBeCalledTimes(1)

    // @ts-expect-error 测试 truthy 值
    regular(callback, { shouldRun: () => 'string', recordRun })
    expect(callback).toBeCalledTimes(2)

    // falsy 值
    // @ts-expect-error 测试 falsy 值
    regular(callback, { shouldRun: () => 0, recordRun })
    expect(callback).toBeCalledTimes(2)

    // @ts-expect-error 测试 falsy 值
    regular(callback, { shouldRun: () => '', recordRun })
    expect(callback).toBeCalledTimes(2)

    // @ts-expect-error 测试 falsy 值
    regular(callback, { shouldRun: () => null, recordRun })
    expect(callback).toBeCalledTimes(2)
  })

  test(`错误输入 - 无效回调函数`, () => {
    const validOptions = {
      shouldRun: () => true,
      recordRun: () => {},
    }

    // @ts-expect-error 测试错误传参
    expect(() => regular(null, validOptions)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(undefined, validOptions)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular('not a function', validOptions)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(123, validOptions)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular({}, validOptions)).toThrow()
  })

  test(`错误输入 - 缺少 shouldRun`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: undefined, recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: null, recordRun: () => {} })).toThrow()
  })

  test(`错误输入 - 缺少 recordRun`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: undefined })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: null })).toThrow()
  })

  test(`错误输入 - 缺少 options`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => regular(callback)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, undefined)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, {})).toThrow()
  })

  test(`错误输入 - shouldRun 不是函数`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: 'string', recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: 123, recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: true, recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: {}, recordRun: () => {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: [], recordRun: () => {} })).toThrow()
  })

  test(`错误输入 - recordRun 不是函数`, () => {
    const callback = vi.fn(() => {})

    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: 'string' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: 123 })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: true })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: {} })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => regular(callback, { shouldRun: () => true, recordRun: [] })).toThrow()
  })
})
