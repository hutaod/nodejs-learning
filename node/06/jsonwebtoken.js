const jsonwebtoken = require('jsonwebtoken')
const secret = '123456'
const opt = {}

const user = {
  uname: '傻彩彩',
  pwd: 'ccht'
}

const token = jsonwebtoken.sign(
  {
    data: user, // 加密内容
    // 设置token过期时间
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  },
  secret
)

console.log('生成token', token)

console.log('解码', jsonwebtoken.verify(token, secret))
console.log('解码', jsonwebtoken.verify(token, secret, opt))
