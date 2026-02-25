import { OmnError } from '../misc/OmnError'

export interface IsEnvOnOptions {
  /**
   * 严格模式，对非以下列出的值输入会报错：
   * - 视为开启的值输入：`true`、`"true"`、`"True"`、`"TRUE"`、`1`、`"1"`、`"on"`、`"On"`、`"ON"`；
   * - 视为关闭的值输入：`false`、`"false"`、`"False"`、`"FALSE"`、`0`、`"0"`、`"off"`、`"Off"`、`"OFF"`、`null`、`"null"`、`undefined`、`"undefined"`。
   */
  strict?: boolean
}

/**
 * 用于从环境变量中判断某功能开启与否，支持布尔值、数值、`"on"`/`"off"` 等类型
 *
 * 因为 `process.env` 上的变量值均为字符串格式，用 `if` 来判断是始终为 `true` 的；且有人喜欢使用 `true`，有人喜欢使用 `1`，判断条件会比较复杂；此函数则专为此场景而设计，内置了以上各种判断逻辑，直接返回布尔结果；还提供了 “严格模式” 避免预期以外的输入。
 *
 * 视为开启的值输入：`true`、`"true"`、`"True"`、`"TRUE"`、`1`、`"1"`、`"on"`、`"On"`、`"ON"`；其他输入均视为关闭。
 *
 * @param input 输入值，通常为 `process.env.<字段>`
 * @param options 可选的配置参数
 * @returns 始终返回此变量开启与否
 * @example
 * // 简化环境变量开启与否的判断逻辑
 * const noReport = isEnvOn(process.env.NO_REPORT)
 */
export function isEnvOn(input: any, options?: IsEnvOnOptions): boolean {
  const strict = options?.strict || false

  const asTruly = [1, '1', true, 'true', 'True', 'TRUE', 'on', 'On', 'ON']
  const asFalsly = [0, '0', false, 'false', 'False', 'FALSE', 'off', 'Off', 'OFF', undefined, 'undefined', null, 'null']

  if (strict && ![...asTruly, ...asFalsly].includes(input)) {
    throw new OmnError(isEnvOn.name, '开启严格模式时，输入了预期以外的值。')
  }

  return input ? asTruly.includes(input) : false
}
