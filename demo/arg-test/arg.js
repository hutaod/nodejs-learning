const flagSymbol = Symbol("arg flag");

/**
 *
 * @param {*} opts
 * @param {*} param1
 * permissive: 是否规避错误，默认有错误直接抛出异常
 * stopAtPositional: 是否设置在第一个参数处停止解析
 */
function arg(
  opts,
  {
    argv = process.argv.slice(2),
    permissive = false,
    stopAtPositional = false,
  } = {}
) {
  if (!opts) {
    throw new Error("Argument specification object is required");
  }

  const result = { _: [] };

  // 1. 处理预设置的命令、包含对命令设置的规则校验
  const aliases = {}; // 存放与handlers中存在的命令的对应关系
  const handlers = {}; // 存放需要执行的命令
  console.log(argv);
  for (const key of Object.keys(opts)) {
    // 命令key不能为空字符串
    if (!key) {
      throw new TypeError("Argument key cannot be an empty string");
    }

    // 命令key必须以'-'开头
    if (key[0] !== "-") {
      throw new TypeError(
        `Argument key must start with '-' but found: '${key}'`
      );
    }

    // 命令key长度等于1式，代表只有'-'，不允许这样的命令存在
    if (key.length === 1) {
      throw new TypeError(
        `Argument key must have a name; singular '-' keys are not allowed: ${key}`
      );
    }

    // 如果命令key对应的值是字符串，则放入aliases，并且代表不会是一个新的命令，直接继续下一个循环
    if (typeof opts[key] === "string") {
      aliases[key] = opts[key];
      continue;
    }

    let type = opts[key]; // 获取命令类型
    let isFlag = false; // 用于标识type是Boolean或者通过flagSymbol定义的类型
    if (
      Array.isArray(type) &&
      type.length === 1 &&
      typeof type[0] === "function"
    ) {
      // 处理类型为数组情况，比如 "--tag": [Number]
      const [fn] = type;
      // 给type重新赋值
      type = (value, name, prev = []) => {
        prev.push(fn(value, name, prev[prev.length - 1]));
        return prev;
      };
      // 判断是Boolean类型还是通过flagSymbol定义的类型
      isFlag = fn === Boolean || fn[flagSymbol] === true;
    } else if (typeof type === "function") {
      // 处理类型为function的情况
      // 判断是Boolean类型还是通过flagSymbol定义的类型
      isFlag = type === Boolean || type[flagSymbol] === true;
    } else {
      // 类型必须是一个方法，否则抛出异常
      throw new TypeError(
        `Type missing or not a function or valid array type: ${key}`
      );
    }

    // 当type长度大于2时，第二个参数如果不是'-'，则type不符合规范
    // 说明一下key的规范（也是这里限制的规范）：单'-'后面只能有一个字符串，也就是最大长度为0
    // 长度大于2，三个字符串以上的时候，第二个字符就必须为'-'，否则就会在这里报错
    if (key[1] !== "-" && key.length > 2) {
      throw new TypeError(
        `Short argument keys (with a single hyphen) must have only one character: ${key}`
      );
    }

    // 把符合规范的命令存入handlers
    handlers[key] = [type, isFlag];
  }
  console.log(handlers);
  console.log(aliases);
  // 2. 循环处理命令行传递过来的参数，并对参数添加校验，参数可以是
  for (let i = 0, len = argv.length; i < len; i++) {
    const wholeArg = argv[i];

    // 当 stopAtPositional 为true 时，且result._已经存入了第一个参数，后面的参数就合并到result._中，并且跳出循环
    // 也就是说：当 stopAtPositional 为true 时，命令参数中间有一个不以'-'开头的参数，
    if (stopAtPositional && result._.length > 0) {
      result._ = result._.concat(argv.slice(i));
      break;
    }

    // 如果参数为'--' ，则
    if (wholeArg === "--") {
      result._ = result._.concat(argv.slice(i + 1));
      break;
    }
    console.log("wholeArg", wholeArg);
    if (wholeArg.length > 1 && wholeArg[0] === "-") {
      /* eslint-disable operator-linebreak */
      const separatedArguments =
        wholeArg[1] === "-" || wholeArg.length === 2
          ? [wholeArg]
          : wholeArg
              .slice(1)
              .split("")
              .map((a) => `-${a}`);
      /* eslint-enable operator-linebreak */
      for (let j = 0; j < separatedArguments.length; j++) {
        const arg = separatedArguments[j];
        const [originalArgName, argStr] =
          arg[1] === "-" ? arg.split(/=(.*)/, 2) : [arg, undefined];
        console.log(originalArgName, argStr);

        let argName = originalArgName;
        while (argName in aliases) {
          argName = aliases[argName];
        }
        console.log(originalArgName, argName);

        if (!(argName in handlers)) {
          if (permissive) {
            result._.push(arg);
            continue;
          } else {
            const err = new Error(
              `Unknown or unexpected option: ${originalArgName}`
            );
            err.code = "ARG_UNKNOWN_OPTION";
            throw err;
          }
        }

        const [type, isFlag] = handlers[argName];

        if (!isFlag && j + 1 < separatedArguments.length) {
          throw new TypeError(
            `Option requires argument (but was followed by another short argument): ${originalArgName}`
          );
        }

        if (isFlag) {
          result[argName] = type(true, argName, result[argName]);
        } else if (argStr === undefined) {
          if (
            argv.length < i + 2 ||
            (argv[i + 1].length > 1 &&
              argv[i + 1][0] === "-" &&
              !(
                argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) &&
                (type === Number ||
                  // eslint-disable-next-line no-undef
                  (typeof BigInt !== "undefined" && type === BigInt))
              ))
          ) {
            const extended =
              originalArgName === argName ? "" : ` (alias for ${argName})`;
            throw new Error(
              `Option requires argument: ${originalArgName}${extended}`
            );
          }

          result[argName] = type(argv[i + 1], argName, result[argName]);
          ++i;
        } else {
          result[argName] = type(argStr, argName, result[argName]);
        }
      }
    } else {
      result._.push(wholeArg);
    }
  }

  return result;
}

arg.flag = (fn) => {
  fn[flagSymbol] = true;
  return fn;
};

// Utility types
arg.COUNT = arg.flag((v, name, existingCount) => (existingCount || 0) + 1);

module.exports = arg;
