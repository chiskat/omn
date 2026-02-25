import { describe, expect, test } from 'vitest'

import { highlightSplit } from '../../src'

describe(`highlightSplit`, () => {
  test(`字符串用法`, () => {
    expect(highlightSplit('今天天气不错', '天气')).toEqual([
      { text: '今天', highlight: false },
      { text: '天气', highlight: true },
      { text: '不错', highlight: false },
    ])

    expect(highlightSplit('今天天气不错', '1')).toEqual([{ text: '今天天气不错', highlight: false }])

    expect(highlightSplit('今天天气不错', '天')).toEqual([
      { text: '今', highlight: false },
      { text: '天天', highlight: true },
      { text: '气不错', highlight: false },
    ])

    // 未开启 "wrap" 时，正常输出
    expect(highlightSplit('今天天气不错', '今天')).toEqual([
      { text: '今天', highlight: true },
      { text: '天气不错', highlight: false },
    ])

    // 开启 "wrap" 后，始终保证首尾是非高亮的片段
    expect(highlightSplit('今天天气不错', '今天', { wrap: true })).toEqual([
      { text: '', highlight: false },
      { text: '今天', highlight: true },
      { text: '天气不错', highlight: false },
    ])

    // 开启 "wrap" 后，始终保证首尾是非高亮的片段
    expect(highlightSplit('今天天气不错', '今天天气不错', { wrap: true })).toEqual([
      { text: '', highlight: false },
      { text: '今天天气不错', highlight: true },
      { text: '', highlight: false },
    ])
  })

  test(`正则用法`, () => {
    expect(highlightSplit('今天天气不错', /天/)).toEqual([
      { text: '今', highlight: false },
      { text: '天天', highlight: true },
      { text: '气不错', highlight: false },
    ])

    expect(highlightSplit('今天天气不错', /天+/)).toEqual([
      { text: '今', highlight: false },
      { text: '天天', highlight: true },
      { text: '气不错', highlight: false },
    ])

    expect(highlightSplit('今天天气不错', /[今不]/)).toEqual([
      { text: '今', highlight: true },
      { text: '天天气', highlight: false },
      { text: '不', highlight: true },
      { text: '错', highlight: false },
    ])

    expect(highlightSplit('今天天气不错', /(?:今|不)/)).toEqual([
      { text: '今', highlight: true },
      { text: '天天气', highlight: false },
      { text: '不', highlight: true },
      { text: '错', highlight: false },
    ])

    expect(highlightSplit('Hi! Richard!', /h/i)).toEqual([
      { text: 'H', highlight: true },
      { text: 'i! Ric', highlight: false },
      { text: 'h', highlight: true },
      { text: 'ard!', highlight: false },
    ])
  })

  test(`字符串数组用法`, () => {
    expect(highlightSplit('今天天气不错', ['天'])).toEqual([
      { text: '今', highlight: false },
      { text: '天天', highlight: true },
      { text: '气不错', highlight: false },
    ])

    expect(highlightSplit('今天天气不错', ['今', '不'])).toEqual([
      { text: '今', highlight: true },
      { text: '天天气', highlight: false },
      { text: '不', highlight: true },
      { text: '错', highlight: false },
    ])
  })

  test(`错误传参`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit([], '天')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit({}, '天')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit('今天天气不错', 1)).toThrow()

    expect(() => highlightSplit('今天天气不错', '')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit('今天天气不错', [1])).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit('今天天气不错', [/天/])).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => highlightSplit('今天天气不错', {})).toThrow()

    expect(() => highlightSplit('今天天气不错', [])).toThrow()
  })
})
