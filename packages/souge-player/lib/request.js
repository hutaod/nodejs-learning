const https = require('https')

module.exports = url => {
  return new Promise((resolve, reject) => {
    // TODO：地址栏出现中文会报错
    https.get(url, (req, res) => {
      let data = []
      req.on('data', chunk => {
        data.push(chunk)
      })
      req.on('end', () => {
        let body
        try {
          body = JSON.parse(data.join(''))
        } catch (error) {
          console.log('<== API 服务器可能挂了，稍后重试！ ==>')
        }

        resolve(body)
      })
    })
  })
}
