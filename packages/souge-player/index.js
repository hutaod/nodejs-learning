// names 是拼接歌曲名称的一个方法
const names = require('./lib/names')
const EventEmitter = require('events')

// 声明一个继承 EventEmitter 的事件类
class Emitter extends EventEmitter {}
// 实例化一个事件实例
const emitter = new Emitter()

;['search', 'choose', 'find', 'play'].forEach(key => {
  // 加载 search/choose/find/play 四个模块方法
  const fn = require(`./lib/${key}`)
  emitter.on(key, async function(...args) {
    // 在事件回调里面，调用模块方法，无脑传入事件参数
    const res = await fn(...args)
    // 执行模块方法后，再触发一个新事件 handler
    // 同时把多个参数，如key/res继续丢过去
    this.emit('handler', key, res, ...args)
  })
})

// 搜索后触发 afterSearch，它回调里面继续触发 choose 事件
emitter.on('afterSearch', function(data, q) {
  if (!data || !data.result || !data.result.songs) {
    console.log(`没有搜索到 ${q} 的相关结果`)
    return process.exit(1)
  }
  const songs = data.result.songs
  this.emit('choose', songs)
})

// 在歌曲被选中后触发 afterSearch，它回调里面继续触发 find 事件
emitter.on('affterChoose', function(answers, songs) {
  const song = songs.find((song, i) => names(song, i) === answers.song)
  if (song && song.id) {
    console.log('歌曲信息拉取中...')
    this.emit('find', song.id)
  }
})

// 在歌曲被找到后，它回调里面触发 play 播放事件
emitter.on('afterFind', function(songs) {
  if (songs[0] && songs[0].url) {
    this.emit('play', songs[0].url)
  } else {
    console.log('歌曲或歌曲地址不存在', songs[0])
    process.exit(2)
  }
})

// 监听播放，并对播放结束后继续触发 playEnd
emitter.on('playing', function(player) {
  player.on('playend', item => {
    this.emit('playEnd')
  })
})

// 收到播放结束，退出程序
emitter.on('playEnd', function() {
  console.log('歌曲播放结束!')
  process.exit()
})

// 这里的handler 经见了多个事件的判断
// 为不同的事件增加不同的触发回调
emitter.on('handler', function(key, res, ...args) {
  switch (key) {
    case 'search':
      return this.emit('afterSearch', res, args[0])
    case 'choose':
      return this.emit('affterChoose', res, args[0])
    case 'find':
      return this.emit('afterFind', res)
    case 'play':
      return this.emit('playing', res)
  }
})

module.exports = emitter
