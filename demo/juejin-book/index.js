const $ = require('cheerio')
const puppeteer = require('puppeteer')
const rp = require('request-promise')
const url = 'https://juejin.im/books'

function getInfo(html) {
  // rp(url).then(function(html) {
  //   const books = $('.info', html)
  //   let totalSold = 0
  //   let totalSale = 0
  //   let totalBooks = books.length
  //   books.each(function() {
  //     const book = $(this)
  //     const price = $(book.find('.price-text'))
  //       .text()
  //       .replace('￥', '')
  //     const count = book
  //       .find('.message')
  //       .last()
  //       .find('span')
  //       .text()
  //       .split('人')[0]
  //     totalSale += Number(price) * Number(count)
  //     totalSold += Number(count)
  //   })
  //   // 最后打印出来
  //   console.log(
  //     `共 ${totalBooks} 本小册子`,
  //     `共 ${totalSold} 人次购买`,
  //     `约 ${Math.round(totalSale / 10000)} 万`
  //   )
  // })
  const books = $('.info', html)
  let totalSold = 0
  let totalSale = 0
  let totalBooks = books.length
  books.each(function() {
    const book = $(this)
    const price = $(book.find('.price-text'))
      .text()
      .replace('￥', '')
    const count = book
      .find('.message')
      .last()
      .find('span')
      .text()
      .split('人')[0]
    totalSale += Number(price) * Number(count)
    totalSold += Number(count)
  })
  // 最后打印出来
  console.log(
    `共 ${totalBooks} 本小册子`,
    `共 ${totalSold} 人次购买`,
    `约 ${Math.round(totalSale / 10000)} 万`
  )
}

async function getJuejinBook(link) {
  // 启动chrome 引擎实例
  const browser = await puppeteer.launch()
  // 启动成功后，打开一个新页面
  const page = await browser.newPage()
  // 新页面里面输入目标网址，跳到这个网页，一直等待页面加载完成
  await page.goto(link, { waitUntil: 'networkidle2' })
  const html = await page.content()
  getInfo(html)
  // // 设置网页视窗的宽高
  // await page.setViewport({ width: 1080, height: 1250 })
  // // 告诉 puppeteer 开始截图，直到截图完成，存储图片到当前目录
  // await page.screenshot({ path: Date.now() + '.png' })
  // // 最后关闭浏览器，销毁所有变量
  // await browser.close()
  process.exit()
}

getJuejinBook(url)
