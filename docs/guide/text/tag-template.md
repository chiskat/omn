# `tagTemplate` <Badge type="tip" text="1.0.0" />

```typescript
import { tagTemplate } from 'omn'
```

处理多行字符串，自动去除每行多余的前导空格，同时保留行与行之间的相对缩进关系，并去除首尾多余的空行。

支持两种用法：普通函数调用和 ES6 标签模板。

## 示例

### 普通函数用法

```typescript
const raw = `
      function add(a, b) {
        return a + b
      }
`

tagTemplate(raw)
// →
// function add(a, b) {
//   return a + b
// }
```

### 标签模板用法

```typescript
const name = 'World'

const msg = tagTemplate`
  Hello, ${name}!
  Welcome to omn.
`

// →
// Hello, World!\nWelcome to omn.
```

## API

```typescript
function tagTemplate(stringInput: string): string
```

| 参数          | 类型     | 默认值 | 说明                       |
| ------------- | -------- | ------ | -------------------------- |
| `stringInput` | `string` | -      | 普通函数用法时传入的字符串 |

```typescript
function tagTemplate(templateStrings: TemplateStringsArray, ...restArgs: any[]): string
```

| 参数              | 类型                   | 默认值 | 说明                           |
| ----------------- | ---------------------- | ------ | ------------------------------ |
| `templateStrings` | `TemplateStringsArray` | -      | 标签模板用法时的模板字符串数组 |
| `...restArgs`     | `any[]`                | -      | 标签模板用法时的插值参数列表   |
