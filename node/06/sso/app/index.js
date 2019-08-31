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
app.use('/', jwtAuth({ secret }), async ctx => {
  console.log(ctx)
})

const port = process.env.PORT || 8070

app.use(router.routes())
app.listen(port, function() {
  console.log(`Server passport listening on port: ${port}`)
})
