import { OmnError } from '../../misc/OmnError'

/** 周期触发类函数的基础配置项 */
export interface RegularOptions {
  /** 自定义触发条件判断的函数，需返回布尔值表示本次是否触发，需同 `recordRun` 配置项配套使用 */
  shouldRun?(): boolean

  /** 自定义记录触发的函数，每次触发后会调用此函数记录，需同 `shouldRun` 配置项配套使用 */
  recordRun?(): void
}

/**
 * 以特定周期触发函数，通过第二个参数的 `shouldRun` 和 `recordRun` 来判断和记录
 *
 * @param run 被触发的函数
 * @param options 可选的配置项
 * @returns 本次调用是否触发
 * @see daily,weekly,monthly
 */
export function regular(run: () => void, options: Required<RegularOptions>): boolean {
  if (typeof run !== 'function') {
    throw new OmnError(regular.name, '目标运行函数不合法，只支持函数类型。')
  } else if (!options?.recordRun || !options?.shouldRun) {
    throw new OmnError(regular.name, '运行条件判断函数 "shouldRun" 和运行记录函数 "recordRun" 必须同时设置。')
  }

  const isShouldRun = Boolean(options.shouldRun())
  if (isShouldRun) {
    run()
    options.recordRun()
  }

  return isShouldRun
}
