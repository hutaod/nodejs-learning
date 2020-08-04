const https = require('https')
const $ = require('cheerio')

const request = url => {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = ''
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          resolve(data.toString())
        })
      })
      .on('error', err => {
        reject(err)
      })
  })
}

async function run(url) {
  try {
    const html = await request(url)
    const items = $('aside li a', html)
    const menus = []
    items.each(function(index, ele) {
      menus.push($(ele).text())
    })
    console.log(menus)
  } catch (error) {
    console.log('err')
  }
}

const url = 'https://nodejs.org/en/get-involved/code-and-learn/'

run(url)
