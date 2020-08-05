
const Router = require('koa-router')
const adminRouter = require("./admin")
const webRouter = require("./web")

const router = new Router()

router.use('/admin', adminRouter.routes())
router.use('/web', webRouter.routes())

router.get('/', async (ctx, next) => {
  console.log('index')
  ctx.body = 'Hello Koa！'
})

module.exports = router