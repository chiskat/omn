# `result` <Badge type="tip" text="1.0.0" />

```typescript
import { result } from 'omn'
```

接受值或函数输入：如果是值输入，直接返回；如果是函数，执行并返回结果。

在开发工具函数或封装 API 时，经常需要支持 “值或函数” 两种形式的参数输入，使用 `result` 可以统一处理这两种情况，避免重复的 `typeof` 判断。

## 示例

```typescript
// 曾经
const input = typeof options.input === 'function'
  ? options.input()
  : options.input

// 现在，使用 result
const input = result(options.input)
```

## API

```typescript
function result<T>(input: T | (() => T)): T
```

| 参数    | 类型             | 默认值 | 说明                     |
| ------- | ---------------- | ------ | ------------------------ |
| `input` | `T \| (() => T)` | -      | 输入值或一个返回值的函数 |
