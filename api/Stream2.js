const fs = require("fs")
const path = require("path")
const http = require("http")

// // fs.createReadStream(path.resolve(__dirname, "../source/avatar.png")).pipe(fs.createWriteStream("./img-pipe.png"))
// Demo 1
// http.createServer((req, res) => {
//   res.writeHeader(200, { 'Content-Type': 'text/html;charset=UTF-8' })
//   // // 1. 把文件内容全部读入内存
//   // fs.readFile(path.resolve(__dirname, "../source/file.txt"), (err, data) => {
//   //   // 2. 通过 res 批量返回
//   //   res.end(data)
//   // })
//   fs.createReadStream(path.resolve(__dirname, "../source/file.txt")).pipe(res)
// }).listen(5000)

// Dome2 pipe
// 拿取 stream 里面的可读可写流接口
// const { Readable, Writable } = require("stream")
// const rs = new Readable()
// const ws = new Writable()
// let n = 0

// // 一次次往流里面推数据
// rs.push('I ')
// rs.push('Love ')
// rs.push('Coding!\n')
// rs.push(null)

// // 每一次 push 的内容在pipe的时候
// // 都会走到 _write 方法，在 _write里面可以再做处理
// ws._write = function(chunk, ev, cb) {
//   n++
//   console.log(`chunk ${n}: ${chunk.toString()}`)
//   // chunk 1: I 
//   // chunk 2: Love 
//   // chunk 3: Coding!
//   cb()
// }

// // pipe 将两者连接起来，实现数据的持续传递，我们可以不去关心内部数据如何流动
// rs.pipe(ws)

// Dome 3 定制流
// const { Readable, Writable, Transform } = require("stream")

// class ReadStream extends Readable {
//   constructor() {
//     super()
//   }

//   _read() {
//     rs.push('I ')
//     rs.push('Love ')
//     rs.push('Coding!\n')
//     rs.push(null)
//   }
// }

// class WriteStream extends Writable {
//   constructor() {
//     super()
//     this._storage = Buffer.from('')
//   }
//   _write(chunk, encode, cb) {
//     console.log(chunk.toString())
//     cb()
//   }
// }

// class TransformStream extends Transform {
//   constructor() {
//     super()
//     this._storage = Buffer.from('')
//   }

//   _transform(chunk, encode, cb) {
//     this.push(chunk)
//     cb()
//   }

//   _flush (cb) {
//     this.push('On Yeah!')
//     cb()
//   }
// }

// const rs = new ReadStream()
// const ws = new WriteStream()
// const ts = new TransformStream()

// rs.pipe(ts).pipe(ws)

// Test 实现一个MP4转MP3工具
