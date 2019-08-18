const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const { url, method } = req
  console.log('request url:', url)
  console.log('request method:', method)
  // 观察cookie存在
  console.log('cookie', req.headers.cookie)

  if (url === '/' && method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        console.log(err)
      }
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (
    url === '/api/users' &&
    (method === 'GET' || method === 'PUT' || method === 'POST')
  ) {
    console.log('haha')
    // 设置cookie// 预检options中和/users接口中均需添加
    // 默认跨域情况下不能设置cookie，需要加上Access-Control-Allow-Credentials
    // res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Set-Cookie', 'cookie1=va221111222')

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000')
    res.setHeader('Content-Type', 'application/json')

    // 观察请求参数数据
    // console.log(req)
    let reqData = []
    let size = 0
    req.on('data', data => {
      console.log('>>>req on', data)
      reqData.push(data)
      size += data.length
    })
    req.on('end', function() {
      console.log('end')
      const data = Buffer.concat(reqData, size)
      console.log('data:', size, data.toString())
      res.end(`formdata:${data.toString()}`)
    })

    // res.end(JSON.stringify([{ name: 'tome', age: 20 }]))
  } else if (url === '/api/users' && method === 'OPTIONS') {
    console.log('options...')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://localhost:4000',
      'Access-Control-Allow-Headers': 'X-token,Content-Type',
      'Access-Control-Allow-Methods': 'PUT'
    })
    res.end()
    // 什么时候发预检请求？
    // HTTP请求包括： 简单请求 和 需预检的请求
    // https://www.jianshu.com/p/b55086cbd9af
  }
})

server.listen(3000, () => {
  console.log('server at 3000')
})
