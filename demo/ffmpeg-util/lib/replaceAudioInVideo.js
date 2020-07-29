const fs = require("fs");
const path = require("path");
const util = require("util");
const slog = require("single-line-log").stdout;
const child_process = require("child_process");
const stat = util.promisify(fs.stat);
const checkFile = require("./utils/checkFile");

/**
 * 替换视频中的音频
 * @param {string} videoFile 视频文件地址
 * @param {string} audioFile 音频文件地址
 * @param {string} outFile 输出视频文件地址
 */
module.exports = async function replaceAudioInVideo(
  videoFile,
  audioFile,
  outFile
) {
  // 检查参数是否存在
  if (arguments.length < 3) {
    console.log(
      `缺少必要参数，请输入视频文件地址/音频文件地址/输出视频文件地址`
    );
    return false;
  }

  // 1. 视频校验
  let errMsg = checkFile(videoFile, "video");
  if (errMsg) {
    return console.log(`视频${errMsg}`);
  }

  // 2. 音频校验
  errMsg = checkFile(audioFile, "audio");
  if (errMsg) {
    return console.log(`音频${errMsg}`);
  }

  // 3. 校验输出文件
  // 3.1 判断输出文件是否已经存在，存在的情况下不进行任何处理
  if (fs.existsSync(outFile) && fs.statSync(outFile).isFile()) {
    return console.log(`${outFile}已存在`);
  }

  // 3.2 对filename后缀进行校验
  if (!path.extname(outFile).endsWith(".mp4")) {
    return console.log(`${outFile}后缀名错误`);
  }

  // 4 开始进行合并视频和音频操作
  try {
    // 添加 -loglevel error 这使得它在正常情况下完全静音，并且只输出错误数据（到stderr），这通常是您从命令行程序所期望的。
    const ffmpeg = child_process.exec(
      `ffmpeg -i ${videoFile} -i ${audioFile} -map 0:0 -map 1:0 -shortest ${outFile} -loglevel error -progress pipe:1`
    );
    // 不清楚输出文件的大小，以输入视频文件的总大小为计算进度的值
    const videoStat = await stat(videoFile);
    const videoSize = videoStat.size;
    // 监听输出文件进度
    ffmpeg.stdout.on("data", function (data) {
      var tLines = data.toString().split("\n");
      var progress = {};
      for (var i = 0; i < tLines.length; i++) {
        var key = tLines[i].split("=");
        if (typeof key[0] != "undefined" && typeof key[1] != "undefined") {
          progress[key[0]] = key[1];
        }
      }
      let str = "";
      let mergeLength = Number(progress.total_size) || 0;
      if (progress.progress === "continue") {
        const current = Math.floor((mergeLength / videoSize) * 100);
        str = `合并进度：${current > 99 ? 99 : current}%`;
        slog(str);
        // console.log(progress);
      } else {
        console.log("合并完成！");
      }
    });
    // 错误监听
    ffmpeg.on("error", (error) => {
      throw new Error("exec error: " + error);
    });
  } catch (error) {
    console.log("error", error);
    // 抛出异常清除输出文件
    if (fs.existsSync(outFile) && fs.statSync(outFile).isFile()) {
      fs.unlinkSync(outFile);
    }
  }
};
