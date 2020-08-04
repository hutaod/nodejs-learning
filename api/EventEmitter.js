const EventEmitter = require('events')

// const ee = new EventEmitter()

// // addListener和emitter.on一样，emitter.on(eventName, listener) 的别名
// ee.addListener('hello', (err, result) => {
//   console.log('addListener1', err, result)
// })
// ee.on('hello', (err, result) => {
//   console.log('addListener2', err, result)
// })
// console.log(ee.listeners('hello'))
// ee.emit('hello')

// 实现一个简单的EventEmitter
class CustomEventEmitter {
  eventObj = {}
  on(name, listener) {
    if (this.eventObj[name]) {
      this.eventObj[name].push(listener)
    } else {
      this.eventObj[name] = [listener]
    }
  }
  emit(name, ...args) {
    if (this.eventObj[name]) {
      this.eventObj[name].forEach(listener => {
        listener.call(this, ...args)
      })
    }
  }
}

class Player extends CustomEventEmitter {
  constructor(name) {
    super()
    this.name = name
    this.score = 0
  }
}

const player = new Player('Nice')

player.on('zombile', function(number) {
  this.score += number * 10
  console.log(`${this.name} 成功击杀 ${number} 个 zombie，总得分 ${this.score}`)
})

player.emit('zombile', 10)
player.emit('zombile', 10)
player.emit('zombile', 10)
