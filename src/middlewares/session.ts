

import { Request, Response, NextFunction } from 'express';
import { errorWrapper, redisClient } from '../server';
import User from '../models/User.model';
import { hash } from '../utils/Crypto';
import { getRandomName } from '../config/famousNames';

const loadSession = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    let user = req.cookies.user && await redisClient.getAsync(req.cookies.user)
    if (user) {
        req.session = { user: JSON.parse(user) }
    } else {
        user = await new User({ name: getRandomName() }).save();
        const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
        const key = hash(user.id + new Date().getTime() + '');
        redisClient.set(key, JSON.stringify(user));
        req.session = { user };
        res.cookie('user', key, { maxAge: tenYears, httpOnly: true })
    }
    next();
})

export default loadSession;