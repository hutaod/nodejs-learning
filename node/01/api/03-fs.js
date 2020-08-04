const fs = require('fs')

console.log(new Date().getTime())
// 同步
const data = fs.readFileSync('./2-1 下载和安装.mp4')
// console.log(data)
// 异步
// fs.readFile('./2-1 下载和安装.mp4', (err, data) => {
//   console.log(data)
// })
console.log(new Date().getTime())
