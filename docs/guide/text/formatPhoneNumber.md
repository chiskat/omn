# `formatPhoneNumber` <Badge type="tip" text="1.0.0" />

```typescript
import { formatPhoneNumber } from 'omn'
```

按给出的模式格式化电话号码，使用占位符（默认为 `"x"`）表示一位电话号码数字，其他字符原样保留。

::: warning 注意
不支持带有区号、国家代号的电话号码，请在传入前先去除这些前缀。
:::

## 示例

```typescript
// 中国大陆常见格式
formatPhoneNumber('13712341234', 'xxx-xxxx-xxxx')
// → "137-1234-1234"

// 空格分隔格式
formatPhoneNumber('13712341234', 'xxxx xxx xxxx')
// → "1371 234 1234"

// 隐藏中间四位，脱敏展示
formatPhoneNumber('13712341234', 'xxx****xxxx')
// → "137****1234"
```

还支持 `paddingWith` 配置项，如果号码位数不足，使用此占位符补全：

```typescript
// 号码位数不足时，用 "$" 填充剩余占位符
formatPhoneNumber('137', 'xxx-xxxx-xxxx', { paddingWith: '$' })
// → "137-$$$$-$$$$"
```

如果字符串 `"x"` 有特殊用途，不可用于数字的占位符，可使用 `placeholder` 配置项重设：

```typescript
// 使用 "#" 作为占位符，"x" 将作为普通字符原样保留
formatPhoneNumber('13712341234', 'xxx: ###-####-####', { placeholder: '#' })
// → "xxx: 137-1234-1234"
```

## API

```typescript
function formatPhoneNumber(input: string, format: string, options?: FormatPhoneNumberOptions): string
```

| 参数      | 类型                       | 默认值 | 说明                                                          |
| --------- | -------------------------- | ------ | ------------------------------------------------------------- |
| `input`   | `string`                   | -      | 电话号码输入，必须为纯数字字符串                              |
| `format`  | `string`                   | -      | 模式字符串，其中 `"x"` 表示一位电话号码数字，其他字符原样输出 |
| `options` | `FormatPhoneNumberOptions` | -      | 可选配置项                                                    |

### 配置项

```typescript
interface FormatPhoneNumberOptions {
  placeholder?: string
  paddingWith?: string
}
```

| 字段          | 类型     | 默认值 | 说明                                                 |
| ------------- | -------- | ------ | ---------------------------------------------------- |
| `placeholder` | `string` | `"x"`  | `format` 参数中表示电话号码数字的占位符              |
| `paddingWith` | `string` | `""`   | 号码位数不足以占满所有占位符时，用此值填充剩余占位符 |
