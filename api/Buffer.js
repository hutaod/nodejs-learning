// const bufFormNew = new Buffer('Hello 掘金')
// console.log(Buffer.isBuffer(bufFormNew), typeof bufFormNew)

// 通过字符串创建
const bufFormStr = Buffer.from('Hello 掘金')

console.log(bufFormStr)

// 传入一个Buffer数组来创建：
const bufFromBuf = Buffer.from([
  0x48,
  0x65,
  0x6c,
  0x6c,
  0x6f,
  0x20,
  0xe6,
  0x8e,
  0x98,
  0xe9,
  0x87,
  0x91,
])

console.log(bufFromBuf)
console.log(bufFromBuf.toString())
console.log(bufFromBuf.toString('utf-8'))
console.log(bufFromBuf.toString('utf16le'))

// 在 Buffer 对象与字符串互相转换的时候，需要指定编码格式，
// 如果不传递编码格式的参数，那么默认是按照 utf-8 格式进行转换，

// 按照 base64 的编码格式把 Hello 掘金这个字符串转换成 buffer 对象：
console.log(Buffer.from('Hello 掘金', 'base64').toString('base64'))
// <Buffer 1d e9 65>

// 转换回来发现会把`o 掘金`丢失掉
console.log(Buffer.from('Hello 掘金', 'base64').toString('base64'))
// Hell

// Buffer.alloc
// 初始化一个八位字节长度的 buffer
const bufFromAlloc = Buffer.alloc(8)
console.log(bufFromAlloc)
// <Buffer 00 00 00 00 00 00 00 00>

// 这个实例化后的 buf，有一个length的属性，来表示缓冲区的大小
console.log(bufFromAlloc.length) // 8

// 通过 alloc 分配的内存区间是有固定长度的，如果写入超过长度，超出部分不会被缓冲
bufFromAlloc.write('123456789')
console.log(bufFromAlloc)
// <Buffer 31 32 33 34 35 36 37 38>
console.log(bufFromAlloc.toString()) // 12345678

let bufForWrite = Buffer.alloc(32)
bufForWrite.write('Hello 掘金', 0, 9)
console.log(bufForWrite.toString()) // Hello 掘

// 数组截取 Buffer slice 和数组类似
let bufFormArr1 = Buffer.from([1, 2, 3, 4, 15])
console.log(bufFormArr1)
let bufFormArr2 = bufFormArr1.slice(2, 4)
console.log(bufFormArr2)

// Buffer slice 注意事项
// 1. 两个参数都是可选项，start 和 end 也可以是负值，为负值时，会首先把这个负值和 Buffer 的长度相加，然后变为正值之后，再做处理。
// 2. 与 JS 不同的是，如果你修改了 slice 返回的 Buffer 对象中的属性值，那么原来的 Buffer 实例中对应的值，也会被修改，因为 Buffer 中保存的是一个类似指针的东西，指向同一段存储空间，不管以哪一个变量或者指针，都可以修改这段存储空间的值，再通过其他变量或者指针访问该属性时，获取到的也是修改后的值。

// 数组拷贝 Buffer copy
// copy 支持四个参数：
// 第一个参数指定复制的目标 Buffer。
// 第二个参数指定目标 Buffer 从第几个字节开始写入数据，默认为 0（从开始出写入数据）
// 第三个参数指定从复制源 Buffer 中获取数据时的开始位置，默认值为0，即从第一个数据开始获取数据。
// 第四个参数指定从复制源 Buffer 中获取数据的结束位置，默认值为复制源 Buffer 的长度，即 Buffer 的结尾。

let bufCopy1 = Buffer.from('Hello')
let bufCopy2 = Buffer.alloc(4)
console.log(bufCopy1, bufCopy2) // <Buffer 48 65 6c 6c 6f> <Buffer 00 00 00 00>

bufCopy1.copy(bufCopy2, 0, 1, 5)
console.log(bufCopy2) // <Buffer 65 6c 6c 6f>
console.log(bufCopy2.toString()) // ello

// 缓冲填充 Buffer fill --- buf.fill(value[, offset[, end]][, encoding])

// fill支持三个参数：
// 第一个参数指定被写入的数值
// 第二个参数指定从第几个字节开始写入，默认值为 0，也就是从缓存区起始位置写入
// 第三个参数指定将数值一直写入到第几个字节结束，默认是 Buffer 的 length，也就是写到缓存区尾部
// 最后一个参数是指定编码

const bufForFIll = Buffer.alloc(12).fill('11-11 ')
console.log(bufForFIll)
console.log(bufForFIll.toString()) // `11-11 11-11 `

// 练习 - 拷贝图片
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, '../source/avatar.png'), (err, buffer) => {
  console.log(
    Buffer.isBuffer(buffer) && 'readFile 读取图片拿取到的是 Buffer 数据'
  )

  // 把读取到的 Buffer 数据，通过 fs writeFile 写入到一个新图片文件中
  fs.writeFile('logo.png', buffer, function(err) {})

  // 再基于原始的Buffer 创建一个新的Buffer，通过toString base64 解码为字符串打印出来
  const base64Image = Buffer.from(buffer).toString('base64')
  // console.log(base64Image)

  // base64Image 是 base64 后的字符串，传递给from，同时指定编码生成一个新的 Buffer 实例
  const decodeImage = Buffer.from(base64Image, 'base64')

  // 比较两个Buffer实例的数据，并写到一个新的图片中
  console.log(Buffer.compare(buffer, decodeImage))
  console.log(buffer)
  console.log(decodeImage)
  fs.writeFile('img_decoded.jpg', decodeImage, function(err) {})
})
