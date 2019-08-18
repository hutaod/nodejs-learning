const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(bodyParser())

const chatList = ['abc']

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})

app.get('/list', (req, res) => {
  res.end(JSON.stringify(chatList))
})

app.post('/send', (req, res) => {
  chatList.push(req.body.message)
  res.send(JSON.stringify(chatList))
})

app.post('/clear', (req, res) => {
  chatList.length = 0
  res.send(JSON.stringify(chatList))
})

app.listen(3000, () => {
  console.log('server at 3000')
})
