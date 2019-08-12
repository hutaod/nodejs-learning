const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date().getTime()
  console.log(`start ${ctx.url}`)
  await next()
  const end = new Date().getTime()
  console.log(`请求耗时 ${end - start}ms`)
})

app.use(async (ctx, next) => {
  ctx.body = [
    {
      name: 'tom'
    }
  ]
  await next()
})

app.use(async (ctx, next) => {
  console.log('url:' + ctx.url)
  if (ctx.url === '/html') {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = `<b>我的名字是：${ctx.body[0].name}</b>`
  }
})

app.listen(3000)
