# `shallow` <Badge type="tip" text="1.3.0" />

```typescript
import { shallow } from 'omn'
```

返回对象的浅拷贝，但仅包含浅层属性，排除嵌套对象的字段。

可通过配置项属性 `depth` 来保留更深层级的对象属性，默认为 `1`。

::: tip 提示
对于嵌套的非普通对象字段，例如 `Array`、`Date`、`Set`、`Map`、`RegExp`、类实例等，在超出深度时被排除，否则整体保留原引用，不会处理其内部属性或数组元素。

此函数仅处理自身可枚举的字符串属性。
:::

## 示例

常规用法，提取对象中的浅层属性：

```typescript
shallow({
  name: 'omn',
  value: 100,
  enabled: true,
  description: null,
  fields: { label: 'utils' },
  tags: ['utils'],
})

// → { name: 'omn', value: 100, enabled: true, description: null }
```

通过 `depth` 配置项保留更多层级的嵌套对象：

::: code-group

```typescript [默认深度]
shallow({
  name: 'omn',
  fields: { value: 100, nested: { enabled: true } },
})

// → { name: 'omn' }
```

```typescript [深度为 2]
shallow(
  {
    name: 'omn',
    fields: { value: 100, nested: { enabled: true } },
  },
  { depth: 2 } // [!code highlight]
)

// → { name: 'omn', fields: { value: 100 } } // [!code highlight]
```

```typescript [深度为 3]
shallow(
  {
    name: 'omn',
    fields: { value: 100, nested: { enabled: true } },
  },
  { depth: 3 } // [!code highlight]
)

// → { name: 'omn', fields: { value: 100, nested: { enabled: true } } } // [!code highlight]
```

:::

非普通对象按深度整体保留或排除，不会被递归处理：

```typescript
const tags = [{ name: 'utils', fields: { enabled: true } }]
const createdAt = new Date('2026-01-01')
const input = { name: 'omn', tags, fields: { createdAt, value: 100 } }

shallow(input)
// → { name: 'omn' }

const output = shallow(input, { depth: 2 })
// → { name: 'omn', tags, fields: { value: 100 } }
// tags 整体保留，包括其元素中的 fields；createdAt 超出深度，被排除

console.log(output.tags === tags) // → true

shallow(input, { depth: 3 })
// → { name: 'omn', tags, fields: { createdAt, value: 100 } }
```

## API

```typescript
function shallow<T extends object>(input: T, options?: ShallowOptions): Partial<T>
```

返回输入对象的浅拷贝，但仅包含浅层属性，排除嵌套对象的字段。

| 参数      | 类型             | 默认值 | 说明         |
| --------- | ---------------- | ------ | ------------ |
| `input`   | `T`              | -      | 普通对象输入 |
| `options` | `ShallowOptions` | -      | 可选的配置项 |

输入不是普通对象、配置项不是普通对象，或 `depth` 不是正整数时，抛出 `OmnError`。

### 配置项

```typescript
interface ShallowOptions {
  depth?: number
}
```

| 字段    | 类型     | 默认值 | 说明                                                    |
| ------- | -------- | ------ | ------------------------------------------------------- |
| `depth` | `number` | `1`    | 保留的对象层级深度，根对象为第 1 层，仅支持有限的正整数 |
