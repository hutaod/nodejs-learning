;(async () => {
  const { MongoClient: MongoDB } = require('mongodb')

  // 创建客户端
  const client = new MongoDB('mongodb://test:123456@localhost:27017', {
    useNewUrlParser: true
    // useUnifiedTopology: true
  })

  let ret
  // 创建链接
  ret = await client.connect()

  // console.log('client.db', ret)
  // console.log('ret', ret)
  const db = client.db('test')
  const fruits = db.collection('fruits')

  // 添加文档
  ret = await fruits.insertOne({
    name: '芒果',
    price: 11.2
  })

  // console.log('插入成功', JSON.stringify(ret, null, 2))

  // 更新文档
  ret = await fruits.updateOne(
    { name: '芒果' },
    {
      $set: {
        name: '苹果'
      }
    }
  )

  // 删除文档
  ret = await fruits.deleteOne({ name: '苹果' })
  // 删除所有
  ret = await fruits.deleteMany({ name: '苹果' })

  // 查询数据
  ret = await fruits.findOne()

  console.log('查询成功', JSON.stringify(ret, null, 2))
  console.log(await fruits.count())
  // const res = await fruits.find()

  client.close()
})()
