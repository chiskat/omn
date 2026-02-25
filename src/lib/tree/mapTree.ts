import { OmnError } from '../../misc/OmnError'

export interface MapTreeOptions<Children extends string = 'children', NewChildren extends string = Children> {
  /** 子节点使用的字段名，默认 `"children"` */
  children?: Children

  /** 新树子节点使用的字段名，默认和 `children` 保持一直 */
  newChildren?: NewChildren

  /** 从根节点（`"root"`）开始应用回调，还是从叶子节点（`"leaf"`）开始应用回调，默认从根节点 */
  start?: 'root' | 'leaf'
}

/**
 * 转换树，每个节点都使用回调的返回值
 *
 * @param input 输入树
 * @param callback 对每个树节点调用之，返回值取代原本的节点
 * @param options 可选的配置参数
 * @returns 转换后的树
 * @see traverseTree
 */
export function mapTree<
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
  options?: MapTreeOptions<Children, NewChildren>
): TreeNode<MapResult, NewChildren>[] {
  if (!Array.isArray(input)) {
    throw new OmnError(mapTree.name, '仅支持数组输入。')
  } else if (typeof callback !== 'function') {
    throw new OmnError(mapTree.name, '回调函数类型错误。')
  }

  const rawChildren = options?.children
  const rawNewChildren = options?.newChildren
  const rawStart = options?.start

  if (rawChildren !== undefined && (typeof rawChildren !== 'string' || rawChildren.trim() === '')) {
    throw new OmnError(mapTree.name, '配置项 "children" 仅支持非空字符串。')
  } else if (rawNewChildren !== undefined && (typeof rawNewChildren !== 'string' || rawNewChildren.trim() === '')) {
    throw new OmnError(mapTree.name, '配置项 "newChildren" 仅支持非空字符串。')
  } else if (rawStart !== undefined && !['root', 'leaf'].includes(rawStart)) {
    throw new OmnError(mapTree.name, '配置项 "start" 仅支持留空/"root"/"leaf"。')
  }

  const children = (rawChildren || 'children') as Children
  const newChildren = (rawNewChildren || children) as NewChildren
  const start = rawStart || 'root'

  function handleTreeNode(
    node: TreeNode<Data, Children>,
    indexOfSubTree: number,
    subTree: TreeNode<Data, Children>[],
    level: number
  ): TreeNode<MapResult, NewChildren> {
    let mappedChildren: TreeNode<MapResult, NewChildren>[] = []

    if (node[children] && start !== 'root') {
      mappedChildren = node[children].map((item, index, nodes) => handleTreeNode(item, index, nodes, level + 1))
    }
    const newNode = callback(node, indexOfSubTree, subTree, level) as any
    if (node[children] && start === 'root') {
      mappedChildren = node[children].map((item, index, nodes) => handleTreeNode(item, index, nodes, level + 1))
    }
    newNode[newChildren] = mappedChildren

    return newNode as TreeNode<MapResult, NewChildren>
  }

  return input.map((item, index, nodes) => handleTreeNode(item, index, nodes, 0))
}

type TreeNode<Data, Children extends string> = Data & {
  [K in Children]?: TreeNode<Data, Children>[]
}
