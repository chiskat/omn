# `fromFormData` <Badge type="tip" text="1.3.0" />

```typescript
import { fromFormData } from 'omn'
```

将由 `toFormData` 生成的 `FormData` 还原为对象，保持原来的结构和数据。

可通过配置项的 `parse` 自定义反序列化函数，默认使用 `JSON.parse()`。

## 示例

基础用法：

```typescript
const formData = toFormData({ name: 'Ada', tags: ['math', 'code'] })
const data = fromFormData(formData)
```

可以使用 [SuperJSON](https://github.com/flightcontrolhq/superjson) 反序列化：

```typescript
import superjson from 'superjson'

const data = fromFormData(formData, {
  parse: superjson.parse, // [!code highlight]
})
```

## API

```typescript
function fromFormData<T extends Record<string, unknown> = Record<string, unknown>>(
  input: FormData,
  options?: FromFormDataOptions
): T
```

| 参数      | 类型                  | 默认值 | 说明                       |
| --------- | --------------------- | ------ | -------------------------- |
| `input`   | `FormData`            | -      | 由 `toFormData` 创建的数据 |
| `options` | `FromFormDataOptions` | -      | 可选的配置项               |

### 配置项

```typescript
interface FromFormDataOptions {
  metaField?: string
  parse?: (value: string) => unknown
}
```

| 字段        | 类型                         | 默认值           | 说明                   |
| ----------- | ---------------------------- | ---------------- | ---------------------- |
| `metaField` | `string`                     | `'__OMN_META__'` | 存放元数据的字段名     |
| `parse`     | `(value: string) => unknown` | `JSON.parse`     | 反序列化普通字段字符串 |
