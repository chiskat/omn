# `encodeURIComponentFixed` <Badge type="tip" text="1.0.0" />

```typescript
import { encodeURIComponentFixed } from 'omn'
```

符合 [RFC3986](https://datatracker.ietf.org/doc/html/rfc3986) 规范的 URI Component 编码函数。

JavaScript 原生的 `encodeURIComponent()` 存在一个已知问题：它不会对 `!'()*` 这几个字符进行编码，而这与 RFC3986 规范不符。`encodeURIComponentFixed` 修复了此问题，可以正确编码所有需要编码的字符。

::: tip 提示
原生的 `decodeURIComponent()` 可以正确解码所有字符，无需修复。
:::

## 示例

```typescript
// 原生 encodeURIComponent 不会编码 !'()*
encodeURIComponent('hello!(world)*')
// => "hello!(world)*"

// encodeURIComponentFixed 会正确编码这些字符
encodeURIComponentFixed('hello!(world)*')
// => "hello%21%28world%29%2A"
```

`omn` 同样提供一个 polyfill，用于全局修复 `encodeURIComponent`：

```typescript
export { setupEncodeURIComponentPolyfill, cancelEncodeURIComponentPolyfill } from 'omn'

// 设置全局 polyfill
setupEncodeURIComponentPolyfill()

encodeURIComponent('hello!(world)*')
// => "hello%21%28world%29%2A"

// 取消 polyfill，恢复原生行为
cancelEncodeURIComponentPolyfill()

encodeURIComponent('hello!(world)*')
// => "hello!(world)*"
```

## API

```typescript
function encodeURIComponentFixed(input: string | number | boolean): string
```

| 参数    | 类型                          | 默认值 | 说明               |
| ------- | ----------------------------- | ------ | ------------------ |
| `input` | `string \| number \| boolean` | -      | 待编码的字符串输入 |

返回值为已按照 RFC3986 进行 URI Component 编码的字符串。

---

```typescript
function setupEncodeURIComponentPolyfill(): void
```

设置全局 polyfill，将 `globalThis.encodeURIComponent` 替换为 `encodeURIComponentFixed`。可使用 `cancelEncodeURIComponentPolyfill()` 取消。

---

```typescript
function cancelEncodeURIComponentPolyfill(): void
```

取消由 `setupEncodeURIComponentPolyfill()` 设置的 polyfill，恢复原生 `encodeURIComponent` 行为。
