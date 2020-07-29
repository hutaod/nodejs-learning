const path = require('path') // 路径模块
const qs = require('querystring') // 地址参数解析模块
const util = require('util') // 常用工具方法模块
const url = require('url') // URL 解析模块

// path
console.log(path.basename('./12/hello.js'))
console.log(path.dirname('./aa/12/hello.js'))
console.log(path.extname('./aa/12/hello.html'))
console.log(path.normalize('/usr//local/bin//pack.json'))
console.log(path.resolve('foo/bar', '/tmp/file/', '..'))
console.log(path.join('./a', '../b/c', 'd/e'))
console.log(path.relative('./a/c', './b/c'))
console.log(path.parse('./b/c.html'))
console.log(path.format(path.parse('./b/c.html')))

// querystring
console.log(qs.parse('a=1&b=2'))
console.log(qs.stringify({ a: 1, b: 2 }))
console.log(qs.escape('https://www.baidu.com?a=1&b=2'))
console.log(qs.unescape(qs.escape('https://www.baidu.com?a=1&b=2')))

// util
console.log(util.format('%s:%s', 'foo', 'bar'))
console.log(util.types.isDate(new Date()))

// url
console.log(
  url.parse('https://usr:pwd@juejin.com:8080/a/b/c/d?q=js&cat=3&#hash')
)
// Url {
//   // 请求协议，比如 http、https、ftp、file 等
//   protocol: 'https:',
//   // 协议的 : 号有没有 /
//   slashes: true,
//   // url 的认证信息，跟上 @ 来区分认证部分和域名部分
//   auth: 'usr:pwd',
//   // url 的主机名
//   host: 'juejin.com:8080',
//   // 主机端口号
//   port: '8080',
//   // 主机名
//   hostname: 'juejin.com',
//   // 锚点部分，用 # 标识
//   hash: '#hash',
//   // 查询参数，包含 ?
//   search: '?q=js&cat=3&',
//   // 查询参数的字符串部分，不包含 ?
//   query: 'q=js&cat=3&',
//   // url 中的路径部分
//   pathname: '/a/b/c/d',
//   // 完整路径，由 pathname 和 search 组成
//   path: '/a/b/c/d?q=js&cat=3&',
//   // 链接地址
//   href: 'https://usr:pwd@juejin.com:8080/a/b/c/d?q=js&cat=3&#hash'
// }

const urlDemo = new URL(
  'https://usr:pwd@juejin.com:8080/a/b/c/d?q=js&cat=3#hash'
)
console.log(urlDemo.hash)
// #hash
urlDemo.hash = 'newHash'
urlDemo.port = 7000
urlDemo.pathname = '/e/f'
console.log(urlDemo.href)
// https://usr:pwd@juejin.com:7000/e/f?q=js&cat=3#newHash

const href = url.format({
  protocol: 'https',
  hostname: 'juejin.com',
  port: '8080',
  pathname: '/a/b/c/d',
  auth: 'usr:pwd',
  hash: '#hash',
  query: {
    q: 'js',
    cat: 3,
  },
})
console.log(href)
// https://usr:pwd@juejin.com:8080/a/b/c/d?q=js&cat=3#hash

const href2 = url.resolve('https://juejin.com/book', '/3')
console.log(href2)
// 'https://juejin.com/book/3'
console.log(path.normalize('/hello//haha'))