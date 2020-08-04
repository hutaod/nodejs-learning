;(async () => {
  const mysql = require('mysql2/promise')
  // 连接配置
  const cfg = {
    host: 'localhost',
    user: 'root',
    password: 'hutao123',
    database: 'test'
  }
  const conn = await mysql.createConnection(cfg)
  console.log('连接成功')

  // 创建Table
  const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
    id INT NOT NULL AUTO_INCREMENT,
    message VARCHAR(45) NULL,
    PRIMARY KEY (id))`

  let ret = await conn.execute(CREATE_SQL)
  console.log('create', ret)

  const INSERT_SQL = `insert into test(message) values(?)`
  ret = await conn.execute(INSERT_SQL, ['abc'])
  console.log('insert: ', ret)

  const SELECT_SQL = `select * from test`
  const [rows, fields] = await conn.execute(SELECT_SQL)
  // console.log('select: ', rows, fields)
})()
