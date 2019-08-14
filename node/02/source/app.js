const Koa = require('./Koa')

const app = new Koa()

// app.use((req, res) => {
//   res.writeHead(200)
//   res.end('hi kaikeba')
// })

// app.use(ctx => {
//   ctx.body = 'haha'
// })
const delay = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 2000)
  })
  // return Promise.resolve(resolve => setTimeout(() => resolve(), 2000))
}

app.use(async (ctx, next) => {
  ctx.body = '1'
  setTimeout(() => {
    ctx.body += '2'
  }, 2000)
  await next()
  ctx.body += '3'
})

app.use(async (ctx, next) => {
  ctx.body += '4'
  console.log(new Date().getTime() / 1000)
  await delay()
  console.log(new Date().getTime() / 1000)
  await next()
  ctx.body += '5'
})

app.use(async (ctx, next) => {
  ctx.body += '6'
})

app.listen(3000, () => {
  console.log('server at 3000')
})
