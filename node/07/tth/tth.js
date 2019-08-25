const Koa = require('koa')
const {
  initRouter,
  initController,
  initServices,
  loadConfig,
  initSchedule
} = require('./tth-loader')

class Tth {
  constructor(conf) {
    this.$app = new Koa(conf)
    loadConfig(this)
    this.$service = initServices()
    this.$ctrl = initController()
    this.$router = initRouter(this)
    this.$app.use(this.$router.routes())
    initSchedule()
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log(`服务器启动成功，端口：${port}`)
    })
  }
}

module.exports = Tth
