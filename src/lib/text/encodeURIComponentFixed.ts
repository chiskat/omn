const originEncodeURIComponent = encodeURIComponent

/**
 * 符合 RFC3986 的 URI Component 编码
 *
 * JavaScript 原生的 `encodeURIComponent()` 不符合 RFC3986，它不会编码 `!'()*` 这几个字符；此方法修复了此问题，可以正确编码所有字符。
 *
 * 注：JavaScript 原生的 `decodeURIComponent()` 可以正确解码所有字符，它不需要修复。
 *
 * @see RFC3986 https://datatracker.ietf.org/doc/html/rfc3986
 * @see setupEncodeURIComponentPolyfill,cancelEncodeURIComponentPolyfill
 * @param input 待编码的字符串输入
 * @returns 已按照 RFC3986 进行 URI Component 编码的字符串
 */
export function encodeURIComponentFixed(input: string | number | boolean): string {
  return originEncodeURIComponent(input).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

/**
 * 设置 `encodeURIComponent()` 的 polyfill，全局修复此函数
 *
 * 可使用 `cancelEncodeURIComponentPolyfill()` 来取消此 polyfill。
 *
 * @see encodeURIComponentFixed,cancelEncodeURIComponentPolyfill
 */
export function setupEncodeURIComponentPolyfill() {
  const target = globalThis || window
  target.encodeURIComponent = encodeURIComponentFixed
}

/**
 * 取消 `encodeURIComponent()` 设置的 polyfill
 *
 * @see encodeURIComponentFixed,setupEncodeURIComponentPolyfill
 */
export function cancelEncodeURIComponentPolyfill() {
  const target = globalThis || window
  target.encodeURIComponent = originEncodeURIComponent
}
