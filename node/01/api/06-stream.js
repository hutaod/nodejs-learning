const fs = require('fs')

const rs = fs.createReadStream('./2-1下载和安装.mp4')
const ws = fs.createWriteStream('./video.mp4')
// console.log(rs, ws)
rs.pipe(ws)
