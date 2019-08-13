// 只用于最后一个参数是回调函数的函数，比如function fn(a, cb){}
// const newFn = promisify(fn)
// newFn(a)  => 会执行promise方法
function promisify(fn) {
  return function(...args) {
    // 返回promise的实例
    return new Promise(function(reslove, reject) {
      // newFn(a) 时会执行到这里向下执行
      // 加入参数cb => newFn(a)
      args.push(function(err, data) {
        if (err) {
          reject(err)
        } else {
          reslove(data)
        }
      })
      // 这里才是函数真正执行的地方执行newFn(a, cb)
      fn.apply(null, args)
    })
  }
}

const fs = require('fs')
const readFile = promisify(fs.readFile)
readFile('./sample/index.js')
  .then(data => {
    console.log(data.toString())
  })
  .catch(err => {
    console.log('error:', err)
  })
// function test(a, cb) {
//   console.log(a)
//   setTimeout(() => {
//     cb(123)
//   }, 1000)
// }

// test(a, function(err, data) {
//   console.log(err, data)
// })

// module.exports = promisify
