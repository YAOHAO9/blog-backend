import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, _: Response, next: NextFunction) => {
    if (req.session.user.isAdmin) {
        return next();
    }
    return next(new Error('You are not administration.'));
};

export default isAdmin;
