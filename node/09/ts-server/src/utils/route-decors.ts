import * as glob from 'glob'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch'
type LoadOptions = {
  /**
   * 路由文件扩展名
   */
  extname?: string
}

type RouteOptions = {
  /**
   * 适用于某个请求比较特殊，需要单独制定前缀的情形
   */
  prefix?: string
  /**
   * 给当前路由添加一个或多个中间件
   */
  middlewares?: Array<Koa.Middleware>
}

const router = new KoaRouter()
const decorate = (
  method: HTTPMethod,
  path: string,
  options: RouteOptions = {},
  router: KoaRouter
) => {
  return (target, property: string) => {
    process.nextTick(() => {
      // 添加中间件
      const middlewares = []
      if (target.middlewares) {
        middlewares.push(...target.middlewares)
      }
      if (options.middlewares) {
        middlewares.push(...options.middlewares)
      }
      // 加入自身
      middlewares.push(target[property])

      const url = options.prefix ? options.prefix + path : path
      router[method](url, ...middlewares)
    })
  }
}

const method = method => (path: string, options?: RouteOptions) =>
  decorate(method, path, options, router)

export const get = method('get')
export const post = method('post')
export const put = method('put')
export const del = method('del')
export const patch = method('patch')

export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
  // '.{js,ts}'要么js要么ts glob的规则
  const extname = options.extname || '.{js,ts}'
  // 解析文件开始
  glob
    .sync(require('path').join(folder, `./**/*${extname}`))
    .forEach(item => require(item))
  // 解析文件结束，返回解析过程中生成的router
  return router
}

export const middlewares = function middlewares(
  middlewares: Koa.middlewares[]
) {
  return function(target) {
    target.prototype.middlewares = middlewares
  }
}
