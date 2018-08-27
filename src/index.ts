
import * as initializeCustomeApi from 'require-all';
import * as bodyParser from 'body-parser';
import app, { errorHandler, notFoundHandler, sequelize } from './server';
import initializeRestfulApi from './restful';

const start = async () => {
  // Start postgres
  await sequelize.sync();

  // config
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // api
  initializeCustomeApi(__dirname + '/api');
  initializeRestfulApi();

  // error 
  app.use(errorHandler);
  app.use('*', notFoundHandler);

  // config port 
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Listening on: ' + port);
  });
}

start()
  .catch(e => {
    console.error(e)
  })