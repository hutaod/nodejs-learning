const { program, Command } = require('./commander')
// const commander = require("commander")
// console.log(commander === program) // true
program.version('0.0.1')
// console.log(program)

program.option('-d --debug', 'output extra debugging')
program
  .option('-w', 'test only one flag', )
  .option('-s,--small', 'small pizza size', )
  .option('-p, --pizza-type, <type>', 'flavour of pizza')
  // .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue')
  // .option('--no-cheese', 'plain with no cheese');

// program
//   .option('--no-sauce', 'Remove sauce')
//   .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
//   .option('--no-cheese', 'plain with no cheese')

program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  });
// clone xxx xxx

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .action(function(cmdValue, envValue) {
    console.log('command:', cmdValue);
    console.log('environment:', envValue || 'no environment given');
  });

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmdObj) {
    console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''))
  })
// 必须在调用 .parse() 之前
program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ custom-help --help');
});
program.parse(process.argv)

// console.log(program.opts())
if (program.debug) console.log(program.opts())
console.log('pizza details:')
if (program.small) console.log('- small pizza size')
if (program.pizzaType) console.log(`- ${program.pizzaType}`)

