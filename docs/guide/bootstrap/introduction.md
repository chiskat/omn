# 介绍

## 什么是 `omn`

<p style="display: flex; gap: 10px;">
  <a href="https://www.npmjs.com/package/omn"><img src="https://img.shields.io/npm/v/omn" alt="npm" /></a>
  <a href="https://npmcharts.com/compare/omn?minimal=true"><img src="https://img.shields.io/npm/dm/omn.svg?style=flat" alt="npm downloads" /></a>
  <a href="https://bundlejs.com/?q=omn"><img src="https://deno.bundlejs.com/badge?q=omn" alt="package size" /></a>
</p>

`omn` 是一个提供独特和实用工具函数的 npm 库——就像 `lodash`、`ramda` 等库一样，但它更贴近实际应用场景、更 “接地气”，也更现代化。

`omn` 提供的函数举例：

- `retry()` 用于轮询、错误重试，可配置完成条件、超时时间、重试上限、错误上限；
- `highlightSplit()` 可将字符串按规则切分为对象数组，适合 “搜索关键词高亮” 等场景；
- `listToTree()` 将数组组装为树，还可配置浅拷贝，避免修改原始元素。

## 核心特点

- 提供更独特更实用的工具函数；
- 无副作用，支持 TreeShaking；
- 更好的兼容性，提供 CommonJS、ESModule、UMD 等多种模块入口；
- 完全 TypeScript 类型支持和完善的 JSDoc 注释；
- 代码体积小，零依赖。

## 名称 `omn` 的由来

包名 `omn` 是 `omni` 的简写。<br />
`omni-` 是一个源自拉丁语的前缀，表示 “全能的”、“综合的” 等含义；这也是此工具的寓意，旨在提供丰富全能的函数工具帮助开发者解决问题。
