#!/usr/bin/env node

const pkg = require("../package.json")

function printHelp(code = 0) {
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

  console.log(lines.join("\n"))
  process.exit(code)
}

function printVersion() {
  console.log(`${pkg.name} ${pkg.version}`)
  process.exit()
}

// 启动函数
const startUp = (arg) => {
  if(!arg) {
    printHelp(1)
  }
  switch (arg) {
    case "-V":
    case "-v":
    case "--version":
      printVersion()
      break;
    case "-H":
    case "-h":
    case "--help":
      printHelp()
      break;
    default:
      break;
  }
}

startUp(process.argv[2])