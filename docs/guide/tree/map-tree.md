# `mapTree` <Badge type="tip" text="1.0.0" />

```typescript
import { mapTree } from 'omn'
```

转换树，对每个节点调用回调函数，并以回调的返回值替换原节点。

与 `Array.prototype.map` 类似，但作用于树的每个节点，最终返回一棵结构相同、节点已被替换的新树。

::: tip 提示
此函数与 `traverseTree` 类似，区别在于 `mapTree` 会收集回调的返回值并组装成新树返回，而 `traverseTree` 仅用于遍历，不关心返回值。
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

mapTree(tree, node => ({
  ...node,
  label: `[${node.id}] ${node.name}`,
  isLeaf: !node.children?.length,
}))
```

输出：

```typescript
output = [
  { id: 1, name: '首页', label: '[1] 首页', isLeaf: true },
  {
    id: 2,
    name: '产品',
    label: '[2] 产品',
    isLeaf: false,
    children: [
      { id: 3, name: '手机', label: '[3] 手机', isLeaf: true },
      { id: 4, name: '电脑', label: '[4] 电脑', isLeaf: true },
    ],
  },
]
```

## API

```typescript
function mapTree<TreeNode>(input: TreeNode[], callback: Function, options?: MapTreeOptions): TreeNode[]
```

| 参数       | 类型             | 默认值 | 说明           |
| ---------- | ---------------- | ------ | -------------- |
| `input`    | `Array`          | -      | 输入树         |
| `callback` | `Function`       | -      | 回调           |
| `options`  | `MapTreeOptions` | -      | 可选的配置参数 |

### 回调函数 `callback`

```typescript
function callback(node: TreeNode, indexOfSubTree: number, subTree: TreeNode[], level: number): TreeNode
```

| 参数             | 类型     | 说明                           |
| ---------------- | -------- | ------------------------------ |
| `node`           | `object` | 当前节点                       |
| `indexOfSubTree` | `number` | 此节点在同级兄弟节点中的索引号 |
| `subTree`        | `Array`  | 此节点所在层级的所有节点       |
| `level`          | `number` | 此节点的层级，从 `0` 开始递增  |

### 配置项

```typescript
interface MapTreeOptions {
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
