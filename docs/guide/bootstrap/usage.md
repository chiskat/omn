# 快速上手

## 安装

::: code-group

```sh [npm]
npm add omn
```

```sh [pnpm]
pnpm add omn
```

```sh [yarn]
yarn add omn
```

```sh [bun]
bun add omn
```

:::

## 通过 CDN 引入

::: code-group

```html [unpkg]
<script src="https://unpkg.com/omn@__PKG_VERSION__"></script>
```

```html [jsdelivr]
<script src="https://cdn.jsdelivr.net/npm/omn@__PKG_VERSION__"></script>
```

:::

导入后，通过全局变量 `omn` 来访问。

::: tip 版本兼容性

通过 `<script>` 标签引入时，建议加上 `@版本号`，通常建议精确到第二位。

`omn` 在相同 Major 版本号下保持 API 兼容性；在相同 Minor 版本号下不会新增功能；Patch 版本号的变更只包含 bug 修复和文档更新。

:::
