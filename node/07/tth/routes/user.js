module.exports = {
  // 'get /': async ctx => {
  //   ctx.body = '用户首页'
  // },
  // 'get /info': async ctx => {
  //   ctx.body = '用户详情页面'
  // }
  'get /': async app => {
    console.log(app.$service.user.getName())
    const name = await app.$service.user.getName()
    app.ctx.body = '用户名:' + name
  },
  'get /info': async app => {
    const age = await app.$service.user.getAge()
    app.ctx.body = '年龄:' + age
  }
}
