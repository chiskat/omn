import { describe, expect, test } from 'vitest'

import { OmnError, toFormData } from '../../../src'

describe(`toFormData`, () => {
  test(`普通值和嵌套结构`, () => {
    const formData = toFormData({
      name: 'Ada',
      age: 36,
      active: true,
      score: null,
      user: { nickname: 'ada', verified: false },
      tags: ['math', 'code'],
    })

    expect(formData.get('name')).toBe('"Ada"')
    expect(formData.get('age')).toBe('36')
    expect(formData.get('active')).toBe('true')
    expect(formData.get('score')).toBe('null')
    expect(formData.get('user.nickname')).toBe('"ada"')
    expect(formData.get('user.verified')).toBe('false')
    expect(formData.get('tags[0]')).toBe('"math"')
    expect(formData.get('tags[1]')).toBe('"code"')
  })

  test(`保留空容器和 undefined 字段`, () => {
    const formData = toFormData({ emptyObject: {}, emptyArray: [], missing: undefined })
    const metadata = JSON.parse(formData.get('__OMN_META__') as string)

    expect(formData.has('emptyObject')).toBe(false)
    expect(formData.has('emptyArray')).toBe(false)
    expect(formData.has('missing')).toBe(false)
    expect(metadata).toEqual({
      containers: [
        { path: 'emptyObject', type: 'object' },
        { path: 'emptyArray', type: 'array' },
      ],
      files: [],
      undefinedValues: ['missing'],
    })
  })

  test(`文件和 Blob 作为独立字段写入`, () => {
    const file = new File(['contents'], 'notes.txt', { type: 'text/plain' })
    const blob = new Blob(['image data'], { type: 'image/png' })
    const formData = toFormData({ attachment: file, nested: { preview: blob } })
    const metadata = JSON.parse(formData.get('__OMN_META__') as string)

    expect(formData.get('attachment')).toBeInstanceOf(File)
    expect(formData.get('nested.preview')).toBeInstanceOf(Blob)
    expect(metadata.files).toEqual(['attachment', 'nested.preview'])
  })

  test(`文件数组按索引写入`, () => {
    const files = [
      new File(['first'], 'first.txt', { type: 'text/plain' }),
      new File(['second'], 'second.txt', { type: 'text/plain' }),
    ]
    const formData = toFormData({ attachments: files })

    expect(formData.get('attachments[0]')).toBe(files[0])
    expect(formData.get('attachments[1]')).toBe(files[1])
    expect(JSON.parse(formData.get('__OMN_META__') as string).files).toEqual(['attachments[0]', 'attachments[1]'])
  })

  test(`支持自定义元数据字段和 stringify`, () => {
    const formData = toFormData(
      { value: 42 },
      {
        metaField: '_meta',
        stringify: (value: unknown) => `encoded:${String(value)}`,
      }
    )

    expect(formData.get('value')).toBe('encoded:42')
    expect(formData.has('_meta')).toBe(true)
    expect(formData.has('__OMN_META__')).toBe(false)
  })

  test(`拒绝非普通对象输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => toFormData()).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => toFormData(null)).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => toFormData([])).toThrow(OmnError)
    // @ts-expect-error 测试错误传参
    expect(() => toFormData(new Date())).toThrow(OmnError)
  })

  test(`拒绝保留字段和无效配置`, () => {
    expect(() => toFormData({ __OMN_META__: 'conflict' })).toThrow(OmnError)
    expect(() => toFormData({ _meta: 'conflict' }, { metaField: '_meta' })).toThrow(OmnError)
    expect(() => toFormData({ value: 1 }, { metaField: '' })).toThrow(OmnError)
  })

  test(`报告序列化错误及无效序列化结果`, () => {
    try {
      toFormData({ value: 1n })
      throw new Error('预期 toFormData 抛错')
    } catch (error) {
      expect(error).toBeInstanceOf(OmnError)
      expect((error as OmnError).cause).toBeInstanceOf(TypeError)
    }

    expect(() => toFormData({ value: 1 }, { stringify: () => undefined as never })).toThrow(OmnError)
  })
})
