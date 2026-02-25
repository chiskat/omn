# `daily` <Badge type="tip" text="1.0.0" /> <Badge type="warning" text="仅浏览器" />

```typescript
import { daily } from 'omn'
```

以天为周期触发函数，例如 “每天仅展示一次开屏广告” 这类需求。

::: warning 注意
此函数仅在浏览器环境中可用，依赖 `localStorage` 存储状态。
:::

## 示例

每天显示一次广告弹窗：

```typescript
daily('dailyAds', showAdsDialog)
```

默认在 **每日零点** 重置；可以自定义重置时刻，例如改为每天凌晨 4 点重置：

```typescript
daily('dailyAds', showAdsDialog, { resetTime: '04:00:00' })
```

此函数会返回布尔值，表示本次调用是否触发：

```typescript
const triggered = daily('dailyAds', showAdsDialog)

if (triggered) {
  console.log('本次调用触发')
} else {
  console.log('今天已经触发过了，本次调用未触发')
}
```

## API

```typescript
function daily(id: string, run: () => void, options?: DailyOptions): boolean
```

| 参数      | 类型           | 默认值 | 说明                          |
| --------- | -------------- | ------ | ----------------------------- |
| `id`      | `string`       | -      | 唯一 ID，用于区分不同的触发器 |
| `run`     | `() => void`   | -      | 被触发时执行的函数            |
| `options` | `DailyOptions` | -      | 可选的配置项                  |

返回值为 `boolean`，表示本次调用是否触发了 `run` 函数。

### 配置项

```typescript
interface DailyOptions {
  resetTime?: string
}
```

| 字段        | 类型     | 默认值       | 说明                                      |
| ----------- | -------- | ------------ | ----------------------------------------- |
| `resetTime` | `string` | `'00:00:00'` | 重置的时刻，格式为 24 时制的 `"HH:mm:ss"` |
