const cluster = require('cluster');
const express = require('express');
const app = express();
const numCPUs = require('os').cpus().length;
const port = process.env.PORT || 3000; // port comes from environment variable or 3000
const uuidv1 = require('uuid/v1');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  cluster.worker.id = uuidv1(); //set worker id to uuid

  app.use((req, res, next) => {
    res.status(200).json({
      ua: req.headers['user-agent'],
      ip: req.header('x-forwarded-for') || req.connection.remoteAddress, // get ip address even if server is behind proxy 
      uuid: cluster.worker.id
    });
  });
  app.listen(port);

  console.log(`Worker ${process.pid} started with id ${cluster.worker.id}`);
}