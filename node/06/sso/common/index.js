const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const { promisify } = require('util')
const path = require('path')
const verify = promisify(jwt.verify)
const router = require('koa-router')()
const views = require('koa-views')

const app = new Koa()
const secret = 'this is a secret'

app.use(
  views(path.join(__dirname, './views'), {
    extension: 'ejs'
  })
)
app.use(bodyParser())

router.get('/', async (ctx, next) => {
  const token = ctx.request.headers['authorization']
  if (token) {
    let payload = await verify(token, secret)
    let { time, timeout } = payload
    let data = new Date().getTime()
    if (data - time <= timeout) {
      const redirectUrl = ctx.query.redirectUrl
      if (redirectUrl) {
        ctx.redirect(`http://${redirectUrl}?token=${token}`)
      } else {
        ctx.body = '<h1>登录成功!</h1>'
      }
    } else {
      await ctx.render('login')
    }
  } else {
    await ctx.render('login')
  }
})

router.post('/', async ctx => {
  const username = ctx.request.body.username
  ctx.body = {
    message: '登录成功',
    data: jwt.sign(
      {
        data: username,
        exp: Math.floor(Date.now() / 1000) + 60
      },
      secret
    )
  }
})

router.all(/^\/api/, jwtAuth({ secret }))

router.get('/api/user/info', async ctx => {
  ctx.body = {
    code: 1,
    data: ctx.state.user
  }
})
const port = process.env.PORT || 8080

app.use(router.routes())
app.listen(port, function() {
  console.log(`Server passport listening on port: ${port}`)
})
