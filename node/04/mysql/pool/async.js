const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

const asyncFunc = async (func, curMax = 4, sum = 200) => {
  let num = 0
  let curNum = 0 // 有多少个在同时执行
  console.log('beginTime:' + new Date().toLocaleDateString())
  const result = []
  while (num !== sum) {
    if (curNum <= curMax) {
      result.push(
        new Promise(async resolve => {
          console.log(`Process Run 并发数：${curNum} 完成：${num}/${sum}`)
          res = await func()
          curNum--
          resolve(res)
        })
      )
      num++
      curNum++
    } else {
      await sleep(1)
    }
  }

  console.log('endTime:' + new Date().toLocaleDateString())
}

module.exports = {
  asyncFunc
}

// 测试
// const test = async () => {
//   const delay = (Math.random() * 1000).toFixed()
//   await sleep(delay)
// }

// setTimeout(() => asyncFunc(test, 10, 100))
