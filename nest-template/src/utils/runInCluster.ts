export function runInCluster(bootstrap: () => Promise<void>) {
  const numberOfCores = require('os').cpus().length;

  if (require('cluster').isMaster) {
    for (let i = 0; i < numberOfCores; i++) {
      require('cluster').fork();
    }
  } else {
    bootstrap();
  }
}
