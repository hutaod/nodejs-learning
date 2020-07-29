'use strict'

const path = require('path')
const Koa = require('koa')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const detectPort = require('./utils/detectPort')
const staticMiddle = require('./staticMiddle')

/**
 * 创建server
 * @param {{ wwwroot: string; port: number }} params
 * wwwroot-server根目录设置 port-端口号设置 默认 9000
 */
async function createServer({ wwwroot = '', port = 7000 }) {
  // 创建一个Koa实例
  const app = new Koa()
  // 创建一个数据库实例，这里用 lowdb 的 JSON 存储来模拟数据库而已
  const adapter = new FileSync(path.resolve(__dirname, '../db.json'))
  const db = low(adapter)

  // 初始化数据库，可以看做是数据库的字段定义
  db.defaults({ visits: [], count: 0 }).write()

  // 收集数据
  app.use(async (ctx, next) => {
    await next()
    if (ctx.status === 200 || ctx.status === 304) {
      const ip = ctx.header['X-Real-IP'] || ''
      // 记录文件下载次数，和是否有命中缓存
      db.get('visits')
        .push({ path: ctx.path, ip, isCache: ctx.status === 304 })
        .write()
      db.update('count', n => n + 1).write()
    }
  })

  // 创建静态服务器
  app.use(staticMiddle(wwwroot))

  const IP = '127.0.0.1'
  let PORT = await detectPort(port, IP)
  // 把中间件压入队列，等待执行
  app.listen(PORT, () => {
    console.log(`server at http://${IP}:${PORT}`)
  })
}

module.exports = createServer
