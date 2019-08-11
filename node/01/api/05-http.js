const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  // res.end('hello...')
  const { url, method, headers } = req
  if (url === '/' && method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/users' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(
      JSON.stringify({
        name: '潇湘剑雨'
      })
    )
  } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
    if (url.indexOf('/favicon.ico') !== -1) {
      res.end()
    } else {
      // 图片处理
      fs.createReadStream('./' + url).pipe(res)
    }
  }
})

server.listen(3000)
