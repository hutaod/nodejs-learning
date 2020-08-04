const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

// 读取指定目录下的文件
function load(dir, cb) {
  // 获取绝对路径
  const url = path.resolve(__dirname, dir)
  // 读取路径下的文件
  const files = fs.readdirSync(url)
  // 遍历路由文件
  files.forEach(filename => {
    // 去掉后缀名
    filename = filename.replace('.js', '')
    // console.log(url + '/' + filename)
    // 导入文件
    const file = require(url + '/' + filename)
    // 回调
    cb(filename, file)
  })
}

function initRouter(app) {
  const router = new Router()
  load('routes', (filename, routes) => {
    // 若是路由
    const prefix = filename === 'index' ? '' : `/${filename}`
    routes = typeof routes === 'function' ? routes(app) : routes
    // 遍历路由
    Object.keys(routes).forEach(key => {
      const [method, path] = key.split(' ')
      // 添加路由
      // router[method](prefix + path, routes[key])
      router[method](prefix + path, async ctx => {
        app.ctx = ctx // 把ctx挂载至app
        await routes[key](app)
      })
    })
  })

  return router
}

function initController() {
  const controllers = {}
  load('controller', (filename, controller) => {
    controllers[filename] = controller
  })
  return controllers
}

function initServices() {
  const services = {}
  load('service', (filename, service) => {
    services[filename] = service
  })
  return services
}

const Sequelize = require('sequelize')
function loadConfig(app) {
  load('config', (filename, config) => {
    if (config.db) {
      app.$db = new Sequelize(config.db)
      // 加载模型
      app.$model = {}
      load('model', (filename, { schema, options }) => {
        app.$model[filename] = app.$db.define(filename, schema, options)
      })
      app.$db.sync()
    }

    if (config.middleware) {
      config.middleware.forEach(mid => {
        const midpath = path.resolve(__dirname, 'middleware', mid)
        app.$app.use(require(midpath))
      })
    }
  })
}

const schedule = require('node-schedule')
function initSchedule() {
  // 读取控制器目录
  load('schedule', (filename, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler)
  })
}

module.exports = {
  initRouter,
  initController,
  initServices,
  loadConfig,
  initSchedule
}
