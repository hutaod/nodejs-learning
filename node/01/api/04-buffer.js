const b1 = Buffer.from('10')
const b2 = Buffer.from('10', 'utf-8')
const b3 = Buffer.from([10])
const b4 = Buffer.from(b3)

// 创建一个大小为 10 个字节的缓冲区
const b5 = Buffer.alloc(10)

const b6 = Buffer.from('中文')

console.log(b1, b2, b3, b4, b5)
console.log(Buffer.concat([b1, b6]).toString())
