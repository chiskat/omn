import { describe, expect, test } from 'vitest'

import { listToTree } from '../../../src'

describe(`listToTree`, () => {
  test(`基础用法`, () => {
    const list = [
      { id: 1, parentId: null, name: '根' },
      { id: 2, parentId: 1, name: '子1' },
      { id: 3, parentId: 1, name: '子2' },
    ]

    const result = listToTree(list)
    expect(result).toEqual([
      {
        id: 1,
        parentId: null,
        name: '根',
        children: [
          { id: 2, parentId: 1, name: '子1' },
          { id: 3, parentId: 1, name: '子2' },
        ],
      },
    ])
    expect(result[0]).toMatchObject(list[0])
    expect(result[0]).not.toBe(list[0])
  })

  test(`自定义键`, () => {
    const list = [
      { key: 1, parentKey: null, name: '根' },
      { key: 2, parentKey: 1, name: '子1' },
      { key: 3, parentKey: 1, name: '子2' },
    ]

    const result = listToTree(list, {
      id: 'key',
      parentId: 'parentKey',
      children: 'subList',
    })

    expect(result).toMatchObject([
      {
        key: 1,
        parentKey: null,
        name: '根',
        subList: [
          { key: 2, parentKey: 1, name: '子1' },
          { key: 3, parentKey: 1, name: '子2' },
        ],
      },
    ])
    expect(result[0]).toMatchObject(list[0])
    expect(result[0]).not.toBe(list[0])
  })

  test(`自定义键函数`, () => {
    const rootNode = { id: 1, parent: null, name: '根' }
    const child1 = { id: 2, parent: rootNode, name: '子1' }
    const child2 = { id: 3, parent: rootNode, name: '子2' }
    const list = [child1, child2, rootNode]

    const result = listToTree(list, {
      id: node => node,
      parentId: node => node.parent,
    })

    expect(result[0]).toMatchObject(rootNode)
    expect(result[0]?.children?.[0]).toMatchObject(child1)
  })

  test(`非浅拷贝模式`, () => {
    const list = [
      { id: 1, parentId: null, name: '根' },
      { id: 2, parentId: 1, name: '子1' },
      { id: 3, parentId: 1, name: '子2' },
    ]

    const result = listToTree(list, { copy: false })

    expect(result).toMatchObject([
      {
        id: 1,
        parentId: null,
        name: '根',
        children: [
          { id: 2, parentId: 1, name: '子1' },
          { id: 3, parentId: 1, name: '子2' },
        ],
      },
    ])
    expect(result[0]).toBe(list[0])
    expect(result[0].children?.[0]).toBe((list[0] as any).children?.[0])
  })

  test(`节点转换`, () => {
    const list = [
      { id: 1, parentId: null, name: '根' },
      { id: 2, parentId: 1, name: '子1' },
      { id: 3, parentId: 1, name: '子2' },
    ]

    const result = listToTree(list, {
      copy(node) {
        return { ...node, addField: 1 }
      },
    })

    expect(result).toMatchObject([
      {
        id: 1,
        parentId: null,
        name: '根',
        addField: 1,
        children: [
          { id: 2, parentId: 1, name: '子1', addField: 1 },
          { id: 3, parentId: 1, name: '子2', addField: 1 },
        ],
      },
    ])
    expect(result[0]).toMatchObject(list[0])
    expect(result[0]).not.toBe(list[0])
  })

  test(`空数组输入`, () => {
    expect(listToTree([])).toEqual([])
  })

  test(`错误输入`, () => {
    // @ts-expect-error 测试错误传参
    expect(() => listToTree({})).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree()).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree(null)).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree('xxx')).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree(111)).toThrow()

    expect(() => listToTree([], { id: '' })).toThrow()
    expect(() => listToTree([], { id: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { id: null })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { id: [] })).toThrow()

    expect(() => listToTree([], { parentId: '' })).toThrow()
    expect(() => listToTree([], { parentId: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { parentId: [] })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { parentId: null })).toThrow()

    expect(() => listToTree([], { children: '' })).toThrow()
    expect(() => listToTree([], { children: '  ' })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { children: null })).toThrow()
    // @ts-expect-error 测试错误传参
    expect(() => listToTree([], { children: () => {} })).toThrow()
  })
})
