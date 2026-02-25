import { describe, expect, test } from 'vitest'

import { OmnError } from '../../src'

describe(`OmnError`, () => {
  test(`基本构造`, () => {
    const error = new OmnError('test', '测试错误')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(OmnError)
    expect(error.name).toBe('OmnError')
    expect(error.message).toBe('omn: test: 测试错误')
  })

  test(`错误链`, () => {
    const cause = new Error('原始错误')
    const error = new OmnError('test', '包装错误', { cause })

    expect(error.cause).toBe(cause)
  })

  test(`无错误链`, () => {
    const error = new OmnError('test', '测试错误')

    expect(error.cause).toBeUndefined()
  })

  test(`完整选项`, () => {
    const cause = new Error('原始错误')
    const error = new OmnError('myLib', '操作失败', { cause })

    expect(error.message).toBe('omn: myLib: 操作失败')
    expect(error.cause).toBe(cause)
  })

  test(`isOmnError 判断 OmnError 实例`, () => {
    const omnError = new OmnError('test', '测试错误')

    expect(OmnError.isOmnError(omnError)).toBe(true)
  })

  test(`isOmnError 判断普通 Error`, () => {
    const error = new Error('普通错误')

    expect(OmnError.isOmnError(error)).toBe(false)
  })

  test(`isOmnError 判断非错误值`, () => {
    expect(OmnError.isOmnError(null)).toBe(false)
    expect(OmnError.isOmnError(undefined)).toBe(false)
    expect(OmnError.isOmnError('error')).toBe(false)
    expect(OmnError.isOmnError(123)).toBe(false)
    expect(OmnError.isOmnError({})).toBe(false)
  })
})
