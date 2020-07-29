const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const mimeType = require('./utils/mimeType')

/**
 * 创建静态服务器，拦截资源
 * @param {string} root 静态服务器目录
 */
function static(root) {
  return async function serve(ctx, next) {
    let done = false

    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      try {
        done = await send(ctx, path.resolve(root))
      } catch (err) {
        console.log(err)
        if (err.status !== 404) {
          throw err
        }
      }
    }
    if (!done) {
      await next()
    }
    return done
  }
}

module.exports = static

async function send(ctx, root) {
  let pathname = ctx.path
  // 获取文件路径
  const filePath = path.join(root, pathname)
  // 获取文件后缀
  const ext = path.extname(pathname)

  // 参数合法性校验
  // 1. 判断文件是否存在
  if (!fs.existsSync(filePath)) {
    throw { status: 404, message: '找不到资源' }
  }

  // 2. 若文件存在，判断是否是文件类型
  const fStat = fs.statSync(filePath)
  if (fStat.isFile()) {
    // 2.1 文件类型则判断后缀合法性，合法则返回
    // 非允许后缀的资源不予返回
    if (!mimeType[ext]) {
      throw new Error('非允许后缀的资源不予返回')
    } else {
      // 若合法存在，判断是否位于 root 目录下
      if (!filePath.startsWith(root)) {
        throw new Error(`文件不位于 ${root} 目录下`)
      }

      // 304 缓存有效期判断, 使用 If-Modified-Since，用 Etag 也可以
      const modified = ctx.req.headers['if-modified-since']
      const expectedModified = new Date(fStat.mtime).toGMTString()
      if (modified && modified == expectedModified) {
        ctx.status = 304
        ctx.type = mimeType[ext]
        ctx.res.setHeader('Cache-Control', 'max-age=3600')
        ctx.res.setHeader('Last-Modified', expectedModified)
        return true
      }

      // 文件头信息设置
      ctx.status = 200
      ctx.type = mimeType[ext]
      ctx.res.setHeader('Cache-Control', 'max-age=3600')
      ctx.res.setHeader('Content-Encoding', 'gzip')
      ctx.res.setHeader('Last-Modified', expectedModified)

      // gzip 压缩后，把文件流 pipe 回去
      const stream = fs.createReadStream(filePath, {
        flags: 'r',
      })
      stream.on('error', () => {
        ctx.res.statusCode = 404
        ctx.res.end()
      })
      ctx.body = stream.pipe(zlib.createGzip())
    }
  } else {
    // 2.2 文件夹类型则返回文件列表的html页面
  }

  console.log(root, pathname, filePath, ext)
  return true
}
