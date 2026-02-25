import { OmnError } from '../misc/OmnError'

/**
 * 等待一段时间，通常用于测试 loading 状态等场景
 *
 * @param ms 需要等待的毫秒数
 * @returns 等待指定毫秒后完成的 `Promise`
 * @example
 * // 等待 5 秒
 * await sleep(5000)
 */
export async function sleep(ms: number): Promise<void> {
  if (typeof ms !== 'number' || isNaN(ms)) {
    throw new OmnError(sleep.name, '等待时间毫秒数参数仅支持数值。')
  } else if (ms < 0) {
    throw new OmnError(sleep.name, '等待时间毫秒数输入不合法，仅支持非负数。')
  }

  return new Promise(res => void setTimeout(res, ms))
}
