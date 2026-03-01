# Agent Skills

`omn` 提供配套的 [Agent Skills](https://agentskills.io)。<br />
它可以让 AI 编程助手感知到各个工具函数，理解工具函数的用法，理解参数定义，从而更好的利用 `omn` 带来的能力。

## 亮点

- 文档即 Skills，技术文档中的内容和 Skills 保持同步；
- Skills 已按函数充分拆分，各函数的复杂文档可以按需加载，避免占用过多上下文长度；
- 兼容 Vercel `skills` CLI 和 `skills-npm` 两种安装方式。

## 安装

可从以下两种方式中任选一种安装。

### 使用 `npx skills` 安装

这是最常见的 Agent Skills 安装方式。

```bash
npx skills add chiskat/omn
```

这会使用 Vercel 的 [`skills` CLI](https://skills.sh/docs) 安装，在终端中的交互式菜单中完成配置即可。

### 使用 `skills-npm` 安装

`omn` 的 npm 包捆绑了 Skills，因此可使用 `skills-npm` 直接提取，这样可以使得 Skills 在项目中持久化，方便其它团队成员共享。

```bash
npm add -D skills-npm
```

然后，修改你的 `package.json`：

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

此后，每次安装依赖项后，`skills-npm` 便会自动运行，从 `omn` 的包中拷贝 Skills 文件。

因此，可以让 Git 忽略掉能自动安装的 Skills，在 `.gitignore` 中添加一行：

```
skills/npm-*
```

具体用法，请参考 [`skills-npm` 文档](https://www.npmjs.com/package/skills-npm)。
