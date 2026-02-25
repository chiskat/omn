import { describe, expect, test } from 'vitest'

import {
  cancelEncodeURIComponentPolyfill,
  encodeURIComponentFixed,
  setupEncodeURIComponentPolyfill,
} from '../../../src'

describe(`encodeURIComponentFixed`, () => {
  test(`编码`, () => {
    expect(encodeURIComponent('Hi!')).toBe('Hi!')
    expect(encodeURIComponentFixed('Hi!')).toBe('Hi%21')

    expect(encodeURIComponent('while(1)')).toBe('while(1)')
    expect(encodeURIComponentFixed('while(1)')).toBe('while%281%29')

    expect(encodeURIComponent("'string'")).toBe("'string'")
    expect(encodeURIComponentFixed("'string'")).toBe('%27string%27')

    expect(encodeURIComponent('100*100')).toBe('100*100')
    expect(encodeURIComponentFixed('100*100')).toBe('100%2A100')
  })

  test(`解码`, () => {
    expect(decodeURIComponent('Hi!')).toBe('Hi!')
    expect(decodeURIComponent('Hi%21')).toBe('Hi!')

    expect(decodeURIComponent('while(1)')).toBe('while(1)')
    expect(decodeURIComponent('while%281%29')).toBe('while(1)')

    expect(decodeURIComponent("'string'")).toBe("'string'")
    expect(decodeURIComponent('%27string%27')).toBe("'string'")

    expect(decodeURIComponent('100*100')).toBe('100*100')
    expect(decodeURIComponent('100%2A100')).toBe('100*100')
  })
})

describe(`setupEncodeURIComponentPolyfill / cancelEncodeURIComponentPolyfill`, () => {
  test(`安装和取消 polyfill`, () => {
    expect(encodeURIComponent('Hi!')).toBe('Hi!')
    setupEncodeURIComponentPolyfill()
    expect(encodeURIComponent('Hi!')).toBe('Hi%21')
    cancelEncodeURIComponentPolyfill()
    expect(encodeURIComponent('Hi!')).toBe('Hi!')
  })
})
