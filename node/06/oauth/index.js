const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const querystring = require('querystring')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const accessTokens = {}

const secret = "it's a secret"
const app = new Koa()

app.use(static(__dirname + '/'))
const config = {
  client_id: '7394e8eeb385dd2f492b',
  client_secret: '9eeb3e2f30d0787e242c86bd42d42c190a521f09'
}

router.get('/auth/github/login', async ctx => {
  // 重定向到认证接口，并配置参数
  const path = `https://github.com/login/oauth/authorize?${querystring.stringify(
    {
      client_id: config.client_id
    }
  )}`
  ctx.redirect(path)
})

router.get('/github/callback', async ctx => {
  console.log('callback..')
  const code = ctx.query.code
  const params = {
    ...config,
    code: code
  }
  let res = await axios.post(
    'https://github.com/login/oauth/access_token',
    params
  )
  const access_token = querystring.parse(res.data).access_token
  const uid = Math.random() * 99999
  accessTokens[uid] = access_token

  const token = jwt.sign(
    {
      data: uid,
      // 设置token过期时间，秒为单位，一小时后过期
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    secret
  )

  ctx.response.type = 'html'
  console.log('token:', token)
  ctx.response.body = ` <script>window.localStorage.setItem("authSuccess","true");window.localStorage.setItem("token","${token}");window.close();</script>`
})

router.get(
  '/auth/github/userinfo',
  jwtAuth({
    secret
  }),
  async ctx => {
    // 通过验证, ctx.state.user
    console.log('jwt payload:', ctx.state.user)
    const access_token = accessTokens[ctx.state.user.data]
    let res
    try {
      res = await axios.get(
        'https://api.github.com/user?access_token=' + access_token
      )
    } catch (error) {
      res = {
        data: {
          code: 1
        }
      }
    }
    console.log('userAccess:', res.data)
    ctx.body = res.data
  }
)

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000)
