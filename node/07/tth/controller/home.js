module.exports = {
  index: async app => {
    app.ctx.body = await app.$model.user.findAll()
  },
  detail: async app => {
    app.ctx.body = await app.$model.user.create({
      name: '嘿嘿😁'
    })
  }
}
