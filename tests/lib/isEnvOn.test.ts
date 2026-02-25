import { describe, expect, test } from 'vitest'

import { isEnvOn } from '../../src'

describe(`isEnvOn`, () => {
  test(`普通模式`, () => {
    expect(isEnvOn(1)).toBe(true)
    expect(isEnvOn('1')).toBe(true)
    expect(isEnvOn(true)).toBe(true)
    expect(isEnvOn('true')).toBe(true)
    expect(isEnvOn('True')).toBe(true)
    expect(isEnvOn('TRUE')).toBe(true)
    expect(isEnvOn('on')).toBe(true)
    expect(isEnvOn('On')).toBe(true)
    expect(isEnvOn('ON')).toBe(true)

    expect(isEnvOn(null)).toBe(false)
    expect(isEnvOn('null')).toBe(false)
    expect(isEnvOn(undefined)).toBe(false)
    expect(isEnvOn('undefined')).toBe(false)
    expect(isEnvOn(0)).toBe(false)
    expect(isEnvOn('0')).toBe(false)
    expect(isEnvOn('off')).toBe(false)
    expect(isEnvOn('Off')).toBe(false)
    expect(isEnvOn('OFF')).toBe(false)
    expect(isEnvOn('false')).toBe(false)
    expect(isEnvOn('False')).toBe(false)
    expect(isEnvOn('FALSE')).toBe(false)

    expect(isEnvOn('hello')).toBe(false)
    expect(isEnvOn(100)).toBe(false)
    expect(isEnvOn(NaN)).toBe(false)
  })

  test(`严格模式`, () => {
    expect(isEnvOn(1, { strict: true })).toBe(true)
    expect(isEnvOn('1', { strict: true })).toBe(true)
    expect(isEnvOn(true, { strict: true })).toBe(true)
    expect(isEnvOn('true', { strict: true })).toBe(true)
    expect(isEnvOn('True', { strict: true })).toBe(true)
    expect(isEnvOn('TRUE', { strict: true })).toBe(true)
    expect(isEnvOn('on', { strict: true })).toBe(true)
    expect(isEnvOn('On', { strict: true })).toBe(true)
    expect(isEnvOn('ON', { strict: true })).toBe(true)

    expect(isEnvOn(null, { strict: true })).toBe(false)
    expect(isEnvOn('null', { strict: true })).toBe(false)
    expect(isEnvOn(undefined, { strict: true })).toBe(false)
    expect(isEnvOn('undefined', { strict: true })).toBe(false)
    expect(isEnvOn(0, { strict: true })).toBe(false)
    expect(isEnvOn('0', { strict: true })).toBe(false)
    expect(isEnvOn('off', { strict: true })).toBe(false)
    expect(isEnvOn('Off', { strict: true })).toBe(false)
    expect(isEnvOn('OFF', { strict: true })).toBe(false)
    expect(isEnvOn('false', { strict: true })).toBe(false)
    expect(isEnvOn('False', { strict: true })).toBe(false)
    expect(isEnvOn('FALSE', { strict: true })).toBe(false)

    expect(() => isEnvOn('hello', { strict: true })).toThrow()
    expect(() => isEnvOn(100, { strict: true })).toThrow()
    expect(() => isEnvOn(NaN, { strict: true })).toThrow()
  })
})
