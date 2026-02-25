import { set, nextDay, Day } from 'date-fns'
import { isInteger } from 'lodash-es'

import { OmnError } from '../../misc/OmnError'
import { loadState, parseTime, saveState } from './_utils'

/** 每周函数触发器的配置项 */
export interface WeeklyOptions {
  /**
   * 重置的时刻，格式为 24 时制的 "HH:mm:ss"，默认为 "00:00:00"
   */
  resetTime?: string

  /**
   * 每周的第几天重置，此数值为几则表示周几，`0` 表示周日，默认为 `0`
   */
  resetDayOfWeek?: number
}

/**
 * 以星期为周期触发（仅浏览器可用）
 *
 * 在浏览器中默认使用 `localStorage` 记录信息，适用于 "每星期显示一次弹窗广告" 等场景。
 *
 * @param id 唯一 ID
 * @param run 被触发的函数
 * @param options 可选的配置项
 * @returns 本次调用是否触发
 * @see regular,daily,monthly
 * @example
 * // 每周展示一次提示，周六之后重置
 * weekly("weeklyTips", showWeeklyTips, { resetDayOfWeek: 6 })
 */
export function weekly(id: string, run: () => void, options?: WeeklyOptions): boolean {
  if (typeof id !== 'string' || !id.trim()) {
    throw new OmnError(weekly.name, '主键不合法，只支持非空字符串。')
  } else if (typeof run !== 'function') {
    throw new OmnError(weekly.name, '目标运行函数不合法，只支持函数类型。')
  }

  const key = 'omn__weekly:' + id
  const [hours, minutes, seconds] = parseTime(weekly.name, options?.resetTime)
  const dayOfWeek = options?.resetDayOfWeek || 0

  if (!isInteger(dayOfWeek) || dayOfWeek > 6 || dayOfWeek < 0) {
    throw new OmnError(
      weekly.name,
      '"resetDayOfWeek" 重置日参数不合法，合法值范围为 0~6 的整数表示周几，其中 "0" 表示周日。'
    )
  }

  const shouldRun = () => new Date().valueOf() > (loadState(key).reset || 0)
  const recordRun = () => {
    const now = new Date()
    let resetAt = set(now, { hours, minutes, seconds })
    if (now.getDay() !== dayOfWeek || now > resetAt) {
      resetAt = nextDay(resetAt, dayOfWeek as Day)
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
