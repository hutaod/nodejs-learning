module.exports = {
  interval: '30 * * * * *',
  handler() {
    console.log('定时任务 哈哈 每分钟第30秒执行一次' + new Date())
  }
}
