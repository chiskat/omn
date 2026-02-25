import { describe, expect, test } from 'vitest'

import { result } from '../../src'

describe(`result`, () => {
  test(`非函数`, () => {
    expect(result(null)).toBe(null)
    expect(result(undefined)).toBe(undefined)
    expect(result(1)).toBe(1)
    expect(result(100000)).toBe(100000)
    expect(result('X')).toBe('X')
    expect(result(globalThis)).toBe(globalThis)
    expect(result(Infinity)).toBe(Infinity)
    expect(result(-Infinity)).toBe(-Infinity)

    const obj = {}
    const arr = []
    expect(result(obj)).toBe(obj)
    expect(result(arr)).toBe(arr)
  })

  test(`函数`, () => {
    expect(result(() => null)).toBe(null)
    expect(result(() => undefined)).toBe(undefined)
    expect(result(() => 888)).toBe(888)
    expect(result(() => '888')).toBe('888')
    expect(result(() => globalThis)).toBe(globalThis)

    const obj = {}
    const arr = []
    const fn = () => {}
    expect(result(() => obj)).toBe(obj)
    expect(result(() => arr)).toBe(arr)
    expect(result(() => fn)).toBe(fn)
  })
})
