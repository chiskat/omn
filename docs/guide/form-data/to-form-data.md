# `toFormData` <Badge type="tip" text="1.3.0" />

```typescript
import { toFormData } from 'omn'
```

将对象转换为 `FormData`，自动处理其中的文件属性，即使处于数组或深层属性中；后续可通过 `fromFormData` 按原样还原回原始对象。

可通过配置项的 `stringify` 自定义序列化函数，默认使用 `JSON.stringify()`。

## 示例

基础用法：

```typescript
const formData = toFormData({ name: 'Ada', tags: ['math', 'code'] })
```

可以使用 [SuperJSON](https://github.com/flightcontrolhq/superjson) 序列化非文件字段：

```typescript
import superjson from 'superjson'

const formData = toFormData(
  { name: 'Ada', createdAt: new Date('2025-01-01T00:00:00.000Z') },
  { stringify: superjson.stringify } // [!code highlight]
)
```

## API

```typescript
function toFormData(input: Record<string, unknown>, options?: ToFormDataOptions): FormData
```

| 参数      | 类型                      | 默认值 | 说明             |
| --------- | ------------------------- | ------ | ---------------- |
| `input`   | `Record<string, unknown>` | -      | 要转换的普通对象 |
| `options` | `ToFormDataOptions`       | -      | 可选的配置项     |

### 配置项

```typescript
interface ToFormDataOptions {
  metaField?: string
  stringify?: (value: unknown) => string
}
```

| 字段        | 类型                         | 默认值           | 说明                       |
| ----------- | ---------------------------- | ---------------- | -------------------------- |
| `metaField` | `string`                     | `'__OMN_META__'` | 存放元数据的字段名         |
| `stringify` | `(value: unknown) => string` | `JSON.stringify` | 将普通字段值序列化为字符串 |
