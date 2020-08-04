'use strict'

const fs = require('fs')
const url = require('url')
const http = require('http')
const path = require('path')
const zlib = require('zlib')
const detectPort = require('./detectPort')
const mimeType = require('./mimeType')

/**
 * 创建server
 * @param {{ wwwroot: string; port: number }} params
 * wwwroot-server根目录设置 port-端口号设置 默认 9000
 */
async function createServer ({ wwwroot = process.cwd(), port = 9000 }) {
  const server = http.createServer((req, res) => {
    let { pathname } = url.parse(req.url)
    // 处理favicon.ico
    if (pathname === '/favicon.ico') {
      return res.end()
    }
    // 设置默认值
    pathname = pathname === '/' ? 'index.html' : pathname

    // 获取文件路径
    const filePath = path.join(wwwroot, pathname)
    // 获取文件后缀
    const ext = path.extname(pathname)

    // 参数合法性校验
    // 1. 非允许后缀的资源不予返回
    if (!mimeType[ext]) {
      console.log('非允许后缀的资源不予返回')
      res.statusCode = 404
      return res.end()
    }

    // 2. 若后缀合法，判断文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log('文件不存在')
      res.statusCode = 404
      return
    }

    // 3. 若文件存在，判断是否是文件类型
    const fStat = fs.statSync(filePath)
    if (!fStat.isFile()) {
      console.log('非文件类型')
      res.statusCode = 404
      return
    }

    // 4. 若合法存在，判断是否位于 wwwroot 目录下
    if (!filePath.startsWith(wwwroot)) {
      console.log(`文件不位于 ${wwwroot} 目录下`)
      res.statusCode = 404
      return
    }

    // 1. 304 缓存有效期判断, 使用 If-Modified-Since，用 Etag 也可以
    const modified = req.headers['if-modified-since']
    const expectedModified = new Date(fStat.mtime).toGMTString()
    if (modified && modified == expectedModified) {
      res.statusCode = 304
      res.setHeader('Content-Type', mimeType[ext])
      res.setHeader('Cache-Control', 'max-age=3600')
      res.setHeader('Last-Modified', expectedModified)
      res.end()
      return
    }

    // 2. 文件头信息设置
    res.statusCode = 200
    res.setHeader('Content-Type', mimeType[ext])
    res.setHeader('Cache-Control', 'max-age=3600')
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Last-Modified', expectedModified)

    // 3. gzip 压缩后，把文件流 pipe 回去
    const stream = fs.createReadStream(filePath, {
      flags: 'r'
    })
    stream.on('error', () => {
      res.writeHead(404)
      res.end()
    })
    stream.pipe(zlib.createGzip()).pipe(res)
  })

  const IP = '127.0.0.1'
  let PORT = await detectPort(port, IP)
  server.on('error', error => {
    console.log('error', error)
  })
  server.listen(PORT, IP, () => {
    console.log(`server at http://${IP}:${PORT}`)
  })
}

module.exports = createServer
