const os = require('os')
const download = require('./download')
// os.freemem() 方法以整数的形式回空闲系统内存的字节数
const mem = (1 - os.freemem() / os.totalmem()) * 100

console.log(`内存占用率${mem.toFixed(2)}%`)
console.log(download)
const repo = 'github:vuejs/vue'
const desc = '../test'
// download(repo, desc)
// console.log(os.EOL)
// console.log(os.arch())
// os.arch() 等同于 process.arch
// 现在可能的值有: 'arm', 'arm64', 'ia32', 'mips', 'mipsel',
//  'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64'。
// console.log(process.arch)

// os.constants 返回一个包含错误码,处理信号等通用的操作系统特定常量的对象
// console.log(os.constants)

// os.cpus() 方法返回一个对象数组, 包含每个逻辑 CPU 内核的信息
// console.log(os.cpus())

// os.endianness() 方法返回一个字符串,表明Node.js二进制编译环境的字节顺序.
// 'BE' 大端模式 'LE' 小端模式
// console.log(os.endianness())
// console.log(os.homedir())
// console.log(os.hostname())
// console.log('loadavg', os.loadavg())
// console.log('networkInterfaces', os.networkInterfaces())
// console.log('platform', os.platform())
// console.log('release', os.release())
// console.log('tmpdir', os.tmpdir())
// console.log('type', os.type())
// console.log('uptime', os.uptime())
// console.log('userInfo', os.userInfo())
