const https = require('https')
const Table = require('cli-table')
const cheerio = require('cheerio')
const compareVersions = require("compare-versions")
const link = (v, p) => `https://nodejs.org/dist/${v}/docs/api/${p}`

function request(url) {
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

function crawlPage(version, path = '') {
  const url = link(version, path)
  return request(url)
}

function findApiList (html) {
  const $ = cheerio.load(html)
  const items = $('#column2 ul')
    .eq(1)
    .find('a')
  const list = []

  items.each(function(item) {
    list.push({
      api: $(this).text(),
      path: $(this).attr('href')
    })
  })

  return list
}

function findDeprecatedList(html) {
  const $ = cheerio.load(html)
  const items = $('.stability_0')
  const list = []

  items.each(function () {
    list.push(
      $(this)
        .text()
        .slice(0, 30)
    )
  })

  return list
}

async function crawlNode (version) {
  const homePage = await crawlPage(version)
  const apiList = findApiList(homePage)
  let deprecatedMap = {
    // 'Command Line Options': ['']
  }
  const promises = apiList.map(async item => {
    const apiPage = await crawlPage(version, item.path)
    const list = findDeprecatedList(apiPage)

    return { api: item.api, list: list }
  })

  const deprecatedList = await Promise.all(promises)

  deprecatedList.forEach(item => {
    deprecatedMap[item.api] = item.list
  })

  return deprecatedMap
}

async function checkNodeApi(...versions) {
  if(!versions.length) return
  try {
    const results = await Promise.all(versions.map(v => crawlNode(v)))
  
    const table = new Table({
      head: ['API Version', ...versions],
    })
  
    const length = results.length
  
    const keys = Object.keys(results[length - 1])
    keys.forEach(key => {
      if (
        results.some(result => result[key] && result[key].length)
      ) {
        table.push([
          key,
          ...results.map(result => (result[key] || []).join('\n'))
        ])
      }
    })
  
    console.log(table.toString())
  } catch (error) {
    console.log(error)
  }
}

async function run(v) {
  const data = await request("https://nodejs.org/dist/index.json")
  const ltsList = JSON.parse(data).filter(node => {
    const cp = v ? compareVersions(node.version, 'v' + v + '.0.0') >= 0 : true
    return node.lts && cp
  }).map(lt => lt.version)
  checkNodeApi(...ltsList.slice(0, 10))
}

run(12)
