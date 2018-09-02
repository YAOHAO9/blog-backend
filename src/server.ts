import * as express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Sequelize } from 'sequelize-typescript';
import * as bluebird from 'bluebird';
import * as redis from 'redis';
import { Result } from './interfaces/Respond';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const app = express();
export default app;

export const sequelize = new Sequelize({
  database: 'mobileblog',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
    timestamps: true,
  },
  username: 'postgres',
  password: '',
  modelPaths: [__dirname + '/models'],
});

export const redisClient = redis.createClient();
redisClient.on('error', (e) => {
  console.log('Error ' + e);
});

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
