// flagSymbol类型定义一个唯一变量
const flagSymbol = Symbol('arg flag')

/**
 * 解析命令行参数
 * @param {Object} opts 预定义命令规则
 * @param {{ argv = process.argv.slice(2), permissive = false, stopAtPositional = false }} options
 * argv: 命令行参数，默认wei为process.argv.slice(2)
 * permissive: 是否规避错误，默认有错误直接抛出异常
 * stopAtPositional: 是否设置在第一个参数处停止解析
 * @return {Object} result { _: [] } 解析成功的命令直接存入result作为属性，不规范命令放入`result._`数组
 */
function arg (
  opts,
  {
    argv = process.argv.slice(2),
    permissive = false,
    stopAtPositional = false
  } = {}
) {
  if (!opts) {
    throw new Error('Argument specification object is required')
  }

  const result = { _: [] }

  // 1. 处理预设置的命令、包含对命令设置的规则校验
  const aliases = {} // 存放与handlers中存在的命令的对应关系
  const handlers = {} // 存放需要执行的命令
  console.log(argv)
  for (const key of Object.keys(opts)) {
    // 命令key不能为空字符串
    if (!key) {
      throw new TypeError('Argument key cannot be an empty string')
    }

    // 命令key必须以'-'开头
    if (key[0] !== '-') {
      throw new TypeError(
        `Argument key must start with '-' but found: '${key}'`
      )
    }

    // 命令key长度等于1式，代表只有'-'，不允许这样的命令存在
    if (key.length === 1) {
      throw new TypeError(
        `Argument key must have a name; singular '-' keys are not allowed: ${key}`
      )
    }

    // 如果命令key对应的值是字符串，则放入aliases，并且代表不会是一个新的命令，直接继续下一个循环
    if (typeof opts[key] === 'string') {
      aliases[key] = opts[key]
      continue
    }

    let type = opts[key] // 获取命令类型
    let isFlag = false // 用于标识type是Boolean或者通过flagSymbol定义的类型
    if (
      Array.isArray(type) &&
      type.length === 1 &&
      typeof type[0] === 'function'
    ) {
      // 处理类型为数组情况，比如 "--tag": [Number]
      const [fn] = type
      // 改写type，让多次同一个命令的时候，把结构存入数组中进行保存
      type = (value, name, prev = []) => {
        prev.push(fn(value, name, prev[prev.length - 1]))
        return prev
      }
      // 判断是Boolean类型还是通过flagSymbol定义的类型
      isFlag = fn === Boolean || fn[flagSymbol] === true
    } else if (typeof type === 'function') {
      // 处理类型为function的情况
      // 判断是Boolean类型还是通过flagSymbol定义的类型
      isFlag = type === Boolean || type[flagSymbol] === true
    } else {
      // 类型必须是一个方法，否则抛出异常
      throw new TypeError(
        `Type missing or not a function or valid array type: ${key}`
      )
    }

    // 当type长度大于2时，第二个参数如果不是'-'，则type不符合规范
    // 说明一下key的规范（也是这里限制的规范）：单'-'后面只能有一个字符串，也就是最大长度为0
    // 长度大于2，三个字符串以上的时候，第二个字符就必须为'-'，否则就会在这里报错
    if (key[1] !== '-' && key.length > 2) {
      throw new TypeError(
        `Short argument keys (with a single hyphen) must have only one character: ${key}`
      )
    }

    // 把符合规范的命令存入handlers
    handlers[key] = [type, isFlag]
  }
  console.log(handlers)
  console.log(aliases)
  // 2. 循环处理命令行传递过来的参数，并对参数添加校验，参数可以是
  for (let i = 0, len = argv.length; i < len; i++) {
    const wholeArg = argv[i]

    // 当 stopAtPositional 为true 时，且result._已经存入了第一个参数，后面的参数就合并到result._中，并且跳出循环
    // 也就是说：当 stopAtPositional 为true 时，命令参数中间有一个不以'-'开头的参数，就会导致该参数后面的参数都不会被正确解析
    if (stopAtPositional && result._.length > 0) {
      result._ = result._.concat(argv.slice(i))
      break
    }

    // 如果参数为'--' ，则不处理剩余参数，直接把后面的参数就合并到result._中，并终止循环
    if (wholeArg === '--') {
      result._ = result._.concat(argv.slice(i + 1))
      break
    }
    console.log('wholeArg', wholeArg)
    // 判断参数是否合法（合法标志，第一个字符串必须为'-'，且长度大于1）
    if (wholeArg.length > 1 && wholeArg[0] === '-') {
      // 在这里进行分类处理
      // a. wholeArg[1] === '-' 说明是双'-'开头，表示长命令
      // b. wholeArg.length === 2 表示短命令，因为只有短命令长度才会为2
      // 也就是说长命令和正常的短命令都符合a和b条件，separatedArguments值就为[wholeArg]
      // 那什么情况下会走另外一种方式呢？答案：当短命令后面还跟有字符串的时候
      // 这里就是让因为短命令支持短命令缩写，也就是，比如：`-v`可以写成`-vvvv`
      // `-vvvv`会被解析成 ['-v','-v','-v','-v']，就会连续触发四次'-v'，在type为arg.COUNT时有效果
      // 比如`-vt` 会被解析成 ['-v','-t']，如果后面跟有参数，参数会被认为是最后一个命令的(这个后面进行处理)
      // 比如`-n=1` 会被解析成 ['-n','-=','-1']，这样会被认为是错误的
      const separatedArguments =
        wholeArg[1] === '-' || wholeArg.length === 2
          ? [wholeArg]
          : wholeArg
              .slice(1)
              .split('')
              .map(a => `-${a}`)
      // 正常来说separatedArguments的长度为1，只有短命令连续时缩写或者短命令用=赋值才会大于1（注意：短命令用=赋值是不允许的）
      for (let j = 0; j < separatedArguments.length; j++) {
        const arg = separatedArguments[j]
        // 长命令会解析=，也就是在这里进行支持长命令`=`赋值，而短命令不支持`=`赋值，这也是因为短命令需要支持缩写与这个有冲突
        // originalArgName 为命令行的key，argStr 为`=`后面部分
        const [originalArgName, argStr] =
          arg[1] === '-' ? arg.split(/=(.*)/, 2) : [arg, undefined]

        let argName = originalArgName
        // 判断argName是否在aliases中，在则让argName指向设置的对应命令，比如-n指向--name，这里就会把-n转换为--name
        while (argName in aliases) {
          argName = aliases[argName]
        }
        // console.log(111, originalArgName, arg, argStr)

        // 检查命令是否在预定义命令中，不在就会根据permissive的设置来进行处理
        // permissive 为 false 抛出异常 ---默认
        // permissive 为 true 终止当前命令处理，继续下一个命令解析
        if (!(argName in handlers)) {
          if (permissive) {
            result._.push(arg)
            continue
          } else {
            const err = new Error(
              `Unknown or unexpected option: ${originalArgName}`
            )
            err.code = 'ARG_UNKNOWN_OPTION'
            throw err
          }
        }

        const [type, isFlag] = handlers[argName]
        console.log(
          2,
          originalArgName,
          arg,
          argStr,
          type,
          isFlag,
          separatedArguments
        )

        // 短命令时，如果不是Boolean类型或者自定义的flagSymbol类型，缩写时该命令不是最后一个命令就会抛出异常
        // 分析什么情况下会抛出该异常，命令可以分为三种类型，
        // a. Boolean 不需要参数，且isFlag为true，不会走到这里来
        // b. 自定义的flagSymbol类型，isFlag为true，不会走到这里来（暂时这是设定的，自定义类型只有arg.COUNT）
        // c. 其他类型，其他类型时都需要传递参数，短命令其他类型也一样，再加上短命令只能通过`-n xxx`来进行赋值，所以，
        // 如果其他类型这时候后面还跟有命令，就会走入判断条件，抛出异常
        // 比如：`-vnv`，被解析成['-v', '-n', '-v'] 因为'-n'需要参数，就会抛出异常
        if (!isFlag && j + 1 < separatedArguments.length) {
          throw new TypeError(
            `Option requires argument (but was followed by another short argument): ${originalArgName}`
          )
        }
        // 如果是Boolean类型或者自定义的flagSymbol类型
        if (isFlag) {
          // 把命令行的key和val存入result中
          // Boolean类型时，val 为true，只用到第2个参数
          // flagSymbol类型 时，执行自定义的方法
          // 比如 arg.COUNT就是每次读取之前的结果传入自定义函数进行累加，只用到第3个参数
          result[argName] = type(true, argName, result[argName])
        } else if (argStr === undefined) {
          // 既不是Boolean类型或者自定义的flagSymbol类型时，就只有其他类型，
          // argStr 为 undefined说明未用`=`赋值，这时argv数组中下一个参数就是当前参数的值

          // 第一部分 argv.length < i + 2 是用来判断是否最后一个参数，是最后一个参数则进入判断条件内部
          // 第二部分 用于判断下一个参数的正确性，判断下一个参数是一个命令而不是Number类型或者BigInt的情况，是一个命令则进入判断条件内部
          if (
            argv.length < i + 2 ||
            (argv[i + 1].length > 1 &&
              argv[i + 1][0] === '-' &&
              !(
                argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) &&
                (type === Number ||
                  // eslint-disable-next-line no-undef
                  (typeof BigInt !== 'undefined' && type === BigInt))
              ))
          ) {
            // 进入该判断条件内部，说明其他类型没有传递给命令有效的值，则抛出异常

            // 根据正常命令错误还是alias命令出现的错误，抛出不同的异常错误提示
            const extended =
              originalArgName === argName ? '' : ` (alias for ${argName})`
            throw new Error(
              `Option requires argument: ${originalArgName}${extended}`
            )
          }
          // 把argv数组中下一个参数赋值给当前命令
          result[argName] = type(argv[i + 1], argName, result[argName])
          // ++i的原因是因为下一个参数被赋值给了当前命令，就需要跳过下一个参数进行解析
          ++i
        } else {
          // 走到这里也只有其他类型，且argStr有值
          // 这时直接把值传递给type，进行类型转换
          result[argName] = type(argStr, argName, result[argName])
        }
      }
    } else {
      // 命令行不合法，比如第一参数第一个字符串不为'-'，或者后面除了赋值的参数，有其他参数第一个字符串不为'-'的情况会走到这里来
      result._.push(wholeArg)
    }
  }

  return result
}

// 仅仅用于新建了一个flagSymbol类型
arg.flag = fn => {
  fn[flagSymbol] = true
  return fn
}

// 自定义类型实例，且标志为了flagSymbol类型
arg.COUNT = arg.flag((v, name, existingCount) => (existingCount || 0) + 1)

module.exports = arg
