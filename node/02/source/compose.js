const add = (x, y) => x + y
const square = z => z * z

// const compose = (fn1, fn2) => (...args) => fn2(fn1(...args))

// 同步compose
// const compose = (...[first, ...others]) => (...args) => {
//   let ret = first(...args)
//   others.forEach(fn => {
//     ret = fn(ret)
//   })
//   return ret
// }

// const fn = compose(
//   add,
//   square
// )
// // const fn = (x, y) => square(add(x, y))
// console.log(fn(1, 2))

// 异步compose
function compose(middlewares) {
  return function() {
    // 执行第1个
    return dispatch(0)

    function dispatch(i) {
      let fn = middlewares(i)
      if (!fn) {
        return Promise.resolve()
      }

      return Promise.resolve(
        fn(function next() {
          // 执行下一个
          return dispatch(i + 1)
        })
      )
    }
  }
}
