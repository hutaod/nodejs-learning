class Router {
  constructor() {
    this.stack = []
  }

  register(path, method, middleware) {
    let route = { path, method, middleware }
    this.stack.push(route)
  }

  get(url, middleware) {
    this.register(url, 'get', middleware)
  }

  post(url, middleware) {
    this.register(url, 'post', middleware)
  }

  routes() {
    let stack = this.stack
    return async function(ctx, next) {
      // console.log('route', ctx.url, stack)
      let currentPath = ctx.url
      let route

      for (let index = 0; index < stack.length; index++) {
        const item = stack[index]
        if (currentPath === item.path && ctx.method === item.method) {
          route = item.middleware
          break
        }
      }

      if (typeof route === 'function') {
        route(ctx, next)
        return
      }
      next()
    }
  }
}

module.exports = Router
