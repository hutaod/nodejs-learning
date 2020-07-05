# Buffer

from 和 alloc，他们里面关于 8kb 的部分，简言之就是 Node 会准备好了一个内存缓冲区，每次创建 Buffer 的时候，会尽量使用缓冲池里面已有的空闲内存，来节省申请内存本身的开销，如果大于 4k 直接申请新内存，如果小于 4kb 而空余的内存够用就直接用，不够用依然重新申请，整理如下：

- from 传入 ArrayBuffer，通过 FastBuffer（继承 Uint8Array） 来创建内存缓冲区
- from 传入 String，如果小于 4k 使用 8k 池创建（剩余空间不够用再去申请），大于 4k 调用 binding.createFromString() 创建
- from 传入 Object，小于 4k 使用 8k 池创建（剩余空间不够用再去申请），大于 4k 调用 createUnsafeBuffer()，这个 object 不是普通的 obj，需要支持 Symbol.toPrimitive or valueOf() 才可以，见这里。
- Buffer.alloc()，用给定字符填充一定长度的内存缓冲，或者用 0 填充
- Buffer.allocUnsafe()，小于 4k 使用 8k pook，大于 4k 调用 createUnsafeBuffer()
- Buffer.allocUnsafeSlow()，调用 createUnsafeBuffer()
