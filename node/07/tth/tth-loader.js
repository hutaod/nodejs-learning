const fs = require('fs')
const path = require('path')
const router = require('koa-router')

function load(dir, cb) {
  // 获取文件夹绝对路径
  const url = path.resolve(__dirname, dir)
  const files = fs.readdirSync(filename)
  Object.keys(files).forEach(filename => {
    // 去掉后缀名
    const filename = filename.replace('.js', '')
    // 导入文件
    const file = fs.readFileSync(url + '/' + filename)
    // 处理逻辑
    cb(filename, file)
  })
}
