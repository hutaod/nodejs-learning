const fs = require("fs");

const typeExtPatternMap = {
  video: /\.mp4$/,
  audio: /\.mp3$/,
};

/**
 * 检查文件的正确性
 * @param {string} file
 * @param {"video" | "audio"} type
 */
module.exports = function checkFile(file, type) {
  if (!type) {
    throw new Error("type required");
  }

  if (!file) {
    throw new Error(`${type} file required`);
  }

  const extPattern = typeExtPatternMap[type];
  // 1. file 是否存在
  if (!fs.existsSync(file)) {
    throw new Error(`${type}:${file} not found`);
  }

  // 2 file 是否是文件
  const stat = fs.statSync(file);
  if (stat.isDirectory()) {
    throw new Error(`${type}:${file} is not a file`);
  }

  // 3 file是否是视频文件，暂时只支持mp4
  if (!extPattern.test(file)) {
    throw new Error(`${type}:${file} must be a mp4 file`);
  }
};
