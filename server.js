'use strict';

const cluster = require('cluster');

let workerNum = 3;

if (cluster.isMaster) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('master is starting ... ...');
  
  for (let i = 0; i < workerNum; i++) {
    cluster.fork();
  }

  cluster.on('listening', (worker, addr) => {
    console.log(`worker - ${addr} - ${worker.process.pid} started.`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('************************');
    console.log(`worker - ${worker.procee.pid} died with code - ${code}`);
    console.log('rebooting ... ...')    
    console.log('************************');

    cluster.fork();
  });
  console.log('server is ready now !');
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
} else {
  require('./index.js');
}



