# `sleep` <Badge type="tip" text="1.0.0" />

```typescript
import { sleep } from 'omn'
```

等待指定的毫秒数，返回一个在等待结束后完成的 `Promise`。常用于模拟异步延迟、测试 loading 状态等场景。

## 示例

```typescript
// 等待 2 秒后继续执行
await sleep(2000)
console.log('2 秒后执行')
```

在异步函数中模拟接口延迟：

```typescript
async function fetchData() {
  await sleep(1000) // 模拟 1 秒网络延迟

  return { data: '...' }
}
```

在循环中逐步执行任务：

```typescript
for (const item of items) {
  await processItem(item)
  await sleep(500) // 每次处理间隔 500ms，避免请求过于频繁
}
```

## API

```typescript
function sleep(ms: number): Promise<void>
```

返回值是一个等待指定毫秒后自动完成的 `Promise`。

| 参数 | 类型     | 默认值 | 说明             |
| ---- | -------- | ------ | ---------------- |
| `ms` | `number` | -      | 需要等待的毫秒数 |
