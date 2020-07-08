const https = require('https')
const Table = require('cli-table')
const cheerio = require('cheerio')
const link = (v, p) => `https://nodejs.org/dist/${v}/docs/api/${p}`

async function crawlPage(version, path = '') {
  const url = link(version, path)
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let buffer = ''
        res.on('data', chunk => {
          buffer += chunk
        })
        res.on('end', () => {
          resolve(buffer.toString())
        })
      })
      .on('error', err => {
        reject(err)
      })
  })
}

function findApiList(html) {
  const $ = cheerio.load(html)
  const items = $('#column2 ul')
    .eq(1)
    .find('a')
  const list = []

  items.each(item => {
    list.push({
      api: $(item).text(),
      path: $(item).attr('href'),
    })
  })

  return list
}

function findDeprecated(html) {
  const $ = cheerio.load(html)
  const items = $('.stability_0')
  const list = []

  items.each(item => {
    list.push(
      $(item)
        .text()
        .slice(0, 30)
    )
  })

  return list
}

async function crawlNode(version) {
  const homePage = await crawlPage(version)
  const apiList = findApiList(homePage)
  let deprecatedMap = {}
  const promises = apiList.map(async item => {
    const apiPage = await crawlPage(version, item.path)
    const list = findDeprecated(apiPage)
    return { api: item.api, list: list }
  })

  const deprecatedList = await Promise.all(promises)

  deprecatedList.forEach(item => {
    deprecatedMap[item.api] = item.list
  })

  return deprecatedMap
}

async function runTask(v1, v2, v3, v4) {
  const results = await Promise.all([
    crawlNode(v1),
    crawlNode(v2),
    crawlNode(v3),
    crawlNode(v4),
  ])

  const table = new Table({
    head: ['API Version', v1, v2, v3, v4],
  })

  const v1Map = results[0]
  const v2Map = results[1]
  const v3Map = results[2]
  const v4Map = results[3]
  const keys = Object.keys(v4Map)
  keys.forEach(key => {
    if (
      (v1Map[key] && v1Map[key].length) ||
      (v2Map[key] && v2Map[key].length) ||
      (v3Map[key] && v3Map[key].length) ||
      (v4Map[key] && v4Map[key].length)
    ) {
      // console.log(v1Map[key], v2Map[key], v3Map[key], v4Map[key])
      table.push([
        key,
        (v1Map[key] || []).join('\n'),
        (v2Map[key] || []).join('\n'),
        (v3Map[key] || []).join('\n'),
        (v4Map[key] || []).join('\n'),
      ])
    }
  })

  console.log(table.toString())
}

runTask('v4.9.1', 'v6.14.4', 'v8.11.4', 'v10.13.0')
