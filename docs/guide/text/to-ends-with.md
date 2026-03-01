# `toEndsWith` <Badge type="tip" text="1.0.0" />

```typescript
import { toEndsWith } from 'omn'
```

确保字符串以指定后缀结尾；如果已经以该后缀结尾则直接返回，否则添加后缀。

## 示例

```typescript
// 不以 "/" 结尾时，自动添加
toEndsWith('src', '/')
// → "src/"

// 已经以 "/" 结尾时，直接返回
toEndsWith('src/', '/')
// → "src/"
```

## API

```typescript
function toEndsWith(input: string, suffix: string): string
```

| 参数     | 类型     | 默认值 | 说明           |
| -------- | -------- | ------ | -------------- |
| `input`  | `string` | -      | 字符串输入     |
| `suffix` | `string` | -      | 期望的结尾后缀 |
