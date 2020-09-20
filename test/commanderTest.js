const { program, Command } = require('./commander')
// const commander = require("commander")
// console.log(commander === program) // true
// program.version('0.0.1')
// console.log(program)

program.option('-d --debug', 'output extra debugging')
program
  .option('-w', 'test only one flag', )
  .option('-s,--small', 'small pizza size', )
  .option('-p, --pizza-type, <type>', 'flavour of pizza')

program.parse(process.argv)

console.log(program.opts())
if (program.debug) console.log(program.opts())
console.log('pizza details:')
if (program.small) console.log('- small pizza size')
if (program.pizzaType) console.log(`- ${program.pizzaType}`)
