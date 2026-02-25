# `regular` <Badge type="tip" text="1.0.0" />

```typescript
import { regular } from 'omn'
```

以自定义条件触发函数是否应触发；是 [`daily`](./daily)、[`weekly`](./weekly)、[`monthly`](./monthly) 等周期触发函数的基础。

通过 `shouldRun` 和 `recordRun` 两个配置项，可以完全自定义触发条件和触发记录逻辑，适合实现标准周期之外的特殊触发场景。

::: tip 提示
如果你的需求是按天、按周或按月触发，推荐直接使用 [`daily`](./daily)、[`weekly`](./weekly)、[`monthly`](./monthly)，它们已内置了状态存储逻辑，使用更简便。
:::

## 示例

实现一个"每次用户登录后仅触发一次新手引导"的逻辑，状态存储在自定义的后端接口中：

```typescript
regular(showOnboardingGuide, {
  shouldRun() {
    // 从自定义存储中判断是否应该触发
    return !localStorage.getItem('onboarding-done')
  },
  recordRun() {
    // 触发后记录状态
    localStorage.setItem('onboarding-done', '1')
  },
})
```

此函数会返回布尔值，表示本次调用是否触发：

```typescript
const triggered = regular(showOnboardingGuide, {
  shouldRun: () => !localStorage.getItem('onboarding-done'),
  recordRun: () => localStorage.setItem('onboarding-done', '1'),
})

if (triggered) {
  console.log('本次调用触发')
} else {
  console.log('条件不满足，本次调用未触发')
}
```

## API

```typescript
function regular(run: () => void, options: Required<RegularOptions>): boolean
```

| 参数      | 类型             | 默认值 | 说明               |
| --------- | ---------------- | ------ | ------------------ |
| `run`     | `() => void`     | -      | 被触发时执行的函数 |
| `options` | `RegularOptions` | -      | 配置项（必填）     |

返回值为 `boolean`，表示本次调用是否触发了 `run` 函数。

### 配置项

```typescript
interface RegularOptions {
  shouldRun(): boolean
  recordRun(): void
}
```

| 字段        | 类型            | 默认值 | 说明                                                              |
| ----------- | --------------- | ------ | ----------------------------------------------------------------- |
| `shouldRun` | `() => boolean` | -      | 判断本次是否应触发，返回 `true` 则触发，需与 `recordRun` 配套使用 |
| `recordRun` | `() => void`    | -      | 触发后记录状态的函数，每次触发后调用，需与 `shouldRun` 配套使用   |
