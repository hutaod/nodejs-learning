const Koa = require('./Koa')
const Router = require('./router')
const static = require('./static')

const app = new Koa()
const router = new Router()
app.use(static())

// app.use((req, res) => {
//   res.writeHead(200)
//   res.end('hi kaikeba')
// })

// app.use(ctx => {
//   ctx.body = 'haha'
// })
// const delay = () => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(), 2000)
//   })
//   // return Promise.resolve(resolve => setTimeout(() => resolve(), 2000))
// }

// app.use(async (ctx, next) => {
//   ctx.body = '1'
//   setTimeout(() => {
//     ctx.body += '2'
//   }, 2000)
//   await next()
//   ctx.body += '3'
// })

// app.use(async (ctx, next) => {
//   ctx.body += '4'
//   console.log(new Date().getTime() / 1000)
//   await delay()
//   console.log(new Date().getTime() / 1000)
//   await next()
//   ctx.body += '5'
// })

app.use(async (ctx, next) => {
  console.log(ctx.url)
  // ctx.body += '6'
  next()
})

router.get('/index', async ctx => {
  ctx.body = 'index page'
})
router.get('/post', async ctx => {
  ctx.body = 'post page'
})
router.get('/list', async ctx => {
  ctx.body = 'list page'
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('server at 3000')
})
