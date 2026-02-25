# `isEnvOn` <Badge type="tip" text="1.0.0" />

```typescript
import { isEnvOn } from 'omn'
```

适用于将环境变量作为输入，判断标志位是否开启。

因为 `process.env` 上的变量值均为字符串格式，用 `if` 来判断是始终为 `true` 的；且有人喜欢使用 `true`，有人喜欢使用 `1`，判断条件会比较复杂；此函数则专为此场景而设计，内置了以上各种判断逻辑，直接返回布尔结果。

可通过配置项 `strict` 开启 “严格模式”，避免预期以外的输入。

::: tip 提示
视为开启的值输入：`true`、`"true"`、`"True"`、`"TRUE"`、`1`、`"1"`、`"on"`、`"On"`、`"ON"`；<br />
其他输入均视为关闭。

如果已开启严格模式，则视为关闭的值输入必须为：`false`、`"false"`、`"False"`、`"FALSE"`、`0`、`"0"`、`"off"`、`"Off"`、`"OFF"`、`null`、`"null"`、`undefined`、`"undefined"`；<br />
严格模式下，以上所有输入以外的输入会抛出错误。
:::

## 示例

```typescript
const isDisableTelemetry = isEnvOn(process.env.DISABLE_TELEMETRY)
```

## API

```typescript
function isEnvOn(input: any, options?: IsEnvOnOptions): boolean
```

| 参数             | 类型  | 默认值       | 说明 |
| ---------------- | ----- | ------------ | ---- |
| `input`          | `any` | -            | 输入 |
| `IsEnvOnOptions` | -     | 可选的配置项 |

### 配置项

```typescript
interface IsEnvOnOptions {
  strict?: boolean
}
```

| 字段     | 类型      | 默认值  | 说明                                            |
| -------- | --------- | ------- | ----------------------------------------------- |
| `strict` | `boolean` | `false` | “严格模式” 开关，开启后对预期以外的输入抛出错误 |
