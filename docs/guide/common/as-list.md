# `asList` <Badge type="tip" text="1.0.0" />

```typescript
import { asList } from 'omn'
```

将输入转为数组格式，具体逻辑如下：

- 输入函数会先执行，用执行结果当做参数输入；
- 输入 `undefined` 时返回空数组 `[]`；
- 输入数组则直接返回，否则包装为单元素的数组返回；
- 自动处理 “Array-like 类数组” 格式，转为常规数组并返回。

::: warning 注意
不支持类似于 `Array.of()` 的多参数输入，检测到多个参数时，会直接抛出错误。
:::

## 示例

```typescript
asList(1)
// → [1]

asList([1])
// → [1]

asList()
// → []

asList('hi')
// → ['hi']

asList(null)
// → [null]

asList(() => [1])
// → [1]

asList({ length: 1, 0: 1 })
// → [1]
```

## API

```typescript
function asList(input: T | T[] | ArrayLike<T>): T[]
```

根据输入返回一个数组。

| 参数    | 类型  | 默认值 | 说明 |
| ------- | ----- | ------ | ---- |
| `input` | `any` | -      | 输入 |
