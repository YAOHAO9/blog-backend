import * as express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Sequelize } from 'sequelize-typescript';
import * as bluebird from 'bluebird';
import * as redis from 'redis';
import { Result } from './interfaces/Respond';
import Config from './config';
import AccessRecord from './models/AccessRecord.model';
import Archive from './models/Archive.model';
import Article from './models/Article.model';
import ArticleApprove from './models/ArticleApprove.model';
import ArticleDisapprove from './models/ArticleDisapprove.model';
import Chat from './models/Chat.model';
import Discussion from './models/Discussion.model';
import Moment from './models/Moment.model';
import MomentApprove from './models/MomentApprove.model';
import MomentDisapprove from './models/MomentDisapprove.model';
import User from './models/User.model';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const app = express();
export default app;

export const sequelize = new Sequelize(Config.sequelize);

export const redisClient = redis.createClient();
redisClient.on('error', (e) => {
  console.log('Error ' + e);
});

export const initializeSequelize = async () => {
  await sequelize.validate();
  await AccessRecord.sync({ alter: true });
  await Archive.sync({ alter: true });
  await Article.sync({ alter: true });
  await ArticleApprove.sync({ alter: true });
  await ArticleDisapprove.sync({ alter: true });
  await Chat.sync({ alter: true });
  await Discussion.sync({ alter: true });
  await Moment.sync({ alter: true });
  await MomentApprove.sync({ alter: true });
  await MomentDisapprove.sync({ alter: true });
  await User.sync({ alter: true });
};

export const errorWrapper = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export const errorHandler = (e: Error, _: Request, res: Response, next: () => void) => {
  if (e) {
    return res.status(500).json(new Result(e));
  }
  return next();
};

export const notFoundHandler = (_, res: Response) => {
  return res.status(404).json(new Result(new Error('Resource not found.')));
};
