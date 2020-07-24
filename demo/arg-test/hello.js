const arg = require("./arg");

// `options` is an optional parameter
const args = arg(
  {
    // Types
    "--help": Boolean,
    "--version": Boolean,
    "--verbose": arg.COUNT, // Counts the number of times --verbose is passed
    "--port": Number, // --port <number> or --port=<number>
    "--name": String, // --name <string> or --name=<string>
    "--tag": [Number], // --tag <string> or --tag=<string>

    // Aliases
    "-v": "--verbose",
    "-n": "--name", // -n <string>; result is stored in --name
    "--label": "--name", // --label <string> or --label=<string>;
    //     result is stored in --name
    // "-aa": Number, // 不允许
  },
  (options = {
    permissive: false,
    argv: process.argv.slice(2),
    stopAtPositional: true,
  })
);

console.log(args);
