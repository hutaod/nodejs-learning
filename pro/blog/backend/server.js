const path = require("path")
const App = require("./app")
// 启动后端服务
const app = new App({
  rootPath: path.resolve(__dirname, '')
})
app.start(11000)

