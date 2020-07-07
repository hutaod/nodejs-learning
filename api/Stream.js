const fs = require('fs')
const path = require('path')

// console.time('test')
// const source = fs.readFileSync(path.resolve(__dirname, '../source/avatar.png'))

// fs.writeFileSync('img_copy.png', source)
// console.timeEnd('test')

// console.time('test')
// const source = fs.readFileSync(path.resolve(__dirname, '../source/myfile.mp4'))

// fs.writeFileSync('myfile_copy.mp4', source)
// console.timeEnd('test')

// 创建一个可读流，把内容从目标文件里一块一块抠出来缓存
// console.time('test')
// const rs = fs.createReadStream(path.resolve(__dirname, '../source/mifile1.mp4'))
// let n = 0
// rs.on('data', chunk => {
//   // 数据正在传递时，触发该事件（以 chunk 数据块为对象）
//   // 每次 chunk 块最大是 64kb，如果凑不够 64kb，会缩小为 32kb
//   n++
//   console.log(chunk.byteLength)
//   console.log(Buffer.isBuffer(chunk))
//   // console.log('data emits')
//   // console.log(chunk.toString('utf8'))
//   // 我们可以每次都暂停数据读取，做一些数据中间处理（比如压缩）后再继续读取数据
//   // console.log('暂停获取....')
//   // rs.pause()
//   // setTimeout(() => {
//   //   console.log('继续获取')
//   //   rs.resume()
//   // }, 100)
// })
//   .on('end', () => {
//     // 数据传递完成后，会触发 'end' 事件
//     console.log(`传输结束，共收到 ${n} 个 Buffer 块`)
//   })
//   .on('close', () => {
//     // 整个流传输结束关闭的时候会触发 close
//     console.timeEnd('test')
//     console.log('传输关闭')
//   })
//   .on('error', e => {
//     // 异常中断或者出错时的回调处理
//     console.log('传输出错' + e)
//   })

// 流速控制
const rs = fs.createReadStream(path.resolve(__dirname, '../source/avatar.png'))
const ws = fs.createWriteStream('./logo_write.png')

// 下面这种写法存在这样一个问题，如果读的快，写的慢，因为磁盘 IO 的读写速度
// 并不是一致的，如果读的快，写得慢，积压的内存缓冲越来越多，内存可能会爆仓
// rs.on('data', chunk => {
//   // 当有数据流出时，写入数据
//   ws.write(chunk)
// })
// rs.on('end', () => {
//   // 当没有数据时，关闭数据流
//   ws.end()
// })

// 改写，实现了防爆仓，越是大的文件越需要优雅的处理。
rs.on('data', chunk => {
  // 看看是否缓冲数据被写入，写入是 true，未写入是 false
  if (ws.write(chunk) === false) {
    console.log('still cached')
    rs.pause()
  }
})
rs.on('end', () => {
  // 当没有数据再消耗后，关闭数据流
  ws.end()
})
ws.on('drain', () => {
  console.log('数据被消耗后，继续启动读数据')
  rs.resume()
})
