const delay = (data, tick) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, tick)
  })
}

module.exports = {
  getName() {
    return delay('hahaahah', 1000)
  },
  getAge() {
    return 20
  }
}
