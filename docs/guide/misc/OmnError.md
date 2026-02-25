# `OmnError` <Badge type="tip" text="1.0.0" />

```typescript
import { OmnError } from 'omn'
```

`OmnError` 是 `omn` 库内部使用的自定义错误类，继承自原生 `Error`，提供错误链 `cause` 支持，便于追踪错误来源。

::: tip
`OmnError` 的错误消息格式为 `omn: <lib>: <message>`，其中 `lib` 表示抛出错误的模块名称。
:::

## 示例

```typescript
const err = new OmnError('myLib', '参数无效')

console.log(err.message)
// → "omn: myLib: 参数无效"
```

判断是否为 `OmnError` 实例：

```typescript
if (OmnError.isOmnError(e)) {
  // ...
}
```

## API

```typescript
function constructor(lib: string, message: string, options?: OmnErrorOptions)
```

| 参数      | 类型              | 默认值 | 说明               |
| --------- | ----------------- | ------ | ------------------ |
| `lib`     | `string`          | -      | 抛出错误的模块名称 |
| `message` | `string`          | -      | 错误描述信息       |
| `options` | `OmnErrorOptions` | -      | 可选配置项         |

---

```typescript
function OmnError.isOmnError(e: any): boolean
```

返回一个布尔值，表示输入是否是 `OmnError` 实例。

| 参数 | 类型  | 默认值 | 说明     |
| ---- | ----- | ------ | -------- |
| `e`  | `any` | -      | 错误对象 |

### 配置项

```typescript
interface OmnErrorOptions {
  cause?: Error
}
```

| 字段    | 类型    | 默认值 | 说明     |
| ------- | ------- | ------ | -------- |
| `cause` | `Error` | -      | 原始错误 |
