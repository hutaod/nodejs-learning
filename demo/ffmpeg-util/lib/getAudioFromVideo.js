const fs = require("fs");
const http = require("http");
const path = require("path");
const child_process = require("child_process");
const spawn = child_process.spawn;
const checkFile = require("./utils/checkFile")

// 这里声明了一坨变量，有的并没有使用，可以先不去管它们
const mp3Args = [
  "-i",
  "pipe:0",
  "-f",
  "mp3",
  "-ac",
  "2",
  "-ab",
  "128k",
  "-acodec",
  "libmp3lame",
  "pipe:1",
];

/**
 * 提取视频中的音频
 * @param {string} videoUrl 视频地址
 * @param {string} filename 输出文件名
 */
module.exports = function getAudioFromVideo(videoUrl, filename) {
  if (!videoUrl || !filename) {
    console.log(`缺少必要参数`);
    return false;
  }

  // 1. 校验输出文件
  // 1.1 判断输出文件是否已经存在，存在的情况下不进行任何处理
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    return console.log(`${filename}已存在`);
  }
  // 1.2 对filename后缀进行校验
  if (!path.extname(filename).endsWith(".mp3")) {
    return console.log(`${filename}后缀名错误`);
  }

  // 2. 创建 FFMPEG 进程
  const ffmpeg = spawn("ffmpeg", mp3Args);

  // 3. 校验videoUrl是否是http链接
  if (/^https?:\/\//.test(videoUrl)) {
    try {
      // 拿到 Stream 流
      http.get(videoUrl, (res) => {
        res.pipe(ffmpeg.stdin);
        res.on("error", (err) => {
          console.log("response error", err);
        });
      });
    } catch (error) {
      throw new Error("视频http地址错误！");
    }
  } else {
    // 4. 本地链接时，进行一系列校验
    const errMsg = checkFile(videoUrl, "video")
    if(errMsg) {
      return console.log(`视频${errMsg}`);
    }

    const rs = fs.createReadStream(videoUrl);
    rs.pipe(ffmpeg.stdin);
  }

  const ws = fs.createWriteStream(filename);

  // 5. 把 ffmpeg 获取到的流都 pipe 到 输出文件
  ffmpeg.stdout.pipe(ws);
  ffmpeg.on("exit", () => {
    console.log("Finished:", filename);
  });
};
