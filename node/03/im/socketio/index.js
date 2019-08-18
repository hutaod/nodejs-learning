const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

app.use(require('koa-static')('./', './index.html'))

io.on('connection', function(socket) {
  console.log('a user connected')
  // 响应某用户发送消息
  socket.on('chat message', function(msg) {
    console.log('chat message:' + msg)

    // 广播给所有人
    io.emit('chat message', msg)
    // 广播给除了发送者外所有人
    // socket.broadcast.emit('chat message', msg)
  })

  socket.on('disconnect', function() {
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
  console.log('server at 3000')
})
