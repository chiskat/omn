import { describe, expect, test } from 'vitest'

import { traverseTree } from '../../../src'

describe(`traverseTree`, () => {
  const sampleTree = [
    {
      id: 1,
      name: '根1',
      children: [
        { id: 2, name: '子1-1', children: [] },
        { id: 3, name: '子1-2', children: [{ id: 4, name: '孙1-2-1' }] },
      ],
    },
    { id: 5, name: '根2' },
  ]

  test(`基础用法`, () => {
    const visited: number[] = []

    traverseTree(sampleTree as any, node => {
      visited.push(node.id)
      return { key: node.id }
    })

    expect(visited).toEqual([1, 2, 3, 4, 5])
  })

  test(`回调参数验证`, () => {
    const callbackArgs: Array<{ id: number; index: number; subTreeLength: number; level: number }> = []

    const simpleTree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]

    traverseTree(simpleTree as any, (node, index, subTree, level) => {
      callbackArgs.push({
        id: node.id,
        index,
        subTreeLength: subTree.length,
        level,
      })
      return { id: node.id }
    })

    expect(callbackArgs).toEqual([
      { id: 1, index: 0, subTreeLength: 1, level: 0 },
      { id: 2, index: 0, subTreeLength: 2, level: 1 },
      { id: 3, index: 1, subTreeLength: 2, level: 1 },
    ])
  })

  test(`自定义 children 字段名`, () => {
    const visited: number[] = []
    const tree = [{ id: 1, items: [{ id: 2 }, { id: 3 }] }]

    traverseTree(
      tree as any,
      node => {
        visited.push(node.id)
        return { key: node.id }
      },
      { children: 'items' }
    )

    expect(visited).toEqual([1, 2, 3])
  })

  test(`叶子节点优先模式`, () => {
    const order: number[] = []
    const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }]

    traverseTree(
      tree as any,
      node => {
        order.push(node.id)
        return { id: node.id }
      },
      { start: 'leaf' }
    )

    // 从叶子节点开始，所以顺序是 3 -> 2 -> 1
    expect(order).toEqual([3, 2, 1])
  })

  test(`根节点优先模式`, () => {
    const order: number[] = []
    const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }]

    traverseTree(
      tree as any,
      node => {
        order.push(node.id)
        return { id: node.id }
      },
      { start: 'root' }
    )

    // 从根节点开始，所以顺序是 1 -> 2 -> 3
    expect(order).toEqual([1, 2, 3])
  })

  test(`空数组输入`, () => {
    const visited: any[] = []
    traverseTree([], node => {
      visited.push(node)
      return node
    })
    expect(visited).toEqual([])
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree({})).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree()).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree(null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree('xxx')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => traverseTree([], null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree([], 'xxx')).toThrow()

    expect(() => traverseTree([], n => n, { children: '' })).toThrow()
    expect(() => traverseTree([], n => n, { children: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree([], n => n, { children: null })).toThrow()

    expect(() => traverseTree([], n => n, { newChildren: '' })).toThrow()
    expect(() => traverseTree([], n => n, { newChildren: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => traverseTree([], n => n, { newChildren: null })).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => traverseTree([], n => n, { start: 'invalid' })).toThrow()
  })
})
