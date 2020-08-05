
const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello Web'
})

module.exports = router