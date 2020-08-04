const { promisify } = require('util')
module.exports.clone = async function download(repo, desc) {
  const ora = require('ora')
  const download = promisify(require('download-git-repo'))
  const downloadProcess = ora(`正在下载...${repo}`)
  const spinner = downloadProcess.start()
  setTimeout(() => {
    spinner.color = 'yellow'
    spinner.text = 'Loading rainbows'
  }, 1000)
  try {
    await download(repo, desc)
    downloadProcess.succeed('下载成功')
  } catch (error) {
    downloadProcess.fail('下载失败')
  }
  // download(repo, desc, err => {
  //   console.log(err ? 'Error' : 'success')
  //   if (err) {
  //     downloadProcess.fail('下载失败')
  //   } else {
  //     downloadProcess.succeed('下载成功')
  //   }
  // })
}
