#!/usr/bin/env node

"use strict";

const arg = require("arg");
const pkg = require("../package.json");
const { replaceAudioInVideo } = require("../index");

function printHelp(code = 0) {
  const lines = [
    "",
    "  Usage:",
    "    mergeMedia -v 本地视频地址 -m 本地音频地址 -o 合并后输出视频地址",
    "",
    "  Options:",
    "    -h, --help                display this message",
    "    -v, --video               本地视频地址",
    "    -m, --music               本地音频地址",
    "    -o, --output              合并后输出视频地址",
    "",
    "  Examples:",
    "    $ mergeMedia Hello",
    "",
  ];

  console.log(lines.join("\n"));
  process.exit(code);
}

try {
  const argv = process.argv.slice(2);
  const args = arg({
    // 帮助
    "-h": Boolean,
    "-H": "-h",
    "--help": "-h",
    // 视频地址
    "-v": String,
    "--video": "-v",
    // 音频地址
    "-m": String,
    "--music": "-m",
    // 输出文件地址
    "-o": String,
    "--output": "-o",
  });
  if (!argv.length || args["-h"]) {
    printHelp();
  } else {
    replaceAudioInVideo(args["-v"], args["-m"], args["-o"]);
  }
} catch (error) {
  if (err.code === "ARG_UNKNOWN_OPTION") {
    console.log(err.message);
  } else {
    throw err;
  }
}
