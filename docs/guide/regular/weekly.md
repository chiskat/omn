# `weekly` <Badge type="tip" text="1.0.0" /> <Badge type="warning" text="仅浏览器" />

```typescript
import { weekly } from 'omn'
```

以星期为周期触发函数，例如 "每周仅展示一次活动弹窗" 这类需求。

::: warning 注意
此函数仅在浏览器环境中可用，依赖 `localStorage` 存储状态。
:::

## 示例

每周显示一次活动弹窗：

```typescript
weekly('weeklyTips', showTipsDialog)
```

默认在 **每周日零点** 重置；可以自定义重置日，例如改为每周六重置：

```typescript
weekly('weeklyTips', showTipsDialog, { resetDayOfWeek: 6 })
```

也可以同时自定义重置日和重置时刻：

```typescript
weekly('weeklyTips', showTipsDialog, {
  resetDayOfWeek: 1, // 每周一
  resetTime: '09:00:00', // 上午 9 点
})
```

此函数会返回布尔值，表示本次调用是否触发：

```typescript
const triggered = weekly('weeklyTips', showTipsDialog)

if (triggered) {
  console.log('本次调用触发')
} else {
  console.log('本周已经触发过了，本次调用未触发')
}
```

## API

```typescript
function weekly(id: string, run: () => void, options?: WeeklyOptions): boolean
```

| 参数      | 类型            | 默认值 | 说明                          |
| --------- | --------------- | ------ | ----------------------------- |
| `id`      | `string`        | -      | 唯一 ID，用于区分不同的触发器 |
| `run`     | `() => void`    | -      | 被触发时执行的函数            |
| `options` | `WeeklyOptions` | -      | 可选的配置项                  |

返回值为 `boolean`，表示本次调用是否触发了 `run` 函数。

### 配置项

```typescript
interface WeeklyOptions {
  resetDayOfWeek?: number
  resetTime?: string
}
```

| 字段             | 类型     | 默认值       | 说明                                                                 |
| ---------------- | -------- | ------------ | -------------------------------------------------------------------- |
| `resetDayOfWeek` | `number` | `0`          | 每周的第几天重置，`0` 表示周日，`1` 表示周一，以此类推，最大值为 `6` |
| `resetTime`      | `string` | `'00:00:00'` | 重置的时刻，格式为 24 时制的 `"HH:mm:ss"`                            |
