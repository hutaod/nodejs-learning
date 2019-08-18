const http = require('http')
const fs = require('fs')

const app = http.createServer((req, res) => {
  const { method, url } = req
  if (url === '/' && method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/api/download' && method === 'GET') {
    fs.readFile('./file.pdf', (err, data) => {
      res.setHeader('Content-Type', 'application/pdf')
      const fileName = encodeURI('中文')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}.pdf"`
      )
      res.end(data)
    })
  }
})

app.listen(3000, () => {
  console.log('server at 3000')
})
