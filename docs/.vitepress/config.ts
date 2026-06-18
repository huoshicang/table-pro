import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'table-pro',
  description: 'Vue 3 后台管理表格组件库 —— schema 驱动的可配置数据表格',
  base: '/table-pro/',
  head: [
    ['meta', { name: 'theme-color', content: '#18a058' }],
  ],
  themeConfig: {
    logo: undefined,
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/table-pro' },
      { text: 'API', link: '/api/composables' },
      { text: 'GitHub', link: 'https://github.com/huoshicang/table-pro' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '插件注册', link: '/guide/plugin-setup' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'TablePro 顶层编排', link: '/components/table-pro' },
            { text: 'Table 数据表格', link: '/components/table' },
            { text: 'Search 搜索表单', link: '/components/search' },
            { text: 'FormRenderer 表单渲染', link: '/components/form-renderer' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Modal 弹窗', link: '/components/modal' },
            { text: 'TableAction 操作按钮', link: '/components/table-action' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: 'Composables', link: '/api/composables' },
            { text: '工具函数', link: '/api/utils' },
            { text: '类型定义', link: '/api/types' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/huoshicang/table-pro' },
    ],
    search: {
      provider: 'local',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': new URL('../../src', import.meta.url).pathname,
      },
    },
    ssr: {
      // naive-ui 及其依赖是 CJS 模块，SSR 构建时需要打包而不是外部化
      noExternal: [/naive-ui/, /vueuc/, /css-render/],
    },
  },
  markdown: {
    lineNumbers: true,
  },
})
