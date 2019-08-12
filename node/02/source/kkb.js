const http = require('http')

class KKB {
  constructor() {
    this.middlewares = []
  }
  listen(...arg) {
    const server = http.createServer((req, res) => {
      // 构建上下文
      // 中间件合成
      this.middlewares.forEach(cb => cb(req, res))
    })
    server.listen(...arg)
  }
  use(middleware) {
    this.middlewares.push(middleware)
  }

  createContext() {
    return
  }

  // 合成函数
  compose(middlewares) {
    return function(ctx) {
      // 执行第1个
      return dispatch(0)

      function dispatch(i) {
        let fn = middlewares(i)
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

module.exports = KKB
