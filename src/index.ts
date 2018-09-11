
import * as initializeCustomeApi from 'require-all';
import app, { initializeSequelize, server } from './server';
import initializeRestfulApi from './restful';
import { initializeMiddlewares } from './middlewares';
import { errorHandler, notFoundHandler } from './middlewares/server';
import { initializeSocketIO } from './sockets';

const start = async () => {
  // socket.io
  initializeSocketIO();

  // Start postgres
  await initializeSequelize();

  // Middlewares
  initializeMiddlewares();

  // api
  initializeCustomeApi(__dirname + '/apis');
  initializeRestfulApi();

  // error
  app.use(errorHandler);
  app.use('*', notFoundHandler);

  // config port
  const port = process.env.PORT || 3000;
  server.listen(port);
  console.log(`Server listen at port: ${port}`);
};

start()
  .catch((e) => {
    console.error(e);
  });
