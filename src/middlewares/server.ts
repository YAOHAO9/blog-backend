import { RequestHandler, Response, NextFunction } from 'express';
import { Request } from 'express-serve-static-core';
import { Result } from '../interfaces/Respond';

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
        console.error(e);
        return res.status(500).json(new Result(e));
    }
    return next();
};

export const notFoundHandler = (_, res: Response) => {
    return res.status(404).json(new Result(new Error('Resource not found.')));
};
