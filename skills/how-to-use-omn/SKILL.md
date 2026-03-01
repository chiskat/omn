---
name: how-to-use-omn
description: omn 是一个 JavaScript 工具函数合集，它可以：组装/遍历/转换树形结构数据；管理以日/周/月为周期的函数触发；处理字符串/对象；等待/轮询/重试，还有很多独特的工具函数。
license: MIT
---

# 简介

`omn` 是一个提供独特和实用工具函数的 npm 库——就像 `lodash`、`ramda` 等库一样，但它提供了独一无二的功能。`omn` 提供 ES Module、CommonJS、UMD 格式的导出，自带 TypeScript 类型定义和完善的 JSDoc 文档，无副作用且支持 TreeShaking。

# 安装

```bash
npm add omn
```

# 函数列表

## 通用

- [`asList`](./references/common/as-list.md): 将非数组的输入转为数组，适合处理函数的参数
- [`highlightSplit`](./references/common/highlight-split.md): 处理文本关键字高亮，按高亮与否切分为片段对象
- [`isEnvOn`](./references/common/is-env-on.md): 判断环境变量是否开启，避免把 `"False"`、`"0"` 也当做开启
- [`noNull`](./references/common/no-null.md): 从对象里浅层或深层移除所有 `null` 字段，可避免解构赋默认值失败
- [`result`](./references/common/result.md): 将函数输入转为结果值，适合处理函数的参数
- [`retry`](./references/common/retry.md): 在满足给定条件前不断重试或轮询，可指定超时/次数/报错的限制
- [`sleep`](./references/common/sleep.md): 等待，一般用于模拟数据请求等耗时操作

## 杂项

- [`OmnError`](./references/misc/omn-error.md): 可用于判断某错误对象是否由 `omn` 抛出

## 周期触发

- [`daily`](./references/regular/daily.md): 仅浏览器可用，每日只会触发一次回调，可自定义何时重置
- [`monthly`](./references/regular/monthly.md): 仅浏览器可用，每月只会触发一次回调，可自定义何时重置
- [`regular`](./references/regular/regular.md): 自定义是否触发以及存储触发记录
- [`weekly`](./references/regular/weekly.md): 仅浏览器可用，每周只会触发一次回调，可自定义何时重置

## 文本

- [`encodeURIComponentFixed`](./references/text/encode-uri-component-fixed.md): 可以将 `!'()*` 转码
- [`formatPhoneNumber`](./references/text/format-phone-number.md): 格式化手机号码，例如用星号掩藏，或添加横杠
- [`lengthOfEn`](./references/text/length-of-en.md): 判断字符串长度，但中日韩（CJK）字符当做 2 个长度
- [`tagTemplate`](./references/text/tag-template.md): 保留缩进的同时移除多行文本开头和结尾的空格
- [`toEndsWith`](./references/text/to-ends-with.md): 确保字符串的尾缀，没有则加上
- [`toStartsWith`](./references/text/to-starts-with.md): 确保字符串的前缀，没有则加上

## 树形结构

- [`listToTree`](./references/tree/list-to-tree.md): 将数组组装成树结构
- [`mapTree`](./references/tree/map-tree.md): 对树结构的每个节点执行转换
- [`traverseTree`](./references/tree/traverse-tree.md): 遍历树结构的每个节点
