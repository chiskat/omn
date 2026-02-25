import { describe, expect, test } from 'vitest'

import { noNull } from '../../src'

describe(`noNull`, () => {
  const target = {
    name: null,
    value: 100,
    label: '',
    test: undefined,
    tags: [],
    fields: { desc: null, addition: '', nested: { x: null, xx: undefined } },
  }

  test(`空对象输入`, () => {
    expect(noNull({})).toEqual({})
  })

  test(`常规用法`, () => {
    expect(noNull(target)).toEqual({
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { desc: null, addition: '', nested: { x: null, xx: undefined } },
    })
  })

  test(`深度模式`, () => {
    expect(noNull(target, { deep: true })).not.toEqual({
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { desc: null, addition: '', nested: { xx: undefined } },
    })
    expect(noNull(target, { deep: true })).toEqual({
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { addition: '', nested: { xx: undefined } },
    })
  })

  test(`忽略部分字段`, () => {
    expect(noNull(target, { ignoreFields: ['name'] })).toEqual({
      name: null,
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { desc: null, addition: '', nested: { x: null, xx: undefined } },
    })
    expect(noNull(target, { ignoreFields: ['name'], deep: true })).toEqual({
      name: null,
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { addition: '', nested: { xx: undefined } },
    })
    expect(noNull(target, { ignoreFields: ['name', 'desc'] })).toEqual({
      name: null,
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { desc: null, addition: '', nested: { x: null, xx: undefined } },
    })
    expect(noNull(target, { ignoreFields: ['name', 'desc'], deep: true })).toEqual({
      name: null,
      value: 100,
      label: '',
      test: undefined,
      tags: [],
      fields: { desc: null, addition: '', nested: { xx: undefined } },
    })
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => noNull()).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => noNull(undefined)).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => noNull(' ')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => noNull({}, { ignoreFields: '' })).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => noNull({}, { ignoreFields: [{}] })).toThrow()
  })
})
