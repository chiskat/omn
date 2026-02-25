import { describe, expect, test } from 'vitest'

import { mapTree } from '../../../src'

describe(`mapTree`, () => {
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
    const result = mapTree(sampleTree as any, node => ({
      key: node.id,
      label: node.name,
    }))

    expect(result).toEqual([
      {
        key: 1,
        label: '根1',
        children: [
          { key: 2, label: '子1-1', children: [] },
          { key: 3, label: '子1-2', children: [{ key: 4, label: '孙1-2-1', children: [] }] },
        ],
      },
      { key: 5, label: '根2', children: [] },
    ])
  })

  test(`回调参数验证`, () => {
    const callbackArgs: Array<{ id: number; index: number; subTreeLength: number; level: number }> = []

    const simpleTree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]

    mapTree(simpleTree as any, (node, index, subTree, level) => {
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
    const tree = [{ id: 1, items: [{ id: 2 }, { id: 3 }] }]

    const result = mapTree(tree as any, node => ({ key: node.id }), { children: 'items' })

    expect(result).toEqual([
      {
        key: 1,
        items: [
          { key: 2, items: [] },
          { key: 3, items: [] },
        ],
      },
    ])
  })

  test(`自定义 newChildren 字段名`, () => {
    const tree = [{ id: 1, children: [{ id: 2 }] }]

    const result = mapTree(tree as any, node => ({ key: node.id }), { newChildren: 'items' })

    expect(result).toEqual([{ key: 1, items: [{ key: 2, items: [] }] }])
  })

  test(`叶子节点优先模式`, () => {
    const order: number[] = []
    const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }]

    mapTree(
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

    mapTree(
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
    expect(mapTree([], node => node)).toEqual([])
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => mapTree({})).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree()).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree(null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree('xxx')).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => mapTree([], null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree([], 'xxx')).toThrow()

    expect(() => mapTree([], n => n, { children: '' })).toThrow()
    expect(() => mapTree([], n => n, { children: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree([], n => n, { children: null })).toThrow()

    expect(() => mapTree([], n => n, { newChildren: '' })).toThrow()
    expect(() => mapTree([], n => n, { newChildren: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => mapTree([], n => n, { newChildren: null })).toThrow()

    // @ts-expect-error 测试错误传参
    expect(() => mapTree([], n => n, { start: 'invalid' })).toThrow()
  })
})
