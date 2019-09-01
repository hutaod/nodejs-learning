import * as Koa from 'koa'
import { get, post, middlewares } from '../utils/route-decors'
import model from '../model/user'

const api = {
  findByName(name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name === 'xia') {
          reject('用户名已存在')
        } else {
          resolve()
        }
      }, 500)
    })
  }
}

const users = [{ name: 'tom', age: 20 }, { name: 'haha', age: 30 }]

// @middlewares([
//   async function guard(ctx: Koa.Context, next: () => Promise<any>) {
//     console.log('guard', ctx.header)

//     if (ctx.header.token) {
//       await next()
//     } else {
//       throw '请登录'
//     }
//   }
// ])
export default class user {
  @get('/users')
  public async list(ctx: Koa.Context) {
    const users = await model.findAll()
    ctx.body = {
      ok: 1,
      data: users
    }
  }

  @post('/users', {
    middlewares: [
      async function validation(ctx: Koa.Context, next: () => Promise<any>) {
        // 用户名必填
        const name = ctx.request.body.name

        if (!name) {
          throw '请输入用户名'
        }
        // 用户名不能重复
        try {
          await api.findByName(name)
          await next()
        } catch (error) {
          throw error
        }
      }
    ]
  })
  public async add(ctx: Koa.Context) {
    // users.push(ctx.request.body)
    await model.create(ctx.request.body)
    ctx.body = {
      ok: 1
    }
  }
}
