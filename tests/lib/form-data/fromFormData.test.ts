import { describe, expect, test } from 'vitest'

import { fromFormData, OmnError } from '../../../src'

describe(`fromFormData`, () => {
  const createFormData = (
    values: Record<string, string | Blob>,
    metadata: {
      containers?: Array<{ path: string; type: 'array' | 'object' }>
      files?: string[]
      undefinedValues?: string[]
    } = {}
  ) => {
    const formData = new FormData()
    formData.append('__OMN_META__', JSON.stringify({ containers: [], files: [], undefinedValues: [], ...metadata }))
    for (const [path, value] of Object.entries(values)) {
      formData.append(path, value)
    }
    return formData
  }

  test(`解析普通值并还原嵌套对象和数组`, () => {
    const formData = createFormData(
      {
        name: '"Ada"',
        age: '36',
        active: 'true',
        score: 'null',
        'user.nickname': '"ada"',
        'user.verified': 'false',
        'tags[0]': '"math"',
        'tags[1]': '"code"',
      },
      {
        containers: [
          { path: 'user', type: 'object' },
          { path: 'tags', type: 'array' },
        ],
      }
    )

    expect(fromFormData(formData)).toEqual({
      name: 'Ada',
      age: 36,
      active: true,
      score: null,
      user: { nickname: 'ada', verified: false },
      tags: ['math', 'code'],
    })
  })

  test(`还原空容器和 undefined 字段`, () => {
    const formData = createFormData(
      {},
      {
        containers: [
          { path: 'emptyObject', type: 'object' },
          { path: 'emptyArray', type: 'array' },
        ],
        undefinedValues: ['missing'],
      }
    )

    expect(fromFormData(formData)).toEqual({ emptyObject: {}, emptyArray: [], missing: undefined })
  })

  test(`还原 File 字段和数组`, async () => {
    const files = [
      new File(['first'], 'first.txt', { type: 'text/plain' }),
      new File(['second'], 'second.txt', { type: 'text/plain' }),
    ]
    const formData = createFormData(
      { attachment: files[0], 'attachments[0]': files[0], 'attachments[1]': files[1] },
      {
        containers: [{ path: 'attachments', type: 'array' }],
        files: ['attachment', 'attachments[0]', 'attachments[1]'],
      }
    )
    const result = fromFormData<{ attachment: File; attachments: File[] }>(formData)

    expect(result.attachment).toBeInstanceOf(File)
    expect(result.attachment.name).toBe('first.txt')
    expect(result.attachments.map(file => file.name)).toEqual(['first.txt', 'second.txt'])
    expect(await Promise.all(result.attachments.map(file => file.text()))).toEqual(['first', 'second'])
  })

  test(`支持自定义元数据字段和 parse`, () => {
    const formData = new FormData()
    formData.append('_meta', JSON.stringify({ containers: [], files: [], undefinedValues: [] }))
    formData.append('value', 'encoded:42')

    expect(
      fromFormData(formData, {
        metaField: '_meta',
        parse: value => Number(value.slice('encoded:'.length)),
      })
    ).toEqual({ value: 42 })
  })

  test(`拒绝无效输入和元数据`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => fromFormData()).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => fromFormData(null)).toThrow(OmnError)
    expect(() => fromFormData(new FormData())).toThrow(OmnError)

    const invalidJson = new FormData()
    invalidJson.append('__OMN_META__', 'invalid')
    expect(() => fromFormData(invalidJson)).toThrow(OmnError)

    for (const metadata of [
      'null',
      JSON.stringify({ containers: [{ path: 1, type: 'object' }], files: [], undefinedValues: [] }),
    ]) {
      const formData = new FormData()
      formData.append('__OMN_META__', metadata)
      expect(() => fromFormData(formData)).toThrow(OmnError)
    }
  })

  test(`拒绝无效配置和未登记的文件值`, () => {
    const formData = createFormData({ value: '1' })

    expect(() => fromFormData(formData, { metaField: '' })).toThrow(OmnError)

    const unregisteredFile = createFormData({ file: new Blob(['data']) })
    expect(() => fromFormData(unregisteredFile)).toThrow(OmnError)
  })

  test(`解析字段失败时保留原始错误`, () => {
    const formData = createFormData({ value: 'invalid' })

    try {
      fromFormData(formData)
      throw new Error('预期 fromFormData 抛错')
    } catch (error) {
      expect(error).toBeInstanceOf(OmnError)
      expect((error as OmnError).cause).toBeInstanceOf(SyntaxError)
    }
  })
})
