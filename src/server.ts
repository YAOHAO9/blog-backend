import * as express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Sequelize } from 'sequelize-typescript';

const app = express()
export default app;

// Connect postgresm'postgres://postgres@localhost:5432/mobileblog'
export const sequelize = new Sequelize({
  database: 'mobileblog',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  },
  username: 'postgres',
  password: '',
  modelPaths: [__dirname + '/models']
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
    return res.status(500).send({ message: e.message, stack: e.stack });
  }
  return next();
};

export const notFoundHandler = (_, res: Response) => {
  res.status(404).send({
    message: '404 not found',
  });
};