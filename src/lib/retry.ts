import { isInteger } from 'lodash-es'

import { OmnError } from '../misc/OmnError'
import { sleep } from './sleep'

export interface RetryOptions {
  /** 每两次执行之间的间隔时间毫秒，默认为 `0` */
  interval?: number

  /** 超时时间，设置为 `0` 则为无限时，默认为无限时 */
  timeout?: number

  /** 最大尝试次数，设置为 `0` 则为无限次，默认为无限次 */
  maxRounds?: number

  /** 容许的最大报错次数，在容许次数内报错不会导致失败，而是会继续运行，默认为 `0` 表示不容许，设为 `-1` 表示不限次数 */
  maxErrors?: number

  /** 根据上次运行的结果判断是否完成的函数，默认为 `Boolean`，即只要结果为 Truly 就算成功 */
  success?: (result: any) => boolean
}

/**
 * 重试/轮询执行异步函数
 *
 * 配置项全面，可指定结束条件、执行间隔、超时时间、最大执行次数、最大报错次数等；返回包含每一次运行结果的包装格式；可用于轮询、错误重试、循环执行等多种场景。
 *
 * @param func 被轮询执行的函数输入
 * @param options 可选的配置参数
 * @returns 包装后的结果
 * @example
 * // 这里返回值 result 是包装后的结果
 * const result = await retry(
 *   () => axios.get(url),
 *   {
 *     timeout: 30 * 1000,
 *     success: result => result.data.data.done === true,
 *   }
 * )
 *
 * // 是否成功，若成功则使用结果
 * const { success, data } = result
 * if (success) {
 *   console.log("处理成功，结果：", data)
 * }
 */
export async function retry<T>(func: () => T | Promise<T>, options?: RetryOptions): Promise<RetryResult<T>> {
  if (typeof func !== 'function') {
    throw new OmnError(retry.name, '轮询函数输入参数类型错误。')
  } else if (typeof options !== 'undefined' && typeof options !== 'object') {
    throw new OmnError(retry.name, '配置项参数仅支持对象输入。')
  }

  const { interval, timeout, maxRounds, maxErrors, success } = {
    interval: 0,
    timeout: 0,
    maxRounds: 0,
    maxErrors: 0,
    success: Boolean,
    ...options,
  }

  if (typeof interval !== 'number' || isNaN(interval) || interval < 0) {
    throw new OmnError(retry.name, '配置项 "interval" 仅支持非负数类型。')
  } else if (typeof timeout !== 'number' || isNaN(timeout) || timeout < 0) {
    throw new OmnError(retry.name, '配置项 "timeout" 仅支持非负数类型。')
  } else if (typeof maxRounds !== 'number' || !isInteger(maxRounds) || maxRounds < 0) {
    throw new OmnError(retry.name, '配置项 "maxRounds" 仅支持非负整数类型。')
  } else if (typeof maxErrors !== 'number' || !isInteger(maxErrors) || (maxErrors < 0 && maxErrors !== -1)) {
    throw new OmnError(retry.name, '配置项 "maxErrors" 仅支持非负整数类型和特殊值 "-1"。')
  } else if (typeof success !== 'function') {
    throw new OmnError(retry.name, '配置项 "success" 仅支持函数类型。')
  }

  const retryResult: RetryResult<T> = { success: false, rounds: 0, history: [] }

  async function run() {
    let isSuccess = false
    let errors = 0

    do {
      if (maxErrors !== -1 && errors > maxErrors) {
        retryResult.success = false
        retryResult.reason = maxErrors <= 0 ? 'error' : 'maxErrors'
        break
      }

      delete retryResult['error']

      if (maxRounds > 0 && retryResult.rounds >= maxRounds) {
        retryResult.success = false
        retryResult.reason = 'maxRounds'
        break
      }

      if (interval > 0 && retryResult.rounds > 0) {
        await sleep(interval)
      }

      let roundResult: T | undefined = undefined
      try {
        roundResult = await func()
        retryResult.history.push(roundResult)
      } catch (e: any) {
        ++errors
        retryResult.error = e
        retryResult.history.push(e)
      }

      retryResult.rounds += 1

      isSuccess = !retryResult.error && success(roundResult)
      if (isSuccess) {
        retryResult.success = true
        retryResult.data = roundResult
      }
    } while (!isSuccess)

    return retryResult
  }

  async function timeoutRun() {
    await sleep(timeout)

    const timeoutResult: RetryResult<T> = {
      ...retryResult,
      success: false,
      reason: 'timeout',
    }

    return timeoutResult
  }

  const result = timeout > 0 ? await Promise.race([run(), timeoutRun()]) : await run()

  return result
}

/** 轮询函数的执行结果 */
export interface RetryResult<T> {
  /** 轮询是否成功 */
  success: boolean

  /** 轮询结果（轮询成功时有值） */
  data?: T

  /** 轮询函数抛出错误（仅在轮询因函数报错而结束时有值，超时、超次结束时为空） */
  error?: Error

  /**
   * 轮询失败的原因：
   * - 轮询成功时候为空；
   * - 因超时而失败时为 `"timeout"`；
   * - 因轮询次数超出而失败时为 `"maxRounds"`；
   * - 未配置 `maxErrors` 时因报错而失败时为 `"error"`；
   * - 配置了 `maxErrors` 因报错次数超出而失败时为 `"maxErrors"`。
   */
  reason?: 'timeout' | 'maxRounds' | 'error' | 'maxErrors'

  /** 轮询执行过的次数 */
  rounds: number

  /** 轮询执行的每一次的结果；如果设置容许报错，则数组中会包含错误对象 */
  history: any[]
}
