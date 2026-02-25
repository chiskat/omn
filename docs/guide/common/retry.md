# `retry` <Badge type="tip" text="1.0.0" />

```typescript
import { retry } from 'omn'
```

重试/轮询执行函数。

配置项全面，可指定结束条件、执行间隔、超时时间、最大执行次数、最大报错次数等；可用于轮询、错误重试、循环执行等多种场景。

此函数的返回值是一个对象，包含了最终结果、执行轮次、每一次的结果等；如果执行最终失败，还会包含错误原因。

::: tip 提示
`retry` 默认使用 `Boolean` 作为成功判断函数，即只要函数返回值为 Truthy 就视为成功。<br />
如需自定义判断逻辑，请通过 `success` 配置项传入自定义函数。
:::

::: warning 注意
`timeout` 和 `maxRounds` 均默认为 `0`（无限制）。若不设置任何终止条件，且 `success` 函数始终返回 `false`，则会导致无限循环。
:::

## 示例

轮询接口，等待任务完成：

```typescript
const result = await retry(() => axios.get('/api/task/status'), {
  timeout: 30 * 1000,
  interval: 1000,
  success: res => res.data.status === 'done',
})

if (result.success) {
  console.log('任务完成，结果：', result.data)
} else {
  console.log('轮询失败，原因：', result.reason)
}
```

---

默认情况下，函数一旦抛出错误，立即终止并返回 `reason: "error"`；<br />
设置 `maxErrors` 可以允许一定次数的报错；设置为 `-1` 则允许无限次报错，报错不再会中断重试。。

例如，最多出错重试 3 次：

```typescript
const result = await retry(fetchData, {
  maxErrors: 3, // [!code highlight]
  interval: 500,
})
```

---

默认情况下，重试会无限次进行下去；<br />
设置 `maxRounds` 可以指定最大的重试次数，次数超出时，立即终止并返回 `reason: "maxRounds"`。

限制最大执行次数：

```typescript
const result = await retry(fetchData, {
  maxRounds: 5, // [!code highlight]
  interval: 500,
})
```

## API

```typescript
function retry<T>(func: () => T | Promise<T>, options?: RetryOptions): Promise<RetryResult<T>>
```

| 参数      | 类型                    | 默认值 | 说明                       |
| --------- | ----------------------- | ------ | -------------------------- |
| `func`    | `() => T \| Promise<T>` | -      | 被轮询执行的异步或同步函数 |
| `options` | `RetryOptions`          | -      | 可选的配置参数             |

### 返回值

```typescript
interface RetryResult<T> {
  success: boolean
  data?: T
  error?: Error
  reason?: 'timeout' | 'maxRounds' | 'error' | 'maxErrors'
  rounds: number
  history: any[]
}
```

| 字段      | 类型                                                 | 说明                                                                                                                  |
| --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `success` | `boolean`                                            | 轮询最终是否成功                                                                                                      |
| `data`    | `T`                                                  | 轮询结果，仅在成功时有值                                                                                              |
| `error`   | `Error`                                              | 函数抛出的错误，仅在因报错终止时有值                                                                                  |
| `reason`  | `'timeout' \| 'maxRounds' \| 'error' \| 'maxErrors'` | 失败原因，成功时为空；取值如下： `timeout` 超时、`maxRounds` 超出次数、`error` 函数报错、`maxErrors` 超出容许报错次数 |
| `rounds`  | `number`                                             | 实际执行的总次数                                                                                                      |
| `history` | `any[]`                                              | 每一次执行的结果；若配置了 `maxErrors`，数组中可能包含错误对象                                                        |

### 配置项

```typescript
interface RetryOptions {
  interval?: number
  timeout?: number
  maxRounds?: number
  maxErrors?: number
  success?: (result: any) => boolean
}
```

| 字段        | 类型                       | 默认值    | 说明                                                      |
| ----------- | -------------------------- | --------- | --------------------------------------------------------- |
| `interval`  | `number`                   | `0`       | 每两次执行之间的间隔时间（毫秒）                          |
| `timeout`   | `number`                   | `0`       | 超时时间（毫秒），设置为 `0` 则为无限时                   |
| `maxRounds` | `number`                   | `0`       | 最大尝试次数，设置为 `0` 则为无限次                       |
| `maxErrors` | `number`                   | `0`       | 容许的最大报错次数，`0` 表示不容许报错，`-1` 表示不限次数 |
| `success`   | `(result: any) => boolean` | `Boolean` | 根据上次运行结果判断是否成功的函数                        |
