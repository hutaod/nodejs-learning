const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')

//
app.keys = ['hello world1234']

// 使用redis
const redisStore = require('koa-redis')
const redis = require('redis')
const redisClient = redis.createClient(6379, 'localhost')

const wrapper = require('co-redis')
const client = wrapper(redisClient)

app.use(
  session(
    {
      key: 'kkb:sess', // cookie 签名
      store: redisStore({ client }) // 此处可以不必指定client
    },
    app
  )
)

app.use(async (ctx, next) => {
  const keys = await client.keys('*')
  keys.forEach(async key => {
    console.log(await client.get(key))
  })
  await next()
})

// 测试
app.use(ctx => {
  if (ctx.path === '/favicon.ico') {
    return
  }
  // console.log(ctx.session)
  // 获取
  let n = ctx.session.count || 0

  // 设置
  ctx.session.count = ++n
  ctx.body = `第${n}次访问`
})

app.listen(3000)
