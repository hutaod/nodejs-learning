const http = require('http')

const session = {}
const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.end('')
    return
  }

  // 观察cookie
  console.log('cookie', req.headers.cookie)
  const sessionKey = 'sid'
  const cookie = req.headers.cookie

  if (cookie && cookie.indexOf(sessionKey) > -1) {
    res.end('ComeBack')
    const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`)
    const sid = pattern.exec(cookie)[1]
    console.log('session:', sid, session, session[sid])
  } else {
    // 首次登录
    const sid = (Math.random() * 99999999).toFixed()
    // 设置sid
    res.setHeader('Set-Cookie', `${sessionKey}=${sid}`)
    session[sid] = {
      name: 'hashiqi'
    }
    res.end('Hello....hashiqi')
  }
  // // 设置cookie
  // res.setHeader('Set-Cookie', 'cookie1=abc')
  // res.end('hello cookie...')
})

server.listen(3002, () => {
  console.log('server at 3002')
})
