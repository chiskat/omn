import { defineConfig } from 'vitepress'

import pkg from '../../package.json'

export default defineConfig({
  transformPageData(pageData) {
    pageData.frontmatter.pkgVersion = pkg.version
  },
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        tokens[idx].content = tokens[idx].content.replaceAll('__PKG_VERSION__', pkg.version)

        return fence!(tokens, idx, options, env, self)
      }
    },
  },
  title: 'Omn',
  description: '实用、轻量、独特的 JavaScript 工具集',
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],
  lastUpdated: true,
  appearance: false,
  metaChunk: true,
  cleanUrls: true,
  themeConfig: {
    nav: [{ text: '文档', link: '/guide/bootstrap/introduction', activeMatch: '/guide' }],

    sidebar: {
      '/guide/': [
        {
          text: '起步',
          items: [
            { text: '介绍', link: '/guide/bootstrap/introduction' },
            { text: '快速上手', link: '/guide/bootstrap/usage' },
          ],
        },
        {
          text: '通用',
          collapsed: true,
          items: [
            { text: 'asList', link: '/guide/common/asList' },
            { text: 'highlightSplit', link: '/guide/common/highlightSplit' },
            { text: 'isEnvOn', link: '/guide/common/isEnvOn' },
            { text: 'noNull', link: '/guide/common/noNull' },
            { text: 'result', link: '/guide/common/result' },
            { text: 'retry', link: '/guide/common/retry' },
            { text: 'sleep', link: '/guide/common/sleep' },
          ],
        },
        {
          text: '每日/每周/每月',
          collapsed: true,
          items: [
            { text: 'daily', link: '/guide/regular/daily' },
            { text: 'weekly', link: '/guide/regular/weekly' },
            { text: 'monthly', link: '/guide/regular/monthly' },
            { text: 'regular', link: '/guide/regular/regular' },
          ],
        },
        {
          text: '文本',
          collapsed: true,
          items: [
            { text: 'encodeURIComponentFixed', link: '/guide/text/encodeURIComponentFixed' },
            { text: 'formatPhoneNumber', link: '/guide/text/formatPhoneNumber' },
            { text: 'lengthOfEn', link: '/guide/text/lengthOfEn' },
            { text: 'tagTemplate', link: '/guide/text/tagTemplate' },
            { text: 'toEndsWith', link: '/guide/text/toEndsWith' },
            { text: 'toStartsWith', link: '/guide/text/toStartsWith' },
          ],
        },
        {
          text: '树结构',
          collapsed: true,
          items: [
            { text: 'listToTree', link: '/guide/tree/listToTree' },
            { text: 'mapTree', link: '/guide/tree/mapTree' },
            { text: 'traverseTree', link: '/guide/tree/traverseTree' },
          ],
        },
        {
          text: '杂项',
          collapsed: true,
          items: [{ text: 'OmnError', link: '/guide/misc/OmnError' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/chiskat/omn' }],

    editLink: {
      pattern: 'https://github.com/chiskat/omn/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
          },
          modal: {
            displayDetails: '切换详情/仅标题',
            resetButtonTitle: '清空输入框',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '前往',
              navigateText: '导航',
              closeText: '关闭搜索',
            },
          },
        },
      },
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
  },

  sitemap: {
    hostname: 'https://omn.paperplane.cc',
  },
})
