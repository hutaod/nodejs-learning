#!/usr/bin/env node

const pkg = require('../package.json')
const emitter = require('../index')

function printVersion() {
  console.log(`souge-player ${pkg.version}`)
  process.exit()
}

function printHelp(code) {
  const lines = [
    '',
    '  Usage:',
    '    souge-player [songName]',
    '',
    '  Options:',
    '    -v, --version             print the version of vc',
    '    -h, --help                display this message',
    '',
    '  Examples:',
    '    $ souge-player Hello',
    '',
  ]

  console.log(lines.join('\n'))
  process.exit(code || 0)
}

// 包的入口函数，里面对参数做剪裁处理，拿到入参并给予不同入参的处理逻辑
const main = async argv => {
  if (!argv || argv.length === 0) {
    printHelp(1)
  }

  arg = argv[0] // 获取命令
  switch (arg) {
    case '-v':
    case '-V':
    case '--version':
      printVersion()
      break
    case '-h':
    case '-H':
    case '--help':
      printHelp()
      break
    default:
      // 启动搜索逻辑，同时传入参数
      emitter.emit('search', arg)
      break
  }
}

// 启动程序就开始执行主函数
main(process.argv.slice(2))

module.exports = main
