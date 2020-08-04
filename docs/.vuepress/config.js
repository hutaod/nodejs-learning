module.exports = {
  title: 'NodeJS进阶',
  description: 'NodeJS进阶',
  dest: 'dist',
  serviceWorker: false,
  configureWebpack: {
    resolve: {
      alias: {},
    },
  },
  themeConfig: {
    repo: 'ht1131589588/nodejs-learning',
    repoLabel: 'GitHub',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '为该章节纠错',
    lastUpdated: '上次更新',
    nav: [],
    sidebar: [
      ['/', '前言'],
      {
        title: '学习笔记',
        collapsable: true,
        children: [],
      },
      {
        title: 'Nodejs 工具库实践',
        collapsable: true,
        children: [],
      },
      {
        title: 'Nodejs 项目实践',
        collapsable: true,
        children: [],
      },
    ],
  },
  base: '',
}
