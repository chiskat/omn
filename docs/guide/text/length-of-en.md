# `lengthOfEn` <Badge type="tip" text="1.0.0" />

```typescript
import { lengthOfEn } from 'omn'
```

返回给定字符串的英文字符长度，即将中日韩文字（CJK）当做 2 个字符长度，默认也包括全角标点符号。

## 示例

```typescript
'你好'.length
// → 2

lengthOfEn('你好')
// → 4
```

对日文、韩文也生效：

```typescript
lengthOfEn('こんにちは')
// → 10

lengthOfEn('안녕하세요')
// → 10
```

默认将全角标点符号也当做 2 个字符长度；开启 `excludePunctuation` 配置项后，标点符号只占 1 个字符长度：

```typescript
// 默认
lengthOfEn('你好，世界！')
// → 12

// 开启 excludePunctuation
lengthOfEn('你好，世界！', { excludePunctuation: true })
// → 10
```

## API

```typescript
function lengthOfEn(input: string, options?: LengthOfEnOptions): number
```

| 参数      | 类型                | 默认值 | 说明         |
| --------- | ------------------- | ------ | ------------ |
| `input`   | `string`            | -      | 字符串输入   |
| `options` | `LengthOfEnOptions` | -      | 可选的配置项 |

### 配置项

```typescript
interface LengthOfEnOptions {
  excludePunctuation?: boolean
}
```

| 字段                 | 类型      | 默认值  | 说明                                          |
| -------------------- | --------- | ------- | --------------------------------------------- |
| `excludePunctuation` | `boolean` | `false` | 开启后，全角标点符号将不会被当做 2 个字符长度 |
