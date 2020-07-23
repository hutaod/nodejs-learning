#!/usr/bin/env node

'use strict'
const pkg = require('../package.json')
const createServer = require('../index')

function printHelp (code = 0) {
  const lines = [
    '',
    '  Usage:',
    '    music-download [songName]',
    '',
    '  Options:',
    '    -v, --version             print the version of vc',
    '    -h, --help                display this message',
    '',
    '  Examples:',
    '    $ music-download Hello',
    ''
  ]

  console.log(lines.join('\n'))
  process.exit(code)
}

function printVersion () {
  console.log(`${pkg.name} ${pkg.version}`)
  process.exit()
}

// 启动函数
const main = argv => {
  // 1. 判断命令是否存在
  if (!argv || argv.length === 0) {
    printHelp(1)
  }

  // 获取解析后的参数，获取一个就移出一个
  const getArg = function () {
    let args = argv.shift()
    args = args.split('=')
    return args
  }

  const params = {}

  while (argv.length) {
    // 2. 获取合法命令，直到所有命令行参数都解析完毕或者程序退出
    const [key, val] = getArg()
    switch (key) {
      // 打印版本号
      case '-v':
      case '-V':
      case '--version':
        printVersion()
        break
      // 打印帮助信息
      case '-h':
      case '-H':
      case '--help':
        printHelp()
        break
      // 端口号
      case '-p':
      case '-P':
      case '-port':
        params.port = val
        break
      // server根目录设置
      case '-w':
      case '-wwwroot':
        params.wwwroot = val
        break
      default:
        // 当wwwroot没有明确指出的时候，且val不存在时
        // 默认认为key是用于设置wwwroot
        if (!params.wwwroot && !val) {
          params.wwwroot = key
        }
        break
    }
  }
  createServer(params)
}

// 启动程序就开始执行主函数
main(process.argv.slice(2))

module.exports = main
