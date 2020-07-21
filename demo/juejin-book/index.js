const $ = require('cheerio')
const puppeteer = require('puppeteer')
const url = 'https://juejin.im/books'

/**
 * 获取页面信息
 * @param {html} html
 */
function getInfo(html) {
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
  // 1. 启动chrome 引擎实例
  const browser = await puppeteer.launch()
  // 2. 启动成功后，打开一个新页面
  const page = await browser.newPage()
  // 3. 新页面里面输入目标网址，跳到这个网页，一直等待页面加载完成，且至少有2个网络连接时触发（至少500毫秒后）
  await page.goto(link, { waitUntil: 'networkidle2' })
  // 4. 设置网页视窗的宽高
  await page.setViewport({ width: 1920, height: 900 })

  // 5. 等待 在页面自定义的方法执行完毕
  await page.evaluate(async () => {
    let height = 900 // 视窗的高度
    let pageNo = 1 // 当前页数
    // 视窗的高度 * 当前页数 <= body的高度的时候，都让window进行滚动，
    // 当到达底部的时候，或者到达底部时，pageNo再进行自增的时候，
    // 视窗的高度 * 当前页数 就大于了body的高度，这也是跳出循环的时机，且一定会出现
    while (pageNo * height <= document.body.offsetHeight) {
      pageNo++
      window.scrollTo(0, pageNo * height)
      // 滚动后需要等待一段时间才能获取document.body.offsetHeight的正确高度
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }
    return Promise.resolve()
  })
  // 6. 获取页面的内容
  const html = await page.content()
  getInfo(html)
  // 7. 最后关闭浏览器，销毁所有变量
  await browser.close()
  process.exit()
}

getJuejinBook(url)
