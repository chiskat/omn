# `highlightSplit` <Badge type="tip" text="1.0.0" />

```typescript
import { highlightSplit } from 'omn'
```

适用于 “高亮显示关键词” 场景，将字符串按照给定的规则切分成对象数组，其中匹配关键字的片段会带有 `highlight: true` 字段。

匹配关键字支持单个/多个字符串，以及单个正则表达式。

::: warning 注意
使用正则表达式匹配高亮关键词时，请将其中所有的捕获组 `(xxx)` 改成非捕获组 `(?:xxx)`，否则会输出错误的结果。
:::

## 示例

常规用法：

::: code-group

```typescript [字符串输入]
highlightSplit("本周五的天气很不错！", "天气")

// →
[
  { text: "本周五的", highlight: false },
  { text: "天气", highlight: true },
  { text: "很不错！", highlight: false },
]
```

```typescript [字符串数组]
highlightSplit("本周五的天气很不错！", ["周五", "天气"])

// →
[
  { text: "本", highlight: false },
  { text: "周五", highlight: true },
  { text: "的", highlight: false },
  { text: "天气", highlight: true },
  { text: "很不错！", highlight: false },
]
```

```typescript [正则表达式]
highlightSplit("本周五的天气很不错！", /(?:五|天)/)

// →
[
  { text: "本周", highlight: false },
  { text: "五", highlight: true },
  { text: "的", highlight: false },
  { text: "天", highlight: true },
  { text: "气很不错！", highlight: false },
]
```

:::

可开启 `wrap` 配置项，开启后，会确保输出结果的首末元素都一定是不高亮的片段。<br />如果原本输出首末是高亮片段，则插入一个空文本片段。

::: code-group

```typescript [开启 "wrap"]
highlightSplit("本周五的天气很不错！", "本周五", { wrap: true })

// →
[
  { text: "", highlight: false }, // [!code highlight]
  { text: "本周五", highlight: true },
  { text: "的天气很不错！", highlight: false },
]
```

```typescript [未开启 "wrap"]
highlightSplit("本周五的天气很不错！", "本周五")

// →
[
  { text: "本周五", highlight: true },
  { text: "的天气很不错！", highlight: false },
]
```

:::

## API

```typescript
function highlightSplit(
  input: string,
  keywords: string | string[] | RegExp,
  options?: HighlightSplitOptions
): HighlightFragment[]
```

| 参数       | 类型                           | 默认值 | 说明           |
| ---------- | ------------------------------ | ------ | -------------- |
| `input`    | `string`                       | -      | 待处理的字符串 |
| `keywords` | `string \| string[] \| RegExp` | -      | 关键词         |
| `options`  | `HighlightSplitOptions`        | -      | 可选的配置项   |

### 返回值

```typescript
interface HighlightFragment {
  text: string
  highlight: boolean
}
```

| 字段        | 类型      | 说明               |
| ----------- | --------- | ------------------ |
| `text`      | `string`  | 字符串片段         |
| `highlight` | `boolean` | 是否匹配高亮关键词 |

### 配置项

```typescript
interface HighlightSplitOptions {
  wrap?: boolean
}
```

| 字段   | 类型      | 默认值  | 说明                                                 |
| ------ | --------- | ------- | ---------------------------------------------------- |
| `wrap` | `boolean` | `false` | 开启后，会确保输出结果的首末元素都一定是不高亮的片段 |
