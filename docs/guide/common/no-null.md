# `noNull` <Badge type="tip" text="1.0.0" />

```typescript
import { noNull } from 'omn'
```

返回一个新对象，相比于原对象输入而言去除了值为 `null` 的**浅层**字段。

如果对象存在 `null` 值字段，解构时赋默认值的动作对于 `null` 值字段而言无效，这会导致后续代码中出现 NPE；使用此函数处理对象后，会移除所有 `null` 字段，避免上述情况的发生。

可通过配置项 `deep` 开启 “深度模式”，此时对深层嵌套的所有字段生效。

::: warning 注意
对数组和数组元素不起作用，即使开启了 `deep` 也一样。
:::

## 示例

常规用法：

```typescript
// 假设此数据来源于外部，例如后端接口或 SDK
// 其中 mode 被错误设置为了 null
const setting = { mode: null, theme: 'dark', size: null }

// 未使用 noNull 时
// 解构赋默认值时，如果 mode 字段为 null，赋默认值 "default" 会失败，后续将导致 NPE
const { mode = 'default' } = setting
console.log(mode) // → null，后续可能有 NPE 问题

// 使用 noNull 进行处理
// 此时即使 mode 字段被误设置为 null 也能正确赋默认值，避免 NPE
const { mode = 'default' } = noNull(setting)
console.log(mode) // → "default"
```

默认只处理浅层字段，可开启 `deep` 配置项递归处理所有深层次字段：

::: code-group

```typescript [常规模式]
noNull({
  name: null,
  value: 100,
  fields: { desc: null, addition: '' },
})

// →
{
  value: 100,
  fields: { desc: null, addition: '' },
}
```

```typescript [深度模式]
noNull(
  {
    name: null,
    value: 100,
    fields: { desc: null, addition: '' },
  },
  { deep: true } // [!code highlight]
)

// →
{
  value: 100,
  fields: { addition: '' }, // [!code highlight]
}
```

:::

默认对所有字段名起效，可通过 `ignoreFields` 配置项跳过对某些字段的处理：

```typescript
noNull(
  { name: null, value: 100, label: null },
  { ignoreFields: ['name'] }
)

// →
{ name: null, value: 100 }
```

## API

```typescript
function noNull<T extends object>(input: T, options?: NoNullOptions): T
```

返回值是已剔除值为 `null` 字段的对象。

| 参数      | 类型            | 默认值 | 说明         |
| --------- | --------------- | ------ | ------------ |
| `input`   | `object`        | -      | 对象输入     |
| `options` | `NoNullOptions` | -      | 可选的配置项 |

### 配置项

```typescript
interface NoNullOptions {
  deep?: boolean
  ignoreFields?: string[]
}
```

| 字段           | 类型       | 默认值  | 说明                                                 |
| -------------- | ---------- | ------- | ---------------------------------------------------- |
| `deep`         | `boolean`  | `false` | 递归处理所有深层次字段                               |
| `ignoreFields` | `string[]` | `[]`    | 跳过处理的字段名列表，对“深度模式”下的嵌套字段也起效 |
