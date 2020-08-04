const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()

app.use(require('koa-static')('./'))
app.use(bodyParser())

router.post('/api/test', async (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = ctx.request.body
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('server at 3000')
})
