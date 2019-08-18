;(async () => {
  const Sequelize = require('sequelize')
  // 建立连接
  const sequelize = new Sequelize('test', 'root', 'hutao123', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
  })

  // 定义模型
  const Fruit = sequelize.define(
    'Fruit',
    {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        get() {
          const fname = this.getDataValue('name')
          const price = this.getDataValue('price')
          const stock = this.getDataValue('stock')
          return `${fname}(价格：￥${price} 库存：${stock}kg)`
        }
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          isFloat: { msg: '价格字段请输入数字' },
          min: { args: [0], msg: '价格字段必须大于0' }
        }
      },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 }
    },
    {
      timestamps: false,
      tableName: 'HT_FRUIT',
      getterMethods: {
        amount() {
          return this.getDataValue('stock') + 'kg'
        }
      },
      setterMethods: {
        amount(val) {
          const idx = val.indexOf('kg')
          const v = val.slice(0, idx)
          this.setDataValue('stock', v)
        }
      }
    }
  )

  Fruit.classify = function(name) {
    const tropicFruits = ['香蕉', '芒果', '椰子'] // 热带水果
    return tropicFruits.includes(name) ? '热带水果' : '其他水果'
  }

  Fruit.prototype.totalPrice = function(count) {
    return (this.price * count).toFixed(2)
  }
  //
  // 使用类方法
  ;['香蕉', '草莓'].forEach(f => console.log(f + '是' + Fruit.classify(f)))

  // 同步数据库，force: true则会删除已存在表
  // let ret = await Fruit.sync({ force: true })
  let ret = await Fruit.sync()
  // console.log('sync', ret)

  ret = await Fruit.create({
    name: '苹果',
    price: 4.5
  })
  // console.log('create', ret)

  // 更新
  ret = await Fruit.update(
    { price: 4 },
    {
      where: {
        name: '苹果'
      }
    }
  )
  const Op = Sequelize.Op
  // 查询
  ret = await Fruit.findAll({
    where: {
      price: {
        [Op.lte]: 4,
        [Op.gt]: 2
      }
    }
  })
  // console.log('findAll:', JSON.stringify(ret, null, 2))
  console.log(ret[0].amount)
  // 修改库存
  ret[0].amount = '150kg'
  // 保存
  ret[0].save()
  // console.log('findAll:', JSON.stringify(ret, null, 2))
  console.log(`买5kg${ret[0].name}需要¥${ret[0].totalPrice(5)}`)

  // 通过属性查询
  Fruit.findOne({ where: { name: '香蕉' } }).then(fruit => {
    // fruit是首个匹配项，若没有则为null
    console.log(fruit.get())
  })
  // 指定查询字段
  Fruit.findOne({ attributes: ['name', 'price'] }).then(fruit => {
    // fruit是首个匹配项，若没有则为null
    console.log(fruit.get())
  })

  // 获取数据和总条数
  Fruit.findAndCountAll().then(result => {
    console.log(result.count)
    console.log(result.rows.length)
  })

  // 或语句
  Fruit.findAll({
    // where: { [Op.or]:[{price: { [Op.lt]:4 }}, {stock: { [Op.gte]: 100 }}] }
    where: { price: { [Op.or]: [{ [Op.gt]: 3 }, { [Op.lt]: 2 }] } }
  }).then(fruits => {
    console.log(fruits[0].get())
  })

  // 分页
  Fruit.findAll({
    offset: 0,
    limit: 2
  }).then(fruits => {
    // console.log('分页:', JSON.stringify(fruits, null, 2))
  })

  // 排序
  Fruit.findAll({
    order: [['price', 'DESC']]
  }).then(fruits => {
    // console.log('排序:', JSON.stringify(fruits, null, 2))
  })

  // 聚合
  Fruit.max('price').then(max => {
    console.log('max', max)
  })
  Fruit.sum('price').then(sum => {
    console.log('sum', sum)
  })
  // 更新
  Fruit.findById('1').then(fruit => {
    // 方式1
    fruit.price = 4
    fruit.save().then(() => console.log('update!!!!'))
  })
  // 方式2
  Fruit.update({ price: 4 }, { where: { id: '1' } }).then(r => {
    console.log(r)
    console.log('update!!!!')
  })

  // 删除
  // 方式1
  Fruit.findOne({ where: { id: '1' } }).then(r => r && r.destroy())
  // 方式2
  Fruit.destroy({ where: { id: '1' } }).then(r => console.log(r))
})()
