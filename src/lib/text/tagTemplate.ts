import { OmnError } from '../../misc/OmnError'

/**
 * 处理多行字符串，保持缩进的同时去除每行多余的前导空格，去除首尾多余的换行；也可作 “标签模版” 用法
 *
 * @param stringInput 字符串输入
 * @param templateStrings 标签模板用法
 * @returns 标签模板所表示的字符串
 * @example
 * // 函数用法
 * const result = tagTemplate("  a\n   b\n  c")
 * result === "a\n b\nc" // → true
 *
 * // 标签模板用法
 * const functionAdd = tagTemplate`
 *   function add(a, b) {
 *     return a + b
 *   }
 * `
 * functionAdd[0] ===
 *   "function add(a, b) {\n  return a + b\n}" // → true
 */
export function tagTemplate(stringInput: string): string
export function tagTemplate(templateStrings: TemplateStringsArray, ...restArgs: any[]): string
export function tagTemplate(stringOrWrapStrings: string | TemplateStringsArray, ...restArgs: any[]): string {
  let input = ''

  if (typeof stringOrWrapStrings !== 'string' && !Array.isArray(stringOrWrapStrings)) {
    throw new OmnError(tagTemplate.name, '输入必须为字符串或标签模板。')
  }

  if (typeof stringOrWrapStrings === 'string') {
    input = stringOrWrapStrings
  } else {
    let idx = 0
    while (idx < restArgs.length) {
      input += `${stringOrWrapStrings[idx]}${restArgs[idx]}`
      ++idx
    }
    input += `${stringOrWrapStrings[idx]}`
  }

  const lines = input.trimEnd().split(/\r?\n/)
  if (lines[0] === '') {
    lines.shift()
  }

  const indentLengths = lines
    .filter(line => line.trim() !== '')
    .map(line => line.match(/^(\s*)/)?.[1].length)
    .filter(spaces => spaces !== undefined)

  const minIndent = Math.min(...indentLengths)
  const processedLines = lines.map(line => line.replace(new RegExp(`^( {${minIndent}})`), ''))
  const result = processedLines.join('\n')

  return result
}
