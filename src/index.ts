
import * as initializeCustomeApi from 'require-all';
import app, { errorHandler, notFoundHandler, initializeSequelize } from './server';
import initializeRestfulApi from './restful';
import { initializeMiddlewares } from './middlewares';

const start = async () => {
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
  app.listen(port, () => {
    console.log('Listening on: ' + port);
  });
};

start()
  .catch((e) => {
    console.error(e);
  });
