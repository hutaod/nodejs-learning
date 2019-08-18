const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express()
app.use(express.static(__dirname + '/'))

// 反向代理
app.use(
  '/api',
  proxy({
    target: 'http://localhost:3000',
    changeOrigin: true
  })
)

app.listen(4000, () => {
  console.log('server at 4000')
})
