import { clone } from 'lodash-es'

import { OmnError } from '../../misc/OmnError'

export interface ListToTreeOptions<Data = any, Children extends string = 'children'> {
  /** 元素标识属性的键，或是一个接受节点并返回标识符的函数，默认 `"id"`， */
  id?: string | ((input: Data) => any)

  /** 寻找父元素时使用的关联键，或是一个接受节点并返回父节点标识符的函数，默认 `"parentId"` */
  parentId?: string | ((input: Data) => any)

  /** 组装树时子孙节点使用的字段名，默认 `"children"` */
  children?: Children

  /**
   * 将数组元素组装为树时是否使用浅拷贝，默认为 `true`，这样可以避免在原数组元素上附加 `children` 字段
   *
   * 设为 `false` 则禁用浅拷贝；也可以提供一个自定义预处理函数，这样元素在被组装为树前会经由此函数处理
   */
  copy?: ((node: Data) => any) | boolean
}

/**
 * 将数组转为树
 *
 * @param input 输入的数组
 * @param options 可选的配置参数
 * @returns 输出的树
 * @example
 * listToTree([
 *   { id: 1, name: "React" },
 *   { id: 2, name: "Vue" },
 *   { id: 3, parentId: 1, name: "AntD" },
 *   { id: 4, parentId: 1, name: "Zustand" },
 *   { id: 5, parentId: 2, name: "Element" },
 *   { id: 6, parentId: 2, name: "Pinia" },
 * ])
 *
 * // 转为树 →
 * [
 *   {
 *     id: 1,
 *     name: "React",
 *     children: [
 *       { id: 3, parentId: 1, name: "AntD" },
 *       { id: 4, parentId: 1, name: "Zustand" }
 *     ]
 *   },
 *   {
 *     id: 2,
 *     name: "Vue",
 *     children: [
 *       { id: 5, parentId: 2, name: "Element" },
 *       { id: 6, parentId: 2, name: "Pinia" }
 *     ]
 *   }
 * ]
 */
export function listToTree<Data = any, Children extends string = 'children'>(
  input: Data[],
  options?: ListToTreeOptions<Data, Children>
): TreeNode<Data, Children>[] {
  const { id = 'id', parentId = 'parentId', children = 'children', copy = true } = options || {}

  if (!Array.isArray(input)) {
    throw new OmnError(listToTree.name, '仅支持数组输入。')
  } else if (typeof id === 'string' ? id.trim() === '' : typeof id !== 'function') {
    throw new OmnError(listToTree.name, '配置项 "id" 仅支持字符串或函数。')
  } else if (typeof parentId === 'string' ? parentId.trim() === '' : typeof parentId !== 'function') {
    throw new OmnError(listToTree.name, '配置项 "parentId" 仅支持字符串或函数。')
  } else if (typeof children !== 'string' || children.trim() === '') {
    throw new OmnError(listToTree.name, '配置项 "children" 仅支持字符串。')
  }

  if (typeof copy !== 'function' && typeof copy !== 'boolean') {
    throw new OmnError(listToTree.name, '配置项 "copy" 仅支持函数或布尔值。')
  }

  function getField(node: Data, field: string | ((input: Data) => any)) {
    if (typeof field === 'string') {
      return node[field]
    }

    return field(node)
  }

  function transformNode(node: Data) {
    if (typeof copy === 'function') {
      return copy(node)
    } else if (!copy) {
      return node
    }

    return clone(node)
  }

  const map = new Map()
  input.forEach(item => {
    map.set(getField(item, id), transformNode(item))
  })

  const tree: TreeNode<Data, Children>[] = []
  input.forEach(item => {
    const node = map.get(getField(item, id))
    const parentNode = map.get(getField(item, parentId))

    if (parentNode) {
      if (!parentNode[children]) {
        parentNode[children] = []
      }
      parentNode[children].push(node)
    } else {
      tree.push(node)
    }
  })
  map.clear()

  return tree
}

type TreeNode<Data, Children extends string> = Data & {
  [K in Children]?: TreeNode<Data, Children>[]
}
