import { describe, expect, test } from 'vitest'

import { OmnError, shallow } from '../../src'

describe(`shallow`, () => {
  const target = {
    name: 'omn',
    value: 100,
    fields: { desc: 'utils', nested: { enabled: true, detail: { id: 1 } } },
  }

  test(`空对象输入`, () => {
    expect(shallow({})).toEqual({})
    expect(shallow({}, { depth: 3 })).toEqual({})
  })

  test(`常规用法`, () => {
    const expected = { name: 'omn', value: 100 }

    expect(shallow(target)).toEqual(expected)
    expect(shallow(target, {})).toEqual(expected)
    expect(shallow(target, { depth: undefined })).toEqual(expected)
    expect(shallow(target, { depth: 1 })).toEqual(expected)
  })

  test(`保留不同深度的嵌套对象`, () => {
    expect(shallow(target, { depth: 2 })).toEqual({
      name: 'omn',
      value: 100,
      fields: { desc: 'utils' },
    })
    expect(shallow(target, { depth: 3 })).toEqual({
      name: 'omn',
      value: 100,
      fields: { desc: 'utils', nested: { enabled: true } },
    })
    expect(shallow(target, { depth: 4 })).toEqual(target)
    expect(shallow(target, { depth: 10 })).toEqual(target)
  })

  test(`保留非对象值`, () => {
    const input = {
      text: '',
      number: 0,
      boolean: false,
      nil: null,
      missing: undefined,
      nan: NaN,
      bigint: BigInt(1),
      symbol: Symbol('omn'),
      func: () => 'omn',
    }

    expect(shallow(input)).toEqual(input)
    expect(shallow({ fields: input }, { depth: 2 })).toEqual({ fields: input })
  })

  test(`保留深度范围内的空对象`, () => {
    const input = { empty: {}, fields: { nested: {} } }

    expect(shallow(input)).toEqual({})
    expect(shallow(input, { depth: 2 })).toEqual({ empty: {}, fields: {} })
    expect(shallow(input, { depth: 3 })).toEqual(input)
  })

  test(`非普通对象整体保留或排除，不递归处理`, () => {
    class Item {
      fields = { nested: { value: 1 } }
    }

    const input = {
      date: new Date('2026-01-01'),
      array: [{ fields: { value: 1 } }],
      set: new Set([{ fields: { value: 1 } }]),
      map: new Map([['fields', { nested: { value: 1 } }]]),
      regexp: /omn/g,
      instance: new Item(),
      typedArray: new Uint8Array([1, 2]),
    }

    expect(shallow(input)).toEqual({})
    expect(shallow({ fields: input }, { depth: 2 })).toEqual({ fields: {} })

    for (const depth of [2, 3, 10]) {
      const output = shallow(input, { depth })
      const nestedOutput = shallow({ fields: input }, { depth: depth + 1 })

      expect(output).toEqual(input)
      expect(nestedOutput).toEqual({ fields: input })
      for (const key of Object.keys(input) as (keyof typeof input)[]) {
        expect(output[key]).toBe(input[key])
        expect(nestedOutput.fields?.[key]).toBe(input[key])
      }
    }
  })

  test(`不修改输入对象，普通对象返回新引用`, () => {
    const fields = Object.freeze({ value: 100, nested: Object.freeze({ enabled: true }) })
    const input = Object.freeze({ name: 'omn', fields })
    const output = shallow(input, { depth: 3 })

    expect(output).toEqual(input)
    expect(output).not.toBe(input)
    expect(output.fields).not.toBe(fields)
    expect(output.fields?.nested).not.toBe(fields.nested)
    expect(input.fields.nested).toEqual({ enabled: true })
  })

  test(`支持无原型的普通对象`, () => {
    const input = Object.assign(Object.create(null), { value: 100, fields: { enabled: true } })

    expect(shallow(input)).toEqual({ value: 100 })
    expect(shallow({ fields: input }, { depth: 2 })).toEqual({ fields: { value: 100 } })
  })

  test(`仅处理自身可枚举的字符串属性`, () => {
    const input = { value: 100, [Symbol('hidden')]: 'hidden' }
    Object.defineProperty(input, 'hidden', { value: 'hidden', enumerable: false })

    expect(shallow(input)).toEqual({ value: 100 })
  })

  test(`安全处理特殊属性名`, () => {
    const input = JSON.parse('{"__proto__":{"value":100,"nested":{}},"constructor":"omn"}')
    const output = shallow(input, { depth: 2 })

    expect(Object.hasOwnProperty.call(output, '__proto__')).toBe(true)
    expect(Object.getPrototypeOf(output)).toBe(Object.prototype)
    expect(output).toEqual(JSON.parse('{"__proto__":{"value":100},"constructor":"omn"}'))
  })

  test(`有限深度下支持循环引用`, () => {
    const input: { value: number; self?: object } = { value: 100 }
    input.self = input

    expect(shallow(input)).toEqual({ value: 100 })
    expect(shallow(input, { depth: 3 })).toEqual({
      value: 100,
      self: { value: 100, self: { value: 100 } },
    })
  })

  test.each([0, -1, 1.5, NaN, Infinity, -Infinity])(`错误的深度：%s`, depth => {
    expect(() => shallow(target, { depth })).toThrow(OmnError)
    expect(() => shallow(target, { depth })).toThrow('配置项 "depth" 仅支持正整数类型。')
  })

  test.each([null, '2', true, {}, []])(`错误的深度类型：%s`, depth => {
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, { depth })).toThrow(OmnError)
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => shallow()).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(undefined)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(null)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow('omn')).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(1)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(false)).toThrow(OmnError)

    expect(() => shallow([])).toThrow(OmnError)
    expect(() => shallow(new Date())).toThrow(OmnError)
    expect(() => shallow(new Set())).toThrow(OmnError)
    expect(() => shallow(new Map())).toThrow(OmnError)
    expect(() => shallow(() => ({}))).toThrow(OmnError)
  })

  test(`错误的配置项输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, null)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, '2')).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, false)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, [])).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => shallow(target, new Date())).toThrow(OmnError)
  })
})
