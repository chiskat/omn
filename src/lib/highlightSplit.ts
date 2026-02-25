import { escapeRegExp, first, last } from 'lodash-es'

import { OmnError } from '../misc/OmnError'
import { asList } from './asList'

export interface HighlightSplitOptions {
  /** 确保输出结果的开头和末尾始终为不高亮片段，如果不是，则会填补空字符串片段 */
  wrap?: boolean
}

/**
 * 适用于 “高亮显示关键词” 场景，将字符串按照给定的规则切分成对象数组，其中关键字的片段会带有 `highlight: true` 字段
 *
 * 使用正则表达式时，请将其中所有的捕获组 `(xxx)` 改成非捕获组 `(?:xxx)`，否则会输出错误的结果
 *
 * @param input 需切分的字符串输入
 * @param keywords 需高亮的关键字词，支持字符串单值/数组，或者是单个正则表达式
 * @param options 可选的配置参数
 * @returns 已切分的字符串片段对象数组，格式 `[{ text: "文本", highlight: true }, ...]`
 * @example
 * highlightSplit("我使用谷歌搜索文章。", "谷歌")
 * // →
 * [
 *   { text: "我使用", highlight: false },
 *   { text: "谷歌", highlight: true },
 *   { text: "搜索文章。", highlight: false },
 * ]
 */
export function highlightSplit(
  input: string,
  keywords: string | string[] | RegExp,
  options?: HighlightSplitOptions
): HighlightFragment[] {
  if (typeof input !== 'string') {
    throw new OmnError(highlightSplit.name, '输入参数不合法，仅支持字符串。')
  } else if (typeof keywords !== 'string' && !(keywords instanceof RegExp) && !Array.isArray(keywords)) {
    throw new OmnError(highlightSplit.name, '高亮关键词参数不合法，仅支持字符串单值/数组，或者是正则表达式单值。')
  } else if (Array.isArray(keywords) && !keywords.every(t => typeof t === 'string')) {
    throw new OmnError(highlightSplit.name, '高亮关键词参数不合法，只支持字符串类型的数组。')
  } else if (Array.isArray(keywords) && keywords.length <= 0) {
    throw new OmnError(highlightSplit.name, '高亮关键词参数不合法，数组须包含至少一个元素。')
  } else if (typeof keywords === 'string' && !keywords) {
    throw new OmnError(highlightSplit.name, '高亮关键词参数不合法，不能使用空字符串。')
  } else if (Array.isArray(keywords) && keywords.some(item => !item)) {
    throw new OmnError(highlightSplit.name, '高亮关键词参数不合法，不能包含空字符串。')
  }

  let splitRegexp: RegExp

  if (keywords instanceof RegExp) {
    splitRegexp = new RegExp(`(${keywords.source})`, keywords.flags)
  } else if (typeof keywords === 'string') {
    splitRegexp = new RegExp(`(${escapeRegExp(keywords)})`)
  } else {
    const keywordPattern = asList(keywords)
      .map(item => escapeRegExp(item))
      .join('|')
    splitRegexp = new RegExp(`(${keywordPattern})`)
  }

  const splitResult = input.split(splitRegexp).filter(Boolean)
  const highlightResult = splitResult
    .map(item => ({ text: item, highlight: splitRegexp.test(item) }))
    .filter(item => !!item.text)

  const wrap = options?.wrap || false

  for (let idx = 0; idx < highlightResult.length; ++idx) {
    if (highlightResult[idx - 1]?.highlight === highlightResult[idx].highlight) {
      highlightResult[idx].text = highlightResult[idx - 1].text + highlightResult[idx].text
      highlightResult[idx - 1] = null as unknown as HighlightFragment
    }
  }
  const mergeResult = highlightResult.filter(Boolean)

  return wrap ? withWrap(mergeResult) : mergeResult
}

function withWrap(input: HighlightFragment[]) {
  const result = [...input]

  if (first(input)?.highlight) {
    result.unshift({ text: '', highlight: false })
  }
  if (last(input)?.highlight) {
    result.push({ text: '', highlight: false })
  }

  return result
}

/** 高亮切分字符串的片段类型 */
export interface HighlightFragment {
  /** 切分的字符串片段 */
  text: string
  /** 此片段是否符合高亮关键字词 */
  highlight: boolean
}
