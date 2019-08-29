const Koa = require('koa')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')

const secret = "it's a secret"

const app = new Koa()

app.keys = ['some srcret']
app.use(static(__dirname + '/'))
app.use(bodyParser())

router.post('/users/login-token', async ctx => {
  const { body } = ctx.request
  // 登录逻辑，略
  // 设置session
  const userinfo = body.username
  ctx.body = {
    message: '登录成功',
    user: userinfo,
    token: jwt.sign(
      {
        data: userinfo,
        // 设置过期时间， 一分钟后， 秒为单位
        exp: Math.floor(Date.now() / 1000) + 60
      },
      secret
    )
  }
})

router.get(
  '/users/getUser-token',
  jwtAuth({
    secret
  }),
  async ctx => {
    console.log(ctx.state.user)
    ctx.body = {
      message: '获取数据成功',
      userinfo: ctx.state.user
    }
  }
)

app.use(router.routes())
app.listen(3000, () => {
  console.log('server at 3000')
})
