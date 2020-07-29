# ffmpeg-tool ffmpeg工具
  
## 功能列表

- 提取视频中的音频 getAudioFromVideo
- 替换视频中的音频 replaceAudioInVideo

## 测试

测试命令：`npm run test <方法名> `

```bash
# 测试 `提取视频中的音频`方法
npm run test getAudioFromVideo 
# 测试 `替换视频中的音频`方法
npm run test replaceAudioInVideo 
```

## ffmpeg 功能点

```js
const exec = child_process.exec;
// 下面这种方式可以把音频合并到视频中，但如果音频比视频的时间长，输出的新视频的时长等于音频的时长
exec(`ffmpeg -i ${videoFile} -i ${audioFile} -map 0:0 -map 1:0 ${outFile}`)
// 如果音频比视频长，在输出文件名之前添加`-shortest`，输出的新视频的时长不会变
exec(`ffmpeg -i ${videoFile} -i ${audioFile} -map 0:0 -map 1:0 -shortest ${outFile}`)
```

以上都没有指定编解码器，ffmpeg 会自动选择

## 参考资料

[ffmpeg-替换视频中的音频](https://qastack.cn/superuser/1137612/ffmpeg-replace-audio-in-video)