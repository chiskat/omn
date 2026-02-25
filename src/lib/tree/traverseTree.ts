import { OmnError } from '../../misc/OmnError'
import { mapTree } from './mapTree'

export interface TraverseTreeOptions<Children extends string = 'children', NewChildren extends string = Children> {
  /** 子节点使用的字段名，默认 `"children"` */
  children?: Children

  /** 新树子节点使用的字段名，默认和 `children` 保持一直 */
  newChildren?: NewChildren

  /** 从根节点（`"root"`）开始应用回调，还是从叶子节点（`"leaf"`）开始应用回调，默认从根节点 */
  start?: 'root' | 'leaf'
}

/**
 * 遍历树，执行回调
 *
 * @param input 输入树
 * @param callback 要对每个节点调用的回调
 * @param options 可选的配置参数
 * @see mapTree
 */
export function traverseTree<
  MapResult extends object,
  Data = any,
  Children extends string = 'children',
  NewChildren extends string = Children,
>(
  input: TreeNode<Data, Children>[],
  callback: (
    /** 当前节点 */
    node: TreeNode<Data, Children>,

    /** 此节点在同级兄弟节点中的索引号 */
    indexOfSubTree: number,

    /** 此树节点所在的层级的所有节点 */
    subTree: TreeNode<Data, Children>[],

    /** 此节点的层级，从 `0` 开始递增 */
    level: number
  ) => MapResult,
  options?: TraverseTreeOptions<Children, NewChildren>
): void {
  if (!Array.isArray(input)) {
    throw new OmnError(traverseTree.name, '仅支持数组输入。')
  } else if (typeof callback !== 'function') {
    throw new OmnError(traverseTree.name, '回调函数类型错误。')
  }

  const children = options?.children
  const newChildren = options?.newChildren
  const start = options?.start

  if (children !== undefined && (typeof children !== 'string' || children.trim() === '')) {
    throw new OmnError(traverseTree.name, '配置项 "children" 仅支持非空字符串。')
  } else if (newChildren !== undefined && (typeof newChildren !== 'string' || newChildren.trim() === '')) {
    throw new OmnError(traverseTree.name, '配置项 "newChildren" 仅支持非空字符串。')
  } else if (start !== undefined && !['root', 'leaf'].includes(start)) {
    throw new OmnError(traverseTree.name, '配置项 "start" 仅支持留空或 "root" 或 "leaf"。')
  }

  const traverseCallback = (
    node: TreeNode<Data, Children>,
    indexOfSubTree: number,
    subTree: TreeNode<Data, Children>[],
    level: number
  ) => {
    callback(node, indexOfSubTree, subTree, level)
    return node
  }

  mapTree(input, traverseCallback, options)
}

type TreeNode<Data, Children extends string> = Data & {
  [K in Children]?: TreeNode<Data, Children>[]
}
