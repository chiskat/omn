# AGENTS.md

> `omn` 项目开发指南 - 为 AI 编程助手提供项目上下文和开发规范。

# 项目背景

这是 `omn` 源代码仓库，它将以 `omn` 作为包名发布到 npm，它是一个类似于 `lodash` 的工具函数包。

核心特性：

- 提供独特和实用的工具函数，这意味着此工具提供的函数，在 `lodash` 等包中都是不常见到的
- 无副作用，支持 TreeShaking
- 更好的兼容性，提供 CommonJS、ESModule、UMD 等多种模块入口
- 完全 TypeScript 类型支持和完善的 JSDoc 注释
- 体积小，零依赖

# 快速开始

## 开发环境

- Node.js 22
- 包管理器必须使用 pnpm
- 编辑器推荐使用 VSCode，要求安装前端开发常用的扩展

## 安装依赖

```bash
pnpm i
```

## 常用开发命令

```bash
pnpm build        # 打包编译
pnpm test         # 使用 Vitest 对所有源码进行测试
pnpm test func    # 示例，对 func 函数进行测试
pnpm format       # 对 .ts 代码文件进行 Prettier 检查
pnpm lint         # 对 .ts 代码文件进行 ESLint 检查
pnpm check-types  # 对 .ts 代码文件进行 TypeScript 检查
pnpm docs:dev     # 启动 Vitepress 文档开发
pnpm docs:build   # 打包编译 Vitepress 文档
```

# 项目目录结构

```
omn/
├── docs/                     # Vitepress 文档
│   ├── .vitepress/           # Vitepress 配置目录
│   │   └── config.mts        # Vitepress 配置文件
├── src/                      # 源代码
│   ├── lib/                  # 工具函数库（各函数的实现）
│   ├── misc/                 # 杂项
│   └── index.ts              # 入口文件
├── tests/                    # 测试文件（结构与 src 对应）
├── .prettierrc               # Prettier 配置
├── eslint.config.mjs         # ESLint 配置
├── package.json              # 依赖与发布配置
├── pnpm-workspace.yaml       # pnpm 工作区配置
├── rollup.config.mjs         # Rollup 打包配置
├── tsconfig.json             # TypeScript 配置
└── vitest.config.mts         # Vitest 测试配置
```

# 开发规范

- 使用 TypeScript 开发，使用 Rollup 打包编译，使用 Vitest 运行测试，使用 Vitepress 生成文档
- 所有对外暴露的函数、参数（包括回调函数中的参数）、类型，都必须提供完整的 JSDoc 注释
- 所有对外暴露的函数，都必须有测试用例，测试用例要尽可能覆盖每种配置项
- 目录 `/tests` 下的测试用例文件，目录结构和 `/src` 下的源码需保持相同，文件名也相同，但测试文件额外添加 `.test` 后缀
- 所有 `.ts` 代码都需要通过 Prettier、ESLint、tsc 的检查

# 文档规范

## 目录结构：

- 工具函数的文档位于 `/docs/guide` 目录下，文档文件名和源码文件名相同，仅扩展名不同
- 如果源码在 `/src/*` 目录下，则文档应在 `/docs/guide/*` 目录下
- 如果源码是 `/src` 目录的直接子级，则文档应在 `/docs/guide/common` 目录下

## 文档内容规范

首行必须是一级标题，表明函数的名称，以及添加到库中的版本号。

例如：

```markdown
# `asList` <Badge type="tip" text="1.0.0" />
```

---

然后是函数的导入语法，使用 `import` 格式。

例如：

````markdown
```typescript
import { asList } from 'omn'
```
````

---

然后是一些函数的描述文本；有些需要着重强调的内容，请使用 Vitepress 的 “WARNING” 或 “TIP” 块。

---

然后是 “示例” 章节，使用二级标题，内容为函数的用法示例。可以参考函数源代码中 JSDoc 的 @example 部分，也可以原创一些贴近实际开发场景的例子。

例如：

````markdown
## 示例

```typescript
// 这部分内容是用法示例
```
````

如果这个函数的某个配置项有必要对照，则可以使用 Vitepress 的 `::: code-group` 代码组，把开启配置项和未开启配置项的两种代码放在组内，并利用 Vitepress 的行号高亮功能体现出二者区别。

---

然后是 “API” 章节，使用二级标题。

内容首先是函数签名和参数格式表格。

例如：

````markdown
## API

```typescript
function asList(input: T | T[] | ArrayLike<T>): T[]
```

| 参数    | 类型  | 默认值 | 说明 |
| ------- | ----- | ------ | ---- |
| `input` | `any` | -      | 输入 |
````

---

如果函数的返回值结构复杂，那么还需要加一个三级标题，名为 “返回值”，针对返回值的签名和字段格式再提供一个表格。

例如：

````markdown
### 返回值

```typescript
interface HighlightFragment {
  text: string
  highlight: boolean
}
```

| 字段        | 类型      | 说明               |
| ----------- | --------- | ------------------ |
| `text`      | `string`  | 字符串片段         |
| `highlight` | `boolean` | 是否匹配高亮关键词 |
````

---

如果函数有配置项，那么还需要加一个三级标题，名为 “配置项”，针对配置项的签名和字段格式再提供一个表格。

例如：

````markdown
### 配置项

```typescript
interface NoNullOptions {
  deep?: boolean
  ignoreFields?: string[]
}
```

| 字段           | 类型       | 默认值  | 说明                                   |
| -------------- | ---------- | ------- | -------------------------------------- |
| `deep`         | `boolean`  | `false` | 递归处理所有深层次字段                 |
| `ignoreFields` | `string[]` | -       | 跳过处理的字段名列表，支持深层字段名称 |
````
