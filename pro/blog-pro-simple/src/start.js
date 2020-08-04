const Koa = require('koa')
const router = require('./routes')
const getLocalIpAdress = require("./utils/getLocalIpAdress")

const app = new Koa()

const IP = getLocalIpAdress()
const PORT = 11000
app.use(router.routes()).use(router.allowedMethods()).listen(PORT, () => {
  console.log(`server run at http://localhost:${PORT}`)
  console.log(`server run at http://${IP}:${PORT}`)
})
