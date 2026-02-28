# Omn

[![npm](https://img.shields.io/npm/v/omn)](https://www.npmjs.com/package/omn)
[![npm downloads](https://img.shields.io/npm/dm/omn.svg?style=flat)](https://npmcharts.com/compare/omn?minimal=true)
[![package size](https://deno.bundlejs.com/badge?q=omn)](https://bundlejs.com/?q=omn)

`omn` 是一个提供独特和实用工具函数的 npm 库——就像 `lodash`、`ramda` 等库一样，但它更贴近实际应用场景、更 “接地气”，也更现代化。

# 文档

[在线文档](https://omn.paperplane.cc)

# 亮点

- 提供更独特更实用的工具函数；
- 无副作用，支持 TreeShaking；
- 更好的兼容性，提供 CommonJS、ESModule、UMD 等多种模块入口；
- 完全 TypeScript 类型支持和完善的 JSDoc 注释；
- 代码体积小，零依赖。

# 起步

安装：

```bash
npm add omn
```

---

使用 HTML 标签引入（建议加上 `@<版本号>`）：

```html
<script src="https://unpkg.com/omn"></script>
```

# 示例

格式化电话号码：

```typescript
import { formatPhoneNumber } from 'omn'

formatPhoneNumber('13788889999', 'xxx **** xxxx')
// → "137 **** 9999"
```

---

汉字视作 2 字符长度：

```typescript
import { lengthOfEn } from 'omn'

lengthOfEn('你好')
// → 4
```

---

在满足条件前不断重试/轮询：

```typescript
const result = await retry(() => axios.get('/api/task/status'), {
  timeout: 30 * 1000,
  interval: 500,
  success: res => res.data.status === 'done',
})

if (result.success) {
  console.log('任务完成，结果：', result.data)
} else {
  console.log('轮询失败，原因：', result.reason)
}
```
