# `traverseTree` <Badge type="tip" text="1.0.0" />

```typescript
import { traverseTree } from 'omn'
```

遍历树，对每个节点调用回调函数。

与 `Array.prototype.forEach` 类似，但作用于树的每个节点。

::: tip 提示
此函数与 `mapTree` 类似，区别在于 `traverseTree` 仅用于遍历，不关心返回值；而 `mapTree` 会收集回调的返回值并组装成新树返回。
:::

## 示例

```typescript
const tree = [
  { id: 1, name: '首页' },
  {
    id: 2,
    name: '产品',
    children: [
      { id: 3, name: '手机' },
      { id: 4, name: '电脑' },
    ],
  },
]

traverseTree(tree, (node, index, subTree, level) => {
  console.log(`${'  '.repeat(level)}[${node.id}] ${node.name}`)
})
```

输出：

```
[1] 首页
[2] 产品
  [3] 手机
  [4] 电脑
```

## API

```typescript
function traverseTree<TreeNode>(input: TreeNode[], callback: Function, options?: TraverseTreeOptions): void
```

| 参数       | 类型                  | 默认值 | 说明           |
| ---------- | --------------------- | ------ | -------------- |
| `input`    | `Array`               | -      | 输入树         |
| `callback` | `Function`            | -      | 回调           |
| `options`  | `TraverseTreeOptions` | -      | 可选的配置参数 |

### 回调函数 `callback`

```typescript
function callback(node: TreeNode, indexOfSubTree: number, subTree: TreeNode[], level: number): void
```

| 参数             | 类型     | 说明                           |
| ---------------- | -------- | ------------------------------ |
| `node`           | `object` | 当前节点                       |
| `indexOfSubTree` | `number` | 此节点在同级兄弟节点中的索引号 |
| `subTree`        | `Array`  | 此节点所在层级的所有节点       |
| `level`          | `number` | 此节点的层级，从 `0` 开始递增  |

### 配置项

```typescript
interface TraverseTreeOptions {
  children?: string
  newChildren?: string
  start?: 'root' | 'leaf'
}
```

| 字段          | 类型               | 默认值        | 说明                                                         |
| ------------- | ------------------ | ------------- | ------------------------------------------------------------ |
| `children`    | `string`           | `"children"`  | 输入树中子节点使用的键名                                     |
| `newChildren` | `string`           | 同 `children` | 输出树中子节点使用的键名                                     |
| `start`       | `'root' \| 'leaf'` | `"root"`      | 遍历树的顺序，`"root"` 从根节点开始，`"leaf"` 从叶子节点开始 |
