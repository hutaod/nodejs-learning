const cluster = require('cluster')
const os = require('os')
const numCpus = os.cpus().length
const process = require('process')

console.log('numCpus', numCpus)
const workers = {}
if (cluster.isMaster) {
  // 开启多个进程
  for (var index = 0; index < numCpus; index++) {
    const worker = cluster.fork()
    workers[worker.pid] = worker
  }
  // 监听异常
  cluster.on('death', function(worker) {
    worker = cluster.fork()
    workers[worker.pid] = worker
  })
} else {
  const app = require('./app')
  app.use(async (ctx, next) => {
    console.log('worker', cluster.worker.id + ',Pid' + cluster.worker.pid)

    next()
  })
  app.listen(3000)
}

process.on('SIGTERM', function() {
  for (let pid in workers) {
    process.kill(pid)
  }
  process.exit(0)
})

require('./test')
