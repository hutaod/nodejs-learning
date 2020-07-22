const fs = require("fs")
const http = require("http")
const request = require("request")
const child_process = require("child_process")
const EventEmitter = require("events").EventEmitter

const spawn = child_process.spawn
const exec = child_process.exec
// 这里声明了一坨变量，有的并没有使用，可以先不去管它们
const mp3Args = ['-i', 'pipe:0', '-f', 'mp3', '-ac', '2', '-ab', '128k', '-acodec', 'libmp3lame', 'pipe:1']
const mp4Args = ['-i', 'pipe:0', '-c', 'copy', '-bsf:a', 'aac_adtstoasc', 'pipe:1']

class VideoTool extends EventEmitter {
  constructor(url, filename) {
    super()
    this.url = url;
    this.filename = filename
  }

  mp4Tomp3() {
    // 创建 FFMPEG 进程
    this.ffmpeg = spawn('ffmpeg', mp3Args)

    // 拿到 Stream 流
    http.get(this.url, res => {
      res.pipe(this.ffmpeg.stdin)
    })

    // 把拿到的流 pipe到文件中
    this.ffmpeg.stdout.pipe(fs.createWriteStream(this.filename))

    this.ffmpeg.on('exit', () => {
      console.log('Finished:', this.filename)
    })
  }

  downloadMp4() {
    let stream = fs.createWriteStream(this.filename)
    request.get(this.url, {
      headers: {
        'Content-Type': 'video/mpeg4',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36'
      }
    })
    .pipe(stream)
    .on("open", () => {
      console.log('start download')
    }).on("close", () => {
      console.log('download finished')
    })
  }

  combineMp3ToMp4(videoFile, audioFile, outFile) {
    // 创建 FFMPEG 进程
    function puts(error, stdout, stderr) {
      stdout ? console.log('stdout: ' + stdout) : null;
      stderr ? console.log('stderr: ' + stderr) : null;
      error ? console.log('exec error: ' + error) : null;
    }
    exec(`ffmpeg -i ${videoFile} -i ${audioFile} -map 0:0 -map 1:0 ${outFile}`, puts)
  }
}

const video = 'http://vt1.doubanio.com/201810291353/4d7bcf6af730df6d9b4da321aa6d7faa/view/movie/M/402380210.mp4'
const m1 = new VideoTool(video, 'audio.mp3')
// const m2 = new VideoTool(video, 'video.mp4')

// // m1.mp4Tomp3()
// m2.downloadMp4()

m1.combineMp3ToMp4("video.mp4", "月光.mp3", "out.mp4")