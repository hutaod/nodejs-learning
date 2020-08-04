var ffmpeg = require("fluent-ffmpeg");

var command = ffmpeg("video.mp4")
  .on("start", (commandLine) => {
    console.log(`spawned Ffmpg width commad：` + commandLine);
  })
  .on("progress", (progress) => {
    console.log(`Progressing：${progress.percent} % done`);
  })
  .on("end", () => {
    console.log("Finishd processing");
  })
  .addOptions(["-vcodec libx264", "-c:a aac", "-bufsize 3000k"])
  .save("test-transform2.flv");
