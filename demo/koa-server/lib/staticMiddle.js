const { resolve } = require('path')

function static(root, opts = {}) {
  opts.root = resolve(root)
  return async function serve(ctx, next) {
    let done = false

    if (ctx.method === 'HEAD' || ctx.method === 'GET') {
      try {
        done = await send(ctx, ctx.path, opts)
      } catch (err) {
        if (err.status !== 404) {
          throw err
        }
      }
    }

    if (!done) {
      await next()
    }
  }
}

module.exports = static

async function send(ctx, path, opts) {
  console.log(ctx.path, opts)
  return true
}
