;(async () => {
  const { MongoClient: MongoDB } = require('mongodb')

  // 创建客户端
  const client = new MongoDB('mongo:localhost:27017', {
    useNewUrlParser: true
  })

  let ret
  // 创建链接
  res = await client.connect()

  console.log(res)
})()
