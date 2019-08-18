const net = require('net')

// 简单创建一个连接
// const chatServer = net.createServer(function(socket) {
//   console.log(123)
//   // 新的连接
//   socket.on('data', function(data) {
//     socket.write('你好')
//   })

//   socket.on('end', function() {
//     console.log('连接断开')
//   })

//   socket.write('欢迎光临《深入浅出Nodejs.js》\n')
// })

// 创建一个简单聊天室
// socket就是利用tcp协议进行通讯
const chatServer = net.createServer()
const clientList = []
chatServer.on('connection', client => {
  client.write('Hi!\n')
  clientList.push(client)
  client.on('data', data => {
    console.log('receive:', data.toString())
    clientList.forEach(c => {
      // 排除自身
      if (c !== client) {
        c.write(data)
      }
    })
  })
})

chatServer.listen(8124, function() {
  console.log('server bind')
})
