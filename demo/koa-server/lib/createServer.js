'use strict'

const fs = require('fs')
const url = require('url')
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const detectPort = require('./utils/detectPort')
const mimeType = require('./utils/mimeType')
const staticMiddle = require('./staticMiddle')

/**
 * 创建server
 * @param {{ wwwroot: string; port: number }} params
 * wwwroot-server根目录设置 port-端口号设置 默认 9000
 */
async function createServer({ wwwroot = '', port = 7000 }) {
  // 创建一个Koa实例
  const app = new Koa()
  // 创建一个路由实例
  const router = new Router()
  // 创建一个数据库实例，这里用 lowdb 的 JSON 存储来模拟数据库而已
  const adapter = new FileSync(path.resolve(__dirname, '../db.json'))
  const db = low(adapter)

  // 初始化数据库，可以看做是数据库的字段定义
  db.defaults({ visits: [], count: 0 }).write()

  app.use(staticMiddle(wwwroot))

  // router.use('/', async (ctx, next) => {
  //   const ip = ctx.header['X-Real-IP'] || ''
  //   const { user, page, action } = ctx.query

  //   // 更新数据库
  //   db.get('visits').push({ ip, user, page, action }).write()
  //   db.update('count', n => n + 1).write()
  //   // 返回更新后的数据库字段
  //   ctx.body = { success: true, visits: db.get('count') }
  //   await next()
  // })

  const IP = '127.0.0.1'
  let PORT = await detectPort(port, IP)
  // 把中间件压入队列，等待执行
  app
    // .use(router.routes())
    // .use(router.allowedMethods())
    .listen(PORT, () => {
      console.log(`server at http://${IP}:${PORT}`)
    })
}

module.exports = createServer
