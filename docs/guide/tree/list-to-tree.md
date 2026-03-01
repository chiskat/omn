# `listToTree` <Badge type="tip" text="1.0.0" />

```typescript
import { listToTree } from 'omn'
```

将数组转换为树形结构。

元素默认通过 `id` 和 `parentId` 字段建立父子关系，子节点默认字段名为 `children`；这些字段名均可以通过配置项来定制。

此函数是纯净的，会使用浅拷贝复制数组元素到树，因此原始元素上不会附加 `children` 字段；此行为可通过 `copy` 配置项来定制。

## 示例

```typescript
const list = [
  { id: 1, name: 'React' },
  { id: 2, name: 'Vue' },
  { id: 3, parentId: 1, name: 'AntD' },
  { id: 4, parentId: 1, name: 'Zustand' },
  { id: 5, parentId: 2, name: 'Element' },
  { id: 6, parentId: 2, name: 'Pinia' },
]

listToTree(list)
```

输出：

```typescript
tree = [
  {
    id: 1,
    name: 'React',
    children: [
      { id: 3, parentId: 1, name: 'AntD' },
      { id: 4, parentId: 1, name: 'Zustand' },
    ],
  },
  {
    id: 2,
    name: 'Vue',
    children: [
      { id: 5, parentId: 2, name: 'Element' },
      { id: 6, parentId: 2, name: 'Pinia' },
    ],
  },
]
```

---

自定义字段名：

```typescript
const list = [
  { uid: 'a', label: '前端' },
  { uid: 'b', label: '后端' },
  { uid: 'c', pid: 'a', label: 'React' },
  { uid: 'd', pid: 'b', label: 'Go' },
]

listToTree(list, {
  id: 'uid',
  parentId: 'pid',
  children: 'subItems',
})
```

输出：

```typescript
tree = [
  { uid: 'a', label: '前端', subItems: [{ uid: 'c', pid: 'a', label: 'React' }] },
  { uid: 'b', label: '后端', subItems: [{ uid: 'd', pid: 'b', label: 'Go' }] },
]
```

---

配置项 `id`、`parentId` 还可以指定为函数形式：

```typescript
listToTree(list, {
  id: node => node.uid,
  parentId: node => node.pid,
})
```

---

`copy` 配置项对比：

::: code-group

```typescript [copy: true（默认）]
const list = [
  { id: 1, name: 'root' },
  { id: 2, parentId: 1, name: 'child' },
]

const tree = listToTree(list, { copy: true })

console.log('children' in list[0])
// → false
// 原数组元素浅拷贝，不会被附加 "children" 字段
```

```typescript [copy: false]
const list = [
  { id: 1, name: 'root' },
  { id: 2, parentId: 1, name: 'child' },
]

const tree = listToTree(list, { copy: false })

console.log('children' in list[0])
// → true
// 原始数组中的对象会被修改，添加了 "children" 字段
```

```typescript [copy: 函数]
const list = [
  { id: 1, name: 'root' },
  { id: 2, parentId: 1, name: 'child' },
]

const tree = listToTree(list, { copy: node => ({ ...node, status: 'done' }) })

console.log('children' in list[0])
// → false
// copy 函数是浅拷贝，不会修改输入的数组元素

console.log('status' in tree[0])
// → ture
// copy 函数给数组节点添加了此字段
```

:::

## API

```typescript
function listToTree(input: any[], options?: ListToTreeOptions): TreeNode[]
```

| 参数      | 类型                | 默认值 | 说明           |
| --------- | ------------------- | ------ | -------------- |
| `input`   | `Array`             | -      | 输入数组       |
| `options` | `ListToTreeOptions` | -      | 可选的配置参数 |

### 配置项

```typescript
interface ListToTreeOptions {
  id?: string | ((input: any) => any)
  parentId?: string | ((input: any) => any)
  children?: string
  copy?: ((node: any) => any) | boolean
}
```

| 字段       | 类型                                 | 默认值       | 说明                                                                            |
| ---------- | ------------------------------------ | ------------ | ------------------------------------------------------------------------------- |
| `id`       | `string \| ((input: any) => string)` | `"id"`       | 元素标识键名，也可以是一个函数                                                  |
| `parentId` | `string \| ((input: any) => string)` | `"parentId"` | 父节点键名，也可以是一个函数                                                    |
| `children` | `string`                             | `"children"` | 组装树时子节点的键名                                                            |
| `copy`     | `boolean \| ((node: any) => any)`    | `true`       | 是否浅拷贝数组元素；设为 `false` 则关闭浅拷贝，也可以指定一个函数，用来转换节点 |
