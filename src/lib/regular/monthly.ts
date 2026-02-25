import { set, getDaysInMonth, addMonths } from 'date-fns'
import { isInteger } from 'lodash-es'

import { OmnError } from '../../misc/OmnError'
import { loadState, parseTime, saveState } from './_utils'

/** 每月函数触发器的配置项 */
export interface MonthlyOptions {
  /**
   * 重置的时刻，格式为 24 时制的 "HH:mm:ss"，默认为 "00:00:00"
   */
  resetTime?: string

  /**
   * 每月的第几天重置，设为几就是几号，默认为 `1`
   *
   * 规则如下：
   * - 如果某月的总天数小于设置的值（例如设为 31，但当月只有 30 天），则此值将视为此月最后一天；
   * - 可指定负数，此时从月末开始计算，例如 `-1` 为每月最后一天，`-2` 为倒数第二天。
   */
  resetDate?: number

  /**
   * 允许 `resetDate` 参数超出月份的天数，此时重置时间会顺延到下月，默认为 `false`
   *
   * 例如 `resetDate` 设为 `31`，但当月只有 30 天，开启此参数后当月便不可重置，需等到下个月的 31 日。
   */
  allowOutOfMonth?: boolean
}

/**
 * 以月为周期触发（仅浏览器可用）
 *
 * 在浏览器中默认使用 `localStorage` 记录信息，适用于 "每月显示一次弹窗广告" 等场景。
 *
 * @param id 唯一 ID
 * @param run 被触发的函数
 * @param options 可选的配置项
 * @returns 本次调用是否触发
 * @see regular,daily,weekly
 * @example
 * // 每月展示一次提示，5 号重置
 * monthly("monthlyTips", showMonthlyTips, { resetDate: 5 })
 */
export function monthly(id: string, run: () => void, options?: MonthlyOptions): boolean {
  if (typeof id !== 'string' || !id.trim()) {
    throw new OmnError(monthly.name, '主键不合法，只支持非空字符串。')
  } else if (typeof run !== 'function') {
    throw new OmnError(monthly.name, '目标运行函数不合法，只支持函数类型。')
  }

  const key = 'omn__monthly:' + id
  const [hours, minutes, seconds] = parseTime(monthly.name, options?.resetTime)
  const resetDate = options?.resetDate || 1
  const allowOutOfMonth = options?.allowOutOfMonth || false

  if (!isInteger(resetDate) || resetDate === 0 || resetDate > 31 || resetDate < -28) {
    throw new OmnError(
      monthly.name,
      '"resetDate" 重置日参数不合法，合法值范围为 1 ~ 31 的整数表示几号，或是负数范围 -28 ~ -1 的整数表示从月末倒数，例如 "-1" 表示每月倒数第一天。'
    )
  }

  const shouldRun = () => new Date().valueOf() > (loadState(key).reset || 0)
  const recordRun = () => {
    const now = new Date()
    let resetAt = new Date()

    const daysInMonth = getDaysInMonth(now)
    const date = resetDate > 0 ? resetDate : daysInMonth + 1 + resetDate
    resetAt = set(now, { hours, minutes, seconds, date })

    if (resetDate > daysInMonth && allowOutOfMonth) {
      resetAt = set(addMonths(resetAt, 1), { date: resetDate })
    } else if (now > resetAt) {
      resetAt = addMonths(resetAt, 1)
    }
    saveState(key, { reset: resetAt.valueOf() })
  }

  const isShouldRun = Boolean(shouldRun())
  if (isShouldRun) {
    run()
    recordRun()
  }

  return isShouldRun
}
