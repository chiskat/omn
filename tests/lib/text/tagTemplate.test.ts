import { describe, expect, test } from 'vitest'

import { tagTemplate } from '../../../src'

describe(`tagTemplate`, () => {
  test(`函数用法`, () => {
    expect(tagTemplate('test')).toBe('test')

    expect(tagTemplate('\n        function greet() {\n          console.log("hello!")\n        }')).toBe(
      'function greet() {\n  console.log("hello!")\n}'
    )

    expect(tagTemplate('   A\n    B\n     C')).toBe('A\n B\n  C')
    expect(tagTemplate('     A\n    B\n   C')).toBe('  A\n B\nC')
  })

  test(`标签模板用法`, () => {
    expect(tagTemplate`test`).toBe('test')

    expect(
      tagTemplate`
        function greet() {
          console.log("hello!")
        }
      `
    ).toBe('function greet() {\n  console.log("hello!")\n}')

    expect(
      tagTemplate`
      function greet() {
        console.log("hello!")
      }
      `
    ).toBe('function greet() {\n  console.log("hello!")\n}')

    expect(
      tagTemplate`
    function greet() {
      console.log("hello!")
    }
      `
    ).toBe('function greet() {\n  console.log("hello!")\n}')

    expect(
      tagTemplate`
function greet() {
  console.log("hello!")
}
      `
    ).toBe('function greet() {\n  console.log("hello!")\n}')

    const word = () => 'Good morning!'

    expect(
      tagTemplate`
        function greet() {
          console.log("${word()}")
        }
      `
    ).toBe(`function greet() {\n  console.log("${word()}")\n}`)

    expect(tagTemplate(`   A\n    B\n     C`)).toBe('A\n B\n  C')
    expect(tagTemplate(`     A\n    B\n   C`)).toBe('  A\n B\nC')
  })

  test(`边界情况`, () => {
    // 空字符串
    expect(tagTemplate('')).toBe('')
    expect(tagTemplate``).toBe('')

    // 只有空白字符
    expect(tagTemplate('   ')).toBe('')
    expect(tagTemplate`   `).toBe('')

    // 只有换行（trimEnd 去除尾部，shift 去除首行空行）
    expect(tagTemplate('\n')).toBe('')
    expect(tagTemplate('\n\n\n')).toBe('')

    // 带有空行的多行字符串
    expect(tagTemplate('  a\n\n  b')).toBe('a\n\nb')
    expect(tagTemplate('  a\n  \n  b')).toBe('a\n\nb')

    // Windows 换行符 (\r\n)
    expect(tagTemplate('  a\r\n  b\r\n  c')).toBe('a\nb\nc')
    expect(tagTemplate('    a\r\n      b\r\n    c')).toBe('a\n  b\nc')

    // 尾部有多余空白
    expect(tagTemplate('  a  \n  b  ')).toBe('a  \nb')
  })

  test(`错误处理`, () => {
    // @ts-expect-error 测试非法输入
    expect(() => tagTemplate(123)).toThrow()
    // @ts-expect-error 测试非法输入
    expect(() => tagTemplate(null)).toThrow()
    // @ts-expect-error 测试非法输入
    expect(() => tagTemplate(undefined)).toThrow()
    // @ts-expect-error 测试非法输入
    expect(() => tagTemplate({})).toThrow()
  })
})
