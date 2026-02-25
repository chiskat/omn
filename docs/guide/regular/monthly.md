# `monthly` <Badge type="tip" text="1.0.0" /> <Badge type="warning" text="仅浏览器" />

```typescript
import { monthly } from 'omn'
```

以月为周期触发函数，例如 "每月仅展示一次活动弹窗" 这类需求。

::: warning 注意
此函数仅在浏览器环境中可用，依赖 `localStorage` 存储状态。
:::

## 示例

每月显示一次活动弹窗：

```typescript
monthly('monthlyNotice', showDialog)
```

默认在 **每月 1 日零点** 重置；可以自定义重置日，例如改为每月 5 日重置：

```typescript
monthly('monthlyNotice', showDialog, { resetDate: 5 })
```

配置参数 `resetDate` 支持负数，从月末倒数计算，例如 `-1` 表示每月最后一天：

```typescript
monthly('monthlyNotice', showDialog, { resetDate: -1 })
```

也可以同时自定义重置日和重置时刻：

```typescript
monthly('monthlyNotice', showDialog, {
  resetDate: 1, // 每月 1 号
  resetTime: '09:00:00', // 上午 9 点
})
```

当 `resetDate` 设为 `31`，但当月只有 30 天时，默认会将重置日视为当月最后一天；开启 `allowOutOfMonth` 后，则顺延到下个月的 31 日：

::: code-group

```typescript [默认行为]
// 当月只有 30 天时，视为当月最后一天（30 日）重置
monthly('monthlyNotice', showDialog, { resetDate: 31 })
```

```typescript [开启 allowOutOfMonth]
// 当月只有 30 天时，顺延到下个月的 31 日才重置
monthly('monthlyNotice', showDialog, {
  resetDate: 31,
  allowOutOfMonth: true, // [!code highlight]
})
```

:::

此函数会返回布尔值，表示本次调用是否触发：

```typescript
const triggered = monthly('monthlyNotice', showDialog)

if (triggered) {
  console.log('本次调用触发')
} else {
  console.log('本月已经触发过了，本次调用未触发')
}
```

## API

```typescript
function monthly(id: string, run: () => void, options?: MonthlyOptions): boolean
```

| 参数      | 类型             | 默认值 | 说明                          |
| --------- | ---------------- | ------ | ----------------------------- |
| `id`      | `string`         | -      | 唯一 ID，用于区分不同的触发器 |
| `run`     | `() => void`     | -      | 被触发时执行的函数            |
| `options` | `MonthlyOptions` | -      | 可选的配置项                  |

返回值为 `boolean`，表示本次调用是否触发了 `run` 函数。

### 配置项

```typescript
interface MonthlyOptions {
  resetDate?: number
  resetTime?: string
  allowOutOfMonth?: boolean
}
```

| 字段              | 类型      | 默认值       | 说明                                                                                                     |
| ----------------- | --------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| `resetDate`       | `number`  | `1`          | 每月的第几天重置；支持负数（`-1` 为最后一天，`-2` 为倒数第二天，以此类推）；若超出当月天数则视为最后一天 |
| `resetTime`       | `string`  | `'00:00:00'` | 重置的时刻，格式为 24 时制的 `"HH:mm:ss"`                                                                |
| `allowOutOfMonth` | `boolean` | `false`      | 允许 `resetDate` 超出当月天数时顺延到下月，而非视为当月最后一天                                          |
