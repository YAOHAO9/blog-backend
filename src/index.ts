
import * as RequireAll from 'require-all';
import * as bodyParser from 'body-parser';
import app, { errorHandler, notFoundHandler, sequelize } from './server';
import Moment from './models/moment.model';
import User from './models/user.model';

const start = async () => {
  // Start postgres
  await sequelize.sync();
  await new User().save();
  Moment.sync({ alter: true });
  // Init api
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  RequireAll(__dirname + '/api');
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