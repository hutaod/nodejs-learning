module.exports = async (ctx, next) => {
  console.log(ctx.method + ' ' + ctx.path)
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  console.log(`${ctx.method} ${ctx.path} ${ctx.status} ${duration}ms`)
}
