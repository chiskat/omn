# `toStartsWith` <Badge type="tip" text="1.0.0" />

```typescript
import { toStartsWith } from 'omn'
```

确保字符串以指定前缀开头；如果已经以该前缀开头则直接返回，否则添加前缀。

## 示例

```typescript
// 不以 "/" 开头时，自动添加
toStartsWith('hello', '/')
// → "/hello"

// 已经以 "/" 开头时，直接返回
toStartsWith('/hello', '/')
// → "/hello"
```

## API

```typescript
function toStartsWith(input: string, prefix: string): string
```

| 参数     | 类型     | 默认值 | 说明           |
| -------- | -------- | ------ | -------------- |
| `input`  | `string` | -      | 字符串输入     |
| `prefix` | `string` | -      | 期望的开头前缀 |
