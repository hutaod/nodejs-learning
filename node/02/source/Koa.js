const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa {
  constructor() {
    this.middlewares = []
  }
  listen(...arg) {
    const server = http.createServer(async (req, res) => {
      // 构建上下文
      const ctx = this.createContext(req, res)
      // 中间件合成
      const fn = this.compose(this.middlewares)
      await fn(ctx)
      res.end(ctx.body)
    })
    server.listen(...arg)
  }
  use(middleware) {
    this.middlewares.push(middleware)
  }

  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.req = res
    return ctx
  }

  // 合成函数
  compose(middlewares) {
    return function(ctx) {
      // 执行第1个
      return dispatch(0)

      function dispatch(i) {
        let fn = middlewares[i]
        if (!fn) {
          return Promise.resolve()
        }

        return Promise.resolve(
          fn(ctx, function next() {
            // 执行下一个
            return dispatch(i + 1)
          })
        )
      }
    }
  }
}

module.exports = Koa
