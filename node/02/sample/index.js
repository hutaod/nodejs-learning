const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date().getTime()
  console.log(`start ${ctx.url}`, 1)
  await next()
  const end = new Date().getTime()
  console.log(`请求耗时 ${end - start}ms`, 5)
})

app.use(async (ctx, next) => {
  ctx.body = [
    {
      name: 'tom'
    }
  ]
  console.log(2)
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log('url:' + ctx.url)
  if (ctx.url === '/html') {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = `<b>我的名字是：${ctx.body[0].name}</b>`
  }
  console.log(3)
})

app.listen(3000)
