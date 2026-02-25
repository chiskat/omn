import { addDays, set } from 'date-fns'

import { OmnError } from '../../misc/OmnError'
import { loadState, parseTime, saveState } from './_utils'

/** 每日函数触发器的配置项 */
export interface DailyOptions {
  /**
   * 重置的时刻，格式为 24 时制的 "HH:mm:ss"，默认为 "00:00:00"
   */
  resetTime?: string
}

/**
 * 以天为周期触发（仅浏览器可用）
 *
 * 在浏览器中默认使用 `localStorage` 记录信息，适用于 "每日首次登录显示弹窗广告" 等场景。
 *
 * @param id 唯一 ID
 * @param run 被触发的函数
 * @param options 可选的配置项
 * @returns 本次调用是否触发
 * @see regular,weekly,monthly
 * @example
 * // 每天显示一次广告
 * daily("dailyAds", showDailyAdsFunc)
 */
export function daily(id: string, run: () => void, options?: DailyOptions): boolean {
  if (typeof id !== 'string' || !id.trim()) {
    throw new OmnError(daily.name, '主键不合法，只支持非空字符串。')
  } else if (typeof run !== 'function') {
    throw new OmnError(daily.name, '目标运行函数不合法，只支持函数类型。')
  }

  const key = 'omn__daily:' + id
  const [hours, minutes, seconds] = parseTime(daily.name, options?.resetTime)

  const shouldRun = () => new Date().valueOf() > (loadState(key).reset || 0)
  const recordRun = () => {
    const now = new Date()
    let resetAt = set(now, { hours, minutes, seconds })
    if (now > resetAt) {
      resetAt = addDays(resetAt, 1)
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
