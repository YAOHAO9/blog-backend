

import { Request, Response, NextFunction } from 'express';
import { errorWrapper } from '../server';
import User from '../models/User.model';
import { encrypt, decrypt } from '../utils/Crypto';
import { getRandomName } from '../config/famousNames';

const loadSession = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    let user: User;
    let encrypted = req.query.encrypted || req.cookies.encrypted;
    if (encrypted) {
        try {
            const userId = decrypt(encrypted);
            user = await User.findById(+userId);
        } catch (e) { }
    }
    if (!user) {
        user = await new User({ name: getRandomName() }).save();
    }
    const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
    const key = encrypt(user.id + '');
    res.cookie('encrypted', key, { maxAge: tenYears, httpOnly: true })
    req.session = { user };
    if (req.path === '/api/user/redirect' && req.query.redirect) {
        return res.redirect(req.query.redirect);
    }
    next();
})

export default loadSession;