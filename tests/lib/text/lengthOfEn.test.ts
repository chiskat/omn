import { describe, expect, test } from 'vitest'

import { lengthOfEn } from '../../../src'

describe(`lengthOfEn`, () => {
  test(`通常用法`, () => {
    expect(lengthOfEn('Hi!')).toBe(3)
    expect(lengthOfEn('你好')).toBe(4)
    expect(lengthOfEn('Hello 你好')).toBe(10)
    expect(lengthOfEn('Hello 你好！')).toBe(12)

    expect(lengthOfEn('1234567890')).toBe(10)
    expect(lengthOfEn('qwertyuiopasdfghjklzxcvbnm')).toBe(26)
    expect(lengthOfEn('QWERTYUIOPASDFGHJKLZXCVBNM')).toBe(26)

    expect(lengthOfEn('~!@#$%^&*()-=+[];".,/?|\\\'{}<> ')).toBe(30)
    expect(lengthOfEn('￥，。、～：；！')).toBe(16)
    expect(lengthOfEn('【】『』「」《》（）')).toBe(20)

    expect(lengthOfEn('안녕')).toBe(4)
    expect(lengthOfEn('오늘 날씨가 정말 좋아요!')).toBe(24)

    expect(lengthOfEn('やあ')).toBe(4)
    expect(lengthOfEn('はい、元気です。あなたは？')).toBe(26)
    expect(lengthOfEn('コンニチハ、オゲンキデスカ？')).toBe(28)
  })

  test(`忽略标点符号`, () => {
    expect(lengthOfEn('Hi!', { excludePunctuation: true })).toBe(3)
    expect(lengthOfEn('你好', { excludePunctuation: true })).toBe(4)
    expect(lengthOfEn('Hello 你好', { excludePunctuation: true })).toBe(10)
    expect(lengthOfEn('Hello 你好！', { excludePunctuation: true })).toBe(11)

    expect(lengthOfEn('1234567890', { excludePunctuation: true })).toBe(10)
    expect(lengthOfEn('qwertyuiopasdfghjklzxcvbnm', { excludePunctuation: true })).toBe(26)
    expect(lengthOfEn('QWERTYUIOPASDFGHJKLZXCVBNM', { excludePunctuation: true })).toBe(26)

    expect(lengthOfEn('~!@#$%^&*()-=+[];".,/?|\\\'{}<> ', { excludePunctuation: true })).toBe(30)
    expect(lengthOfEn('￥，。、～：；！', { excludePunctuation: true })).toBe(8)
    expect(lengthOfEn('【】『』「」《》（）', { excludePunctuation: true })).toBe(10)

    expect(lengthOfEn('안녕', { excludePunctuation: true })).toBe(4)
    expect(lengthOfEn('오늘 날씨가 정말 좋아요!', { excludePunctuation: true })).toBe(24)

    expect(lengthOfEn('やあ', { excludePunctuation: true })).toBe(4)
    expect(lengthOfEn('はい、元気です。あなたは？', { excludePunctuation: true })).toBe(23)
    expect(lengthOfEn('コンニチハ、オゲンキデスカ？', { excludePunctuation: true })).toBe(26)
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => lengthOfEn(null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => lengthOfEn([])).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => lengthOfEn(111)).toThrow()
  })
})
