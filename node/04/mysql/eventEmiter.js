const { EventEmitter } = require('events')

const event = new EventEmitter()

event.on('helloworld', data => {
  console.log('helloworld', data)
})

event.once('hei', data => {
  console.log('hei', data)
})

setInterval(() => {
  event.emit('helloworld', new Date().getTime())
  event.emit('hei', new Date().getTime())
}, 1000)
