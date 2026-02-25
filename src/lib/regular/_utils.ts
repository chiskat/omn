import { OmnError } from '../../misc/OmnError'

interface RegularStorageData {
  reset: number
}

export function saveState(key: string, data: RegularStorageData) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadState(key: string) {
  return JSON.parse(localStorage.getItem(key) || '{}') as RegularStorageData
}

/** 解析时分秒 */
export function parseTime(type: string, time: string = '00:00:00'): [number, number, number] {
  function throwError(): never {
    throw new OmnError(
      type,
      '"resetTime" 重置时间不合法，只支持 24 时制的时间字符串，格式 "HH:mm:ss"，范围从 "00:00:00" 到 "23:59:59"。'
    )
  }

  if (typeof time !== 'string') {
    throwError()
  }

  const matchedTime = time.match(/^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)
  if (!matchedTime || matchedTime.length < 4) {
    throwError()
  }

  const hour = Number(matchedTime[1]),
    minute = Number(matchedTime[2]),
    second = Number(matchedTime[3])

  if (hour >= 24 || minute > 60 || second > 60) {
    throwError()
  }

  return [hour, minute, second]
}
