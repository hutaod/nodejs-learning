const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')

//
app.keys = ['hello world1234']

const SESS_CONFIG = {
  key: 'kkb:sess', // cookie 签名
  maxAge: 86400000, // 有效期，默认一天
  httpOnly: true, // 仅服务器修改
  signed: false // 签名cookie
}

// 注册
app.use(session(SESS_CONFIG, app))

// 测试
app.use(ctx => {
  if (ctx.path === '/favicon.ico') {
    return
  }
  // console.log(ctx.session)
  // 获取
  let n = ctx.session.count || 0

  // 设置
  ctx.session.count = ++n
  ctx.body = `第${n}次访问`
})

app.listen(3000)
