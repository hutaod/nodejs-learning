
const Router = require('koa-router')

const router = new Router()

router.use()

router.get('/', async (ctx, next) => {
  console.log('index')
  ctx.body = 'Hello Koa！'
})

module.exports = router